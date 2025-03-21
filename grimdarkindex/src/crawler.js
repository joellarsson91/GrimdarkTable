import puppeteer from 'puppeteer';
import fs from 'fs';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import pLimit from 'p-limit';

const baseUrl = 'https://39k.pro';
const limit = pLimit(5);

let browser;

async function launchBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({ headless: true });
  }
}

async function fetchPage(url, expectEnhancements = false, expectStratagems = false, expectArmyRules = false) {
  await launchBrowser();
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    let enhancements = [];
    let stratagems = [];
    let armyRules = [];

    if (expectEnhancements) {
      try {
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
            const costMatch = ruleText.match(/Cost: (\\d+)/);
            const points = costMatch ? parseInt(costMatch[1]) : 0;
            return { name, points, rules: ruleText };
          });
        });
      } catch (error) {
        console.error(`Enhancements not found or timeout for ${url}:`, error);
      }
    }

    if (expectStratagems) {
      try {
        await page.waitForSelector('.stratagems', { timeout: 10000 });
        stratagems = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('.stratagem')).map(el => {
            const name = el.querySelector('.stratagem_name')?.innerText.trim() || "";
            const costMatch = el.querySelector('.stratagem_cost')?.innerText.match(/CP: (\\d+)/);
            const commandPointCost = costMatch ? parseInt(costMatch[1]) : 0;
            const rules = el.querySelector('.stratagem_rules')?.innerText.trim() || "";
            return { name, commandPointCost, rules };
          });
        });
      } catch (error) {
        console.error(`Stratagems not found or timeout for ${url}:`, error);
      }
    }

    if (expectArmyRules) {
      try {
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
            const rulesContainer = el.nextElementSibling;
            const rules = rulesContainer ? rulesContainer.innerText.trim() : "";
            return { name, rules };
          });
        });
      } catch (error) {
        console.error(`Army rules not found or timeout for ${url}:`, error);
      }
    }

    const content = await page.content();
    const $ = cheerio.load(content);
    return { $, content, enhancements, stratagems, armyRules };
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  } finally {
    await page.close();
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

async function extractDatasheetData(datasheetLink, datasheetName) {
  console.log(`Fetching datasheet: ${baseUrl + datasheetLink}`);
  await launchBrowser();
  const page = await browser.newPage();
  try {
    await page.goto(baseUrl + datasheetLink, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('.datacard', { timeout: 15000 });
    
    const collapsibleHeaders = await page.$$('.collapsible_header');
    for (const header of collapsibleHeaders) {
      await header.click();
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    const content = await page.content();
    const $ = cheerio.load(content);
    
    const name = $('.datacard .name').text().trim();
    
    const characteristics = {};
    const headers = [];
    $('.datacard .characteristics_header > div').each((i, el) => {
      headers.push($(el).text().trim());
    });
    const values = [];
    $('.datacard .characteristics > div').each((i, el) => {
      values.push($(el).text().trim());
    });
    headers.forEach((header, index) => {
      characteristics[header] = values[index] || '';
    });
    
    const invulSave = $('.datacard .invulnerable_save.header').text().trim();
    
    const weapons = [];
    $('.datacard .weapons_melee .weapon').each((i, el) => {
      const weaponName = $(el).find('.weapon_name').text().trim();
      const weaponCharacteristics = {};
      $(el).find('.weapon_characteristics > div').each((j, elem) => {
        const key = $(elem).attr('class') || `stat${j}`;
        const value = $(elem).text().trim();
        weaponCharacteristics[key] = value;
      });
      const weaponAbilities = [];
      $(el).find('.weapon_abilities .weapon_ability').each((j, elem) => {
        weaponAbilities.push($(elem).text().trim());
      });
      weapons.push({ name: weaponName, characteristics: weaponCharacteristics, abilities: weaponAbilities });
    });
    
    const abilities = [];
    $('.datacard .abilities .ability').each((i, el) => {
      const abilityName = $(el).find('.ability_name').text().trim();
      const abilityRule = $(el).find('.ability_rule').text().trim();
      if (abilityName || abilityRule) {
        abilities.push({ name: abilityName, rule: abilityRule });
      }
    });
    
    const unitComposition = $('.datacard .unit_composition .composition').text().trim();
    
    const ledBy = [];
    $('.datacard .collapsible_header').each((i, el) => {
      const headerText = $(el).text().trim();
      if (headerText === 'Led By') {
        $(el).parent().next().find('a').each((j, a) => {
          ledBy.push($(a).text().trim());
        });
      }
    });
    
    const keywords = [];
    $('.datacard .collapsible_header').each((i, el) => {
      const headerText = $(el).text().trim();
      if (headerText === 'Keywords') {
        $(el).parent().next().find('.keywords').each((j, elem) => {
          keywords.push($(elem).text().trim());
        });
      }
    });
    
    return {
      name: datasheetName || name,
      characteristics,
      invulnerableSave: invulSave,
      weapons,
      abilities,
      unitComposition,
      ledBy,
      keywords
    };
  } catch (error) {
    console.error(`Error fetching datasheet ${baseUrl + datasheetLink}:`, error);
    return null;
  } finally {
    await page.close();
  }
}

async function extractFactionData(factionPageData, factionName) {
  const { $, armyRules } = factionPageData;
  const detachments = [];
  const datasheets = [];
  console.log(`Extracted Army Rules for ${factionName}:`, armyRules);

  // Extrahera detachment-länkar
  const detachmentLinks = [];
  $('a[href^="/detachment/"]').each((_, el) => {
    const detachmentName = $(el).text().trim();
    const detachmentLink = $(el).attr('href');
    if (detachmentName && detachmentLink) {
      detachmentLinks.push({ name: detachmentName, link: detachmentLink });
    }
  });

  const detachmentPromises = detachmentLinks.map(({ name, link }) =>
    limit(() => extractDetachmentData(link, name).then(data => { if (data) detachments.push(data); }))
  );
  await Promise.all(detachmentPromises);

  // Extrahera datasheet-länkar och hämta datasheet-data
  const datasheetLinks = [];
  $('a[href^="/datasheet/"]').each((_, el) => {
    const datasheetName = $(el).text().trim();
    const datasheetLink = $(el).attr('href');
    if (datasheetName && datasheetLink) {
      datasheetLinks.push({ name: datasheetName, link: datasheetLink });
    }
  });

  const datasheetPromises = datasheetLinks.map(({ name, link }) =>
    limit(() => extractDatasheetData(link, name).then(data => { if (data) datasheets.push(data); }))
  );
  await Promise.all(datasheetPromises);

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
    const factionPageData = await fetchPage(baseUrl + link, false, false, true);
    if (!factionPageData) continue;
    const factionData = await extractFactionData(factionPageData, name);
    factions.push(factionData);
  }

  fs.writeFileSync('factions.json', JSON.stringify(factions, null, 2));
  console.log('Data saved to factions.json');

  if (browser) {
    await browser.close();
  }
}

crawlWebsite().catch(console.error);
