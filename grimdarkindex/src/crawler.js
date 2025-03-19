import puppeteer from 'puppeteer';
import fs from 'fs';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import pLimit from 'p-limit';

const baseUrl = 'https://39k.pro';
const limit = pLimit(5);

async function fetchPage(url, expectEnhancements = false, expectStratagems = false, expectArmyRules = false) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });

    let enhancements = [];
    let stratagems = [];
    let armyRules = [];

    if (expectEnhancements) {
      await page.waitForSelector('.enhancements', { timeout: 15000 });
      const headingHandles = await page.$$('.collapsible_header');
      for (const el of headingHandles) {
        await el.click();
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      await page.waitForSelector('.enhancement_rule', { timeout: 5000 });

      enhancements = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.enhancement')).map(el => {
          const name = el.querySelector('.enhancement_name')?.innerText.trim() || "";
          const ruleText = el.querySelector('.enhancement_rule')?.innerHTML.trim() || "";
          const costMatch = ruleText.match(/Cost: (\d+)/);
          const points = costMatch ? parseInt(costMatch[1]) : 0;
          return { name, points, rules: ruleText };
        });
      });
    }

    if (expectStratagems) {
      await page.waitForSelector('.stratagems', { timeout: 10000 });
      stratagems = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.stratagem')).map(el => {
          const name = el.querySelector('.stratagem_name')?.innerText.trim() || "";
          const costMatch = el.querySelector('.stratagem_cost')?.innerText.match(/CP: (\d+)/);
          const commandPointCost = costMatch ? parseInt(costMatch[1]) : 0;
          const rules = el.querySelector('.stratagem_rules')?.innerText.trim() || "";
          return { name, commandPointCost, rules };
        });
      });
    }

    if (expectArmyRules) {
      await page.waitForSelector('.collapsible_header', { timeout: 10000 });
      const ruleHandles = await page.$$('.army_rule_header');
      for (const el of ruleHandles) {
        await el.click();
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      await page.waitForSelector('.collapsible_header div', { timeout: 5000 });

      armyRules = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.collapsible_header')).map(el => {
          const name = el.querySelector('.army_rule_header')?.innerText.trim() || "";
          
          // Hitta regeln som ligger i nästa syskon-div efter .collapsible_header
          const rulesContainer = el.nextElementSibling; 
          const rules = rulesContainer ? rulesContainer.innerText.trim() : "";
      
          return { name, rules };
        });
      });
      
    }

    const content = await page.content();
    await browser.close();
    const $ = cheerio.load(content);
    return { $, content, enhancements, stratagems, armyRules };
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    await browser.close();
    return null;
  }
}


async function extractDetachmentData(detachmentLink, detachmentName) {
  console.log(`Fetching detachment page: ${baseUrl + detachmentLink}`);
  const pageData = await fetchPage(baseUrl + detachmentLink, true, true);
  if (!pageData) return null;

  const { enhancements, stratagems, $ } = pageData;
  const allRules = [];

  $('h2').filter((_, el) => $(el).text().trim() === 'Rules')
    .nextAll('.rule')
    .each((_, el) => {
      const ruleText = $(el).text().trim();
      if (ruleText) {
        allRules.push({ ruleName: '', ruleText });
      }
    });

  return {
    name: detachmentName,
    detachmentRules: allRules.map(rule => ({ rule: rule.ruleText })),
    enhancements,
    stratagems
  };
}

async function extractFactionData(factionPageData, factionName) {
  const { $, armyRules } = factionPageData;
  const detachments = [];
  const datasheets = [];

  console.log(`Extracted Army Rules for ${factionName}:`, armyRules);

  // Extract detachment links
  const detachmentLinks = [];
  $('a[href^="/detachment/"]').each((_, el) => {
    const detachmentName = $(el).text().trim();
    const detachmentLink = $(el).attr('href');
    if (detachmentName && detachmentLink) {
      detachmentLinks.push({ name: detachmentName, link: detachmentLink });
    }
  });

  // Fetch detachment data
  const detachmentPromises = detachmentLinks.map(({ name, link }) =>
    extractDetachmentData(link, name).then(data => { if (data) detachments.push(data); })
  );
  await Promise.all(detachmentPromises);

  // Extract datasheets
  $('a[href^="/datasheet/"]').each((_, el) => {
    const datasheetName = $(el).text().trim();
    if (datasheetName) datasheets.push(datasheetName);
  });

  return { faction: factionName, armyRules, detachments, datasheets };
}




async function crawlWebsite() {
  const factions = [];
  console.log(`Fetching main page: ${baseUrl}`);
  const pageData = await fetchPage(baseUrl);
  if (!pageData) return;
  const { $ } = pageData;

  const factionLinks = [];
  $('a[href^="/faction/"]').each((_, el) => {
    const link = $(el).attr('href');
    const factionName = $(el).text().trim();
    if (link && factionName) {
      factionLinks.push({ link, name: factionName });
    }
  });

  for (const { link, name } of factionLinks) {
    console.log(`Fetching faction page: ${baseUrl + link}`);
    const factionPageData = await fetchPage(baseUrl + link, false, false, true); // Enable army rules extraction
    if (!factionPageData) continue;
    const factionData = await extractFactionData(factionPageData, name);
    factions.push(factionData);
  }

  fs.writeFileSync('factions.json', JSON.stringify(factions, null, 2));
  console.log('Data saved to factions.json');
}

crawlWebsite().catch(console.error);
