#!/usr/bin/env node
/* App Store ekran görüntülerini üretir: magaza/sablon.html → magaza/app-store/<dil>/NN-ad.png
 *
 *     python3 scripts/magaza-ekranlari.py      # önce ekranları çıkar
 *     node scripts/magaza-gorselleri.mjs       # sonra görselleri üret
 *
 * Playwright gerekir (npm i -D playwright). Tarayıcı indirmesi istemez: sistemde
 * Chromium varsa PLAYWRIGHT_BROWSERS_PATH ile gösterilebilir.
 *
 * Çıktı 1290×2796 PNG — App Store'un 6.9" iPhone boyutu. Apple saydamlık kanalı
 * (alfa) olan PNG'yi reddedebildiği için dosyalar Pillow ile RGB'ye çevrilir. */
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require("playwright"); }
catch { playwright = require("/opt/node22/lib/node_modules/playwright"); }

const KOK = join(dirname(fileURLToPath(import.meta.url)), "..");
const SABLON = pathToFileURL(join(KOK, "magaza", "sablon.html")).href;
const DILLER = ["tr", "en", "de"];
const ADLAR = ["odak", "modlar", "gorevler", "istatistik", "verimli-aralik", "cevrimdisi"];
const W = 1290, H = 2796;

const browser = await playwright.chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const cikti = [];
for (const dil of DILLER) {
  const klasor = join(KOK, "magaza", "app-store", dil);
  mkdirSync(klasor, { recursive: true });
  for (let i = 0; i < ADLAR.length; i++) {
    await page.goto(`${SABLON}?dil=${dil}&n=${i + 1}`);
    await page.waitForFunction(() => document.body.dataset.ready === "1");
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => Promise.all([...document.images].map(im => im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r; }))));
    const yol = join(klasor, `${String(i + 1).padStart(2, "0")}-${ADLAR[i]}.png`);
    await page.screenshot({ path: yol, clip: { x: 0, y: 0, width: W, height: H } });
    cikti.push(yol);
  }
}
await browser.close();

execFileSync("python3", ["-c", `
import sys
from PIL import Image
for p in sys.argv[1:]:
    im = Image.open(p)
    assert im.size == (${W}, ${H}), (p, im.size)
    im.convert("RGB").save(p, optimize=True)
`, ...cikti], { stdio: "inherit" });
console.log(`${cikti.length} görsel üretildi → magaza/app-store/`);
