#!/usr/bin/env node
/**
 * Publikuje nové články blogu a nové termíny kruhů na facebookovou stránku.
 *
 * Spouští ho workflow .github/workflows/facebook.yml po každém pushi do main.
 * Bere jen soubory, které v tomto pushi přibyly (`git diff --diff-filter=A`),
 * takže úprava staršího článku nic nepublikuje.
 *
 * Potřebné proměnné prostředí:
 *   FB_PAGE_ID     – ID stránky (61596421073730)
 *   FB_PAGE_TOKEN  – dlouhodobý Page access token s pages_manage_posts
 *   BEFORE_SHA     – commit před pushem (z GitHub Actions), nepovinné
 *   AFTER_SHA      – aktuální commit, nepovinné (default HEAD)
 *   DRY_RUN=1      – jen vypíše, co by publikovalo
 *
 * Události na Facebooku tímhle vytvořit nelze — Graph API je pro běžné aplikace
 * neumožňuje (přístup k Events mají jen Marketing Partneři). Termín proto jde
 * jako běžný příspěvek s odkazem na web; událost se zakládá ručně v Meta
 * Business Suite (u opakovaného kruhu stačí jedna opakovaná událost).
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const SITE = 'https://putovnykruh.cz';
const API_VERSION = process.env.FB_API_VERSION ?? 'v27.0';
const PAGE_ID = (process.env.FB_PAGE_ID ?? '').trim();
const TOKEN = (process.env.FB_PAGE_TOKEN ?? '').trim();
const DRY_RUN = process.env.DRY_RUN === '1';
const BEFORE_SHA = (process.env.BEFORE_SHA ?? '').trim();
const AFTER_SHA = (process.env.AFTER_SHA ?? 'HEAD').trim() || 'HEAD';

const CZ_MONTHS = [
  'ledna', 'února', 'března', 'dubna', 'května', 'června',
  'července', 'srpna', 'září', 'října', 'listopadu', 'prosince',
];

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

/** Soubory přidané v tomto pushi. Při ručním spuštění padá na HEAD~1. */
function addedFiles() {
  const base = BEFORE_SHA && !/^0+$/.test(BEFORE_SHA) ? BEFORE_SHA : 'HEAD~1';
  try {
    return git(['diff', '--diff-filter=A', '--name-only', base, AFTER_SHA])
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  } catch (error) {
    console.warn(`Diff ${base}..${AFTER_SHA} nešel spočítat: ${error.message}`);
    return [];
  }
}

/** Minimální YAML parser na plochý frontmatter (nested pole ignoruje). */
function frontmatter(file) {
  const raw = readFileSync(file, 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!kv) continue;
    let value = kv[2].trim();
    if (value.length > 1 && value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    } else if (value.length > 1 && value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
    }
    if (value !== '') data[kv[1]] = value;
  }
  return data;
}

/** "2026-11-19T17:30" → "19. listopadu 2026 v 17:30" (bez převodu časových zón). */
function formatPrague(raw) {
  const match = (raw ?? '').match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!match) return raw ?? '';
  const [, year, month, day, hour, minute] = match;
  const monthName = CZ_MONTHS[Number(month) - 1] ?? month;
  return `${Number(day)}. ${monthName} ${year} v ${hour}:${minute}`;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Cloudflare nasazuje až po pushi — počkej, než odkaz vrátí 200, ať má FB co načíst. */
async function waitForUrl(url, attempts = 30, delayMs = 10_000) {
  for (let i = 1; i <= attempts; i += 1) {
    try {
      const response = await fetch(url, { redirect: 'follow' });
      if (response.ok) return true;
    } catch {
      // web ještě neběží, zkusíme znovu
    }
    if (i < attempts) await sleep(delayMs);
  }
  return false;
}

/** Přinutí Facebook znovu načíst OG data (jinak zůstane stará/rozbitá náhledovka). */
async function rescrape(url) {
  try {
    const params = new URLSearchParams({ id: url, scrape: 'true', access_token: TOKEN });
    const response = await fetch(`https://graph.facebook.com/${API_VERSION}/`, {
      method: 'POST',
      body: params,
    });
    if (!response.ok) console.warn(`Scrape ${url} → ${response.status}`);
  } catch (error) {
    console.warn(`Scrape ${url} selhal: ${error.message}`);
  }
}

async function publish({ message, link, label }) {
  if (DRY_RUN) {
    console.log(`\n--- DRY RUN: ${label}`);
    console.log(message);
    console.log(`ODKAZ: ${link}`);
    return true;
  }

  const ready = await waitForUrl(link);
  if (!ready) {
    console.error(`Web nevrací 200 pro ${link} — nepublikuji ${label}.`);
    return false;
  }
  await rescrape(link);

  const params = new URLSearchParams({ message, link, access_token: TOKEN });
  const response = await fetch(`https://graph.facebook.com/${API_VERSION}/${PAGE_ID}/feed`, {
    method: 'POST',
    body: params,
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error(`Facebook odmítl ${label}: ${JSON.stringify(payload)}`);
    return false;
  }
  console.log(`Publikováno: ${label} → ${payload.id ?? '(bez id)'}`);
  return true;
}

async function main() {
  if (!DRY_RUN && (!PAGE_ID || !TOKEN)) {
    console.log('FB_PAGE_ID / FB_PAGE_TOKEN nejsou nastavené — přeskakuji.');
    return;
  }

  const files = addedFiles().filter((file) => /^src\/content\/(blog|circles)\/.+\.mdx?$/.test(file));
  if (files.length === 0) {
    console.log('Žádný nový článek ani termín — není co publikovat.');
    return;
  }

  let failures = 0;

  for (const file of files) {
    const isBlog = file.startsWith('src/content/blog/');
    const slug = file.split('/').pop().replace(/\.mdx?$/, '');
    const data = frontmatter(file);

    if (isBlog) {
      if (!data.title) {
        console.warn(`${file}: chybí title, přeskakuji.`);
        continue;
      }
      const link = `${SITE}/blog/${slug}/`;
      const ok = await publish({
        message: [data.title, '', data.description ?? ''].join('\n').trim(),
        link,
        label: `článek ${slug}`,
      });
      if (!ok) failures += 1;
      continue;
    }

    // Kruh: publikuj jen budoucí termín, minulé kruhy do feedu nepatří.
    const stamp = data.startsAt ?? '';
    const isFuture = stamp >= new Date().toISOString().slice(0, 16);
    if (!isFuture) {
      console.log(`${file}: termín ${stamp || '(chybí)'} už proběhl, přeskakuji.`);
      continue;
    }

    const lines = [`Nejbližší kruh: ${formatPrague(stamp)}${data.place ? `, ${data.place}` : ''}.`];
    if (data.topic) lines.push('', `Téma: ${data.topic}.`);
    if (data.description) lines.push('', data.description);
    lines.push('', 'Mužský kruh u ohně pro muže z Blanska, Brna a okolí. Zdarma, platí se chlapským slovem.');

    const ok = await publish({
      message: lines.join('\n'),
      link: `${SITE}/#prihlaska`,
      label: `termín ${slug}`,
    });
    if (!ok) failures += 1;
  }

  if (failures > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
