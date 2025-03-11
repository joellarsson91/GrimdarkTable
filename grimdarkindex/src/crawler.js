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

async function fetchFactionData(factionUrls) {
  const results = await Promise.allSettled(
    factionUrls.map(url => limit(() => fetchWithRetry(url)))
  );
  return results.filter(res => res.status === 'fulfilled').map(res => res.value);
}

async function fetchPage(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 200000 });
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    await browser.close();
    return null;  // Return null or handle it differently
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
    $('.collapsible_header').each((index, element) => {
        const ruleName = $(element).find('.enhancement_name, .stratagem_name').text().trim();
        if (ruleName) {
            console.log('Extracted Rule:', ruleName);
            allRules.push(ruleName);
        }
    });

    // Assuming first 4 are enhancements and next 6 are stratagems
    const enhancements = allRules.slice(0, 4);
    const stratagems = allRules.slice(4, 10);

    console.log(`Extracted Enhancements:`, enhancements);
    console.log(`Extracted Stratagems:`, stratagems);

    return {
        name: detachmentName,
        rules: [], // If there are actual separate detachment rules, extract them separately
        enhancements,
        stratagems,
    };
}



/**
 * Extracts faction data, including rules, detachments, and datasheets.
 */
async function extractFactionData($, factionName) {
  const rules = [];
  const detachments = [];
  const datasheets = [];

  // Extract rules names (without links)
  $('a[href^="/rules/"]').each((index, element) => {
    const ruleName = $(element).text().trim();
    if (ruleName) {
      rules.push(ruleName); // Store just the name
    }
  });

  // Extract detachment names and process each detachment page
  const detachmentLinks = [];
  $('a[href^="/detachment/"]').each((index, element) => {
    const detachmentName = $(element).text().trim();
    const detachmentLink = $(element).attr('href');
    if (detachmentName && detachmentLink) {
      detachmentLinks.push({ name: detachmentName, link: detachmentLink });
    }
  });

  for (const { name, link } of detachmentLinks) {
    const detachmentData = await extractDetachmentData(link, name);
    if (detachmentData) {
      detachments.push(detachmentData);
    }
  }

  // Extract datasheet names (without links)
  $('a[href^="/datasheet/"]').each((index, element) => {
    const datasheetName = $(element).text().trim();
    if (datasheetName) {
      datasheets.push(datasheetName); // Store just the name
    }
  });

  return {
    faction: factionName,
    rules,
    detachments,
    datasheets,
  };
}

/**
 * Crawls the website to collect faction details.
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
