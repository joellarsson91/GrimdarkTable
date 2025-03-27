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
            const costMatch = ruleText.match(/Cost: (\d+)/);
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
            const costMatch = el.querySelector('.stratagem_cost')?.innerText.match(/CP: (\d+)/);
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

    // Uncollapse all collapsible headers
    const collapsibleHeaders = await page.$$('.collapsible_header');
    for (const header of collapsibleHeaders) {
      await header.click();
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait for content to load
    }

    const content = await page.content();
    const $ = cheerio.load(content);

    const name = $('.datacard .name').text().trim();

    // Extract characteristics
    const characteristics = {};
    $('.datacard .characteristics_header div').each((index, el) => {
      const key = $(el).text().trim();
      const value = $('.datacard .characteristics div').eq(index).text().trim();
      if (key && value) {
        characteristics[key] = value;
      }
    });

    // Extract invulnerable save
    const invulnerableSave = $('.datacard .invulnerable_save').text().trim() || '';

    // Extract weapons
    const weapons = [];
    $('.datacard .weapons_ranged, .datacard .weapons_melee').each((_, section) => {
      $(section).find('.weapon').each((_, weapon) => {
        const weaponNames = $(weapon).find('.weapon_name').map((_, el) => $(el).text().trim()).get();
        const weaponCharacteristics = $(weapon).find('.weapon_characteristics');
        const weaponAbilities = $(weapon).find('.weapon_abilities');

        weaponNames.forEach((weaponName, index) => {
          const characteristics = {};
          weaponCharacteristics.eq(index).find('div').each((i, char) => {
            const key = $('.weapon_headers div').eq(i).text().trim();
            const value = $(char).text().trim();
            if (key && value) {
              characteristics[key.toLowerCase()] = value;
            }
          });

          const abilities = [];
          weaponAbilities.eq(index).find('.weapon_ability').each((_, ability) => {
            abilities.push($(ability).text().trim());
          });

          weapons.push({
            name: weaponName,
            characteristics,
            abilities,
          });
        });
      });
    });

    // Extract faction abilities
    const factionAbilities = [];
    $('.datacard .abilities').find('.faction_ability').each((_, el) => {
      const abilityName = $(el).text().trim();
      if (abilityName) {
        factionAbilities.push(abilityName);
      }
    });

    // Extract datasheet abilities
    const datasheetAbilities = [];
    $('.datacard .abilities .ability').each((_, ability) => {
      const abilityName = $(ability).find('.ability_name').text().trim();
      const abilityRule = $(ability).find('.ability_rule').text().trim();
      datasheetAbilities.push({
        name: abilityName,
        rule: abilityRule,
      });
    });

    // Updated logic for extracting unit composition and point costs
    const unitComposition = [];
    const pointCosts = [];

    // Extract unit composition
    $('.datacard .unit_composition .composition').each((_, el) => {
      const compositionText = $(el).text().trim();
      if (compositionText) {
        const lines = compositionText.split('\n').map(line => line.trim());
        lines.forEach(line => {
          const match = line.match(/■\s*(\d+[-\d]*)\s*(.+)/); // Match count and model name
          if (match) {
            const count = match[1];
            const modelName = match[2];
            unitComposition.push({ modelName, count });
          }
        });
      }
    });

    // Extract point costs
    $('.datacard .unit_composition table tbody tr').each((_, row) => {
      const modelNames = $(row).find('td').eq(0).find('div').map((_, el) => $(el).text().trim()).get();
      const counts = $(row).find('td').eq(1).find('div').map((_, el) => $(el).text().trim()).get();
      const points = parseInt($(row).find('td').eq(2).text().trim(), 10);

      if (modelNames.length && counts.length && !isNaN(points)) {
        const combinedModels = modelNames.map((modelName, index) => ({
          modelName,
          count: counts[index] || '',
        }));
        pointCosts.push({ models: combinedModels, points });
      }
    });

    // Extract wargear options
    const wargearOptions = [];
    $('.datacard .wargear_rule').each((_, el) => {
      const wargearText = $(el).text().trim();
      if (wargearText) {
        wargearOptions.push(wargearText);
      }
    });

    // Extract "Led By"
    const ledBy = [];
    $('.datacard .collapsible_header').each((index, el) => {
      const headerText = $(el).text().trim();
      if (headerText === 'Led By') {
        const leaders = $(el).next('div').find('ul li a');
        leaders.each((_, a) => {
          const leaderName = $(a).text().trim();
          if (leaderName) {
            ledBy.push(leaderName);
          }
        });
      }
    });

    // Extract keywords
    const factionKeywords = $('.datacard .faction_keywords').text().trim();
    const keywords = [];
    $('.datacard .keywords .keyword').each((_, el) => {
      const keyword = $(el).text().trim();
      if (keyword) {
        keywords.push(keyword);
      }
    });

    if (keywords.length === 0) {
      const keywordsText = $('.datacard .keywords').text().trim();
      if (keywordsText) {
        keywords.push(...keywordsText.split(',').map(k => k.trim()));
      }
    }

    return {
      name: datasheetName || name,
      characteristics,
      invulnerableSave,
      weapons,
      abilities: {
        factionAbilities,
        datasheetAbilities,
      },
      unitComposition,
      pointCosts, // Include extracted point costs
      wargearOptions,
      ledBy,
      keywords: {
        factionKeywords,
        keywords,
      },
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

async function crawlWebsite(limitFactions = false) {
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

  const maxFactions = limitFactions ? 3 : factionLinks.length;
  for (const { link, name } of factionLinks.slice(0, maxFactions)) {
    console.log(`Fetching faction page: ${baseUrl + link}`);
    const factionPageData = await fetchPage(baseUrl + link, false, false, true);
    if (!factionPageData) continue;

    const factionData = await extractFactionData(factionPageData, name);
    factions.push(factionData);
  }

  const outputFileName = limitFactions ? 'factionsTest.json' : 'factions.json';
  fs.writeFileSync(outputFileName, JSON.stringify(factions, null, 2));
  console.log(`Data saved to ${outputFileName}`);

  if (browser) {
    await browser.close();
  }
}

const args = process.argv.slice(2);
const limitFactions = args.includes('--limit');
crawlWebsite(limitFactions).catch(console.error);