import puppeteer from 'puppeteer';
import fs from 'fs';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import pLimit from 'p-limit';

const baseUrl = 'https://39k.pro';

const limit = pLimit(5); // Adjust concurrency limit to prevent overload
const cache = new Map(); // Cache responses to avoid redundant requests

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text(); // Use text() instead of json() for HTML content
  } finally {
    clearTimeout(id);
  }
}

async function fetchWithRetry(url, retries = 3) {
  if (cache.has(url)) return cache.get(url);

  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Fetching: ${url}`);
      const data = await fetchWithTimeout(url);
      cache.set(url, data);
      return data;
    } catch (error) {
      console.warn(`Retrying ${url} (${i + 1}/${retries}) due to error: ${error.message}`);
      await delay(1000 * (i + 1)); // Exponential backoff
    }
  }
  throw new Error(`Failed to fetch ${url} after ${retries} attempts`);
}

async function fetchPage(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 200000 });
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    await browser.close();
    return null;
  }
  

  const content = await page.content();  // Get fully rendered HTML
  await browser.close();
  return cheerio.load(content);
}

/**
 * Extracts detachment-specific details (rules, enhancements, stratagems)
 */
async function extractDetachmentData(detachmentLink, detachmentName) {
  console.log(`Fetching detachment page: ${baseUrl + detachmentLink}`);
  const $ = await fetchPage(baseUrl + detachmentLink);
  if (!$) return null;

  // Extract all rules (includes enhancements and stratagems)
  const allRules = [];

  // Find the <h2> element with text 'Rules' and extract all .rule elements after it
  const rulesSection = $('h2').filter((index, element) => $(element).text().trim() === 'Rules');

  // Extract all the .rule elements that come after the <h2>Rules</h2> element
  rulesSection.nextAll('.rule').each((index, element) => {
    const ruleText = $(element).text().trim();
    if (ruleText) {
      console.log('Extracted Detachment Rule:', ruleText);
      allRules.push({ ruleName: '', ruleText });  // Empty ruleName for now, just extract ruleText
    }
  });

  // Now let's extract enhancements based on the new structure you provided
  const enhancements = [];
  $('.enhancements .enhancement').each((index, element) => {
    const nameElement = $(element).find('.enhancement_name');
    const ruleElement = $(element).find('.enhancement_rule');
    
    // Check if the elements exist before accessing their content
    const name = nameElement.length ? nameElement.text().trim() : '';
    const ruleText = ruleElement.length ? ruleElement.html().trim() : '';
    
    // Extract the cost from the ruleText
    const costMatch = ruleText.match(/Cost: (\d+)/);
    const points = costMatch ? parseInt(costMatch[1]) : 0;  // Default to 0 if no cost is found

    if (name && ruleText) {
      enhancements.push({
        name,
        points,
        rules: ruleText,
      });
      // Focused logging for enhancements
      console.log(`Found Enhancement: Name - ${name}`);
      console.log(`Found Enhancement: Cost - ${points}`);
      console.log(`Found Enhancement: Rule - ${ruleText}`);
    } else {
      if (!name) console.log('No enhancement name found.');
      if (!ruleText) console.log('No enhancement rule found.');
      if (!points) console.log('No enhancement cost found.');
    }
  });

  // Handle stratagems with the same logic if necessary (not modified here)
  const stratagems = [];

  console.log(`Extracted Detachment Rules:`, allRules);
  console.log(`Extracted Enhancements:`, enhancements);
  console.log(`Extracted Stratagems:`, stratagems);

  return {
    name: detachmentName,
    detachmentRules: allRules.map(rule => ({ rule: rule.ruleText })),
    enhancements,
    stratagems,
  };
}

/**
 * Extracts faction data, including rules, detachments, and datasheets.
 */
async function extractFactionData($, factionName) {
  const armyRules = [];
  const detachments = [];
  const datasheets = [];

  // Extract army rules names and their corresponding texts
  console.log('Start extracting army rules...');
  $('.army-rule').each((index, element) => {
    const ruleName = $(element).find('.rule_name').text().trim();
    const ruleText = $(element).find('.rule_text').text().trim();  // Adjust selector based on actual HTML
    if (ruleName && ruleText) {
      armyRules.push({
        name: ruleName,
        rules: ruleText,
      });
    }
  });

  console.log('Army Rules:', armyRules);

  // Extract detachment links and process each in parallel
  const detachmentLinks = [];
  $('a[href^="/detachment/"]').each((index, element) => {
    const detachmentName = $(element).text().trim();
    const detachmentLink = $(element).attr('href');
    if (detachmentName && detachmentLink) {
      detachmentLinks.push({ name: detachmentName, link: detachmentLink });
    }
  });

  // Use Promise.all to fetch and process all detachment data concurrently
  const detachmentPromises = detachmentLinks.map(({ name, link }) =>
    extractDetachmentData(link, name).then(detachmentData => {
      if (detachmentData) {
        detachments.push(detachmentData);
      }
    })
  );

  // Wait for all detachment data to be fetched
  await Promise.all(detachmentPromises);

  // Extract datasheet names (without links)
  $('a[href^="/datasheet/"]').each((index, element) => {
    const datasheetName = $(element).text().trim();
    if (datasheetName) {
      datasheets.push(datasheetName); // Store just the name
    }
  });

  return {
    faction: factionName,
    armyRules,
    detachments,
    datasheets,
  };
}


/**
 * Crawls the website to collect faction details
 */
async function crawlWebsite() {
  const factions = [];

  console.log(`Fetching main page: ${baseUrl}`);
  const $ = await fetchPage(baseUrl);
  if (!$) return;

  // Extract faction links
  const factionLinks = [];
  $('a[href^="/faction/"]').each((index, element) => {
    const link = $(element).attr('href');
    const factionName = $(element).text().trim();
    if (link && factionName) {
      console.log(`Found faction: ${factionName} -> ${baseUrl + link}`);
      factionLinks.push({ link, name: factionName });
    }
  });

  console.log(`Found ${factionLinks.length} factions`);

  // Fetch each faction's page
  for (const { link, name } of factionLinks) {
    console.log(`Fetching faction page: ${baseUrl + link}`);
    const factionPage = await fetchPage(baseUrl + link);
    if (factionPage) {
      const factionData = await extractFactionData(factionPage, name);
      console.log(`Extracted data for faction: ${factionData.faction}`);
      factions.push(factionData);
    } else {
      console.log(`Failed to fetch faction page: ${baseUrl + link}`);
    }
  }

  // Save extracted data
  fs.writeFileSync('factions.json', JSON.stringify(factions, null, 2));
  console.log('Data saved to factions.json');
}

// Run the crawler
crawlWebsite().catch(console.error);
