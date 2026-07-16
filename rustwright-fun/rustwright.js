const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('rustwright');

const reportsDirectory = path.join(__dirname, 'reports');
const automationScreenshot = path.join(reportsDirectory, 'automation.png');
const reportScreenshot = path.join(reportsDirectory, 'report.png');
const reportFile = path.join(reportsDirectory, 'index.html');
const results = [];

const pageHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Rustwright POC</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #111827; color: #f8fafc; font-family: Arial, sans-serif; }
    main { width: min(720px, calc(100% - 48px)); padding: 56px; border: 1px solid #334155; border-radius: 24px; background: #1e293b; box-shadow: 0 24px 80px #02061780; }
    small { color: #5eead4; font-size: 14px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
    h1 { margin: 16px 0 12px; font-size: 44px; line-height: 1.05; }
    p { color: #cbd5e1; font-size: 18px; line-height: 1.6; }
    form { display: flex; gap: 12px; margin-top: 32px; }
    input { flex: 1; min-width: 0; padding: 14px 16px; border: 1px solid #475569; border-radius: 10px; background: #0f172a; color: #f8fafc; font-size: 16px; }
    button { padding: 14px 22px; border: 0; border-radius: 10px; background: #2dd4bf; color: #042f2e; font-size: 16px; font-weight: 800; cursor: pointer; }
    #result { min-height: 28px; margin-top: 24px; color: #99f6e4; font-weight: 700; }
  </style>
</head>
<body>
  <main>
    <small>Rust CDP engine</small>
    <h1 id="title">Rustwright is running</h1>
    <p>A Playwright-shaped Node.js script opened this page, filled the field, pressed the button, checked the result, and captured this screen.</p>
    <form onsubmit="return false">
      <input id="name" aria-label="Automation name" placeholder="Type a name">
      <button id="run" type="button">Run action</button>
    </form>
    <div id="result" aria-live="polite"></div>
  </main>
  <script>
    document.querySelector('#run').addEventListener('click', () => {
      document.querySelector('#result').textContent = document.querySelector('#name').value + ' works with Rustwright';
    });
  </script>
</body>
</html>`;

function dataUrl(html) {
  return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function assertEqual(actual, expected) {
  if (actual !== expected) {
    throw new Error(`Expected "${expected}" but received "${actual}"`);
  }
}

async function check(name, action) {
  try {
    await action();
    results.push({ name, status: 'Passed', detail: 'Completed successfully' });
    console.log(`PASS ${name}`);
  } catch (error) {
    results.push({ name, status: 'Failed', detail: error.message });
    console.error(`FAIL ${name}: ${error.message}`);
  }
}

function buildReport(browserPath, embeddedImage) {
  const passed = results.filter((result) => result.status === 'Passed').length;
  const failed = results.length - passed;
  const browserName = path.basename(browserPath);
  const rows = results.map((result) => `
    <tr>
      <td>${escapeHtml(result.name)}</td>
      <td><span class="status ${result.status.toLowerCase()}">${result.status}</span></td>
      <td>${escapeHtml(result.detail)}</td>
    </tr>`).join('');
  const imageSource = embeddedImage || 'automation.png';
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Rustwright test report</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #f1f5f9; color: #172033; font-family: Arial, sans-serif; }
    main { width: min(1120px, calc(100% - 48px)); margin: 48px auto; }
    header { display: flex; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 28px; }
    small { color: #0f766e; font-size: 13px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; }
    h1 { margin: 10px 0 0; font-size: 42px; }
    .summary { display: flex; gap: 12px; }
    .metric { min-width: 112px; padding: 16px 20px; border: 1px solid #cbd5e1; border-radius: 14px; background: white; }
    .metric strong { display: block; font-size: 28px; }
    .metric span { color: #64748b; font-size: 13px; }
    section { margin-bottom: 24px; overflow: hidden; border: 1px solid #cbd5e1; border-radius: 18px; background: white; box-shadow: 0 14px 40px #0f172a12; }
    h2 { margin: 0; padding: 22px 26px; border-bottom: 1px solid #e2e8f0; font-size: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 16px 26px; border-bottom: 1px solid #e2e8f0; text-align: left; }
    th { color: #64748b; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; }
    tr:last-child td { border-bottom: 0; }
    .status { display: inline-block; padding: 6px 10px; border-radius: 999px; font-size: 12px; font-weight: 800; }
    .passed { background: #ccfbf1; color: #115e59; }
    .failed { background: #fee2e2; color: #991b1b; }
    .browser { padding: 18px 26px; color: #475569; font-family: monospace; overflow-wrap: anywhere; }
    img { display: block; width: 100%; height: auto; }
  </style>
</head>
<body>
  <main>
    <header>
      <div>
        <small>Rustwright 0.1.1</small>
        <h1>Test report</h1>
      </div>
      <div class="summary">
        <div class="metric"><strong>${passed}</strong><span>Passed</span></div>
        <div class="metric"><strong>${failed}</strong><span>Failed</span></div>
      </div>
    </header>
    <section>
      <h2>Checks</h2>
      <table>
        <thead><tr><th>Check</th><th>Status</th><th>Details</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </section>
    <section>
      <h2>Chromium executable</h2>
      <div class="browser">${escapeHtml(browserName)}</div>
    </section>
    <section>
      <h2>Captured page</h2>
      <img src="${imageSource}" alt="Automated page after the interaction">
    </section>
  </main>
</body>
</html>`;
}

async function main() {
  fs.mkdirSync(reportsDirectory, { recursive: true });
  let browser;
  let page;
  let browserPath = 'Not available';

  try {
    await check('Locate Chromium', async () => {
      browserPath = await chromium.executablePath();
      if (!browserPath) {
        throw new Error('Chromium was not found');
      }
    });
    await check('Launch Chromium', async () => {
      browser = await chromium.launch({ headless: true });
      page = await browser.newPage();
    });
    await check('Open local page', async () => {
      await page.goto(dataUrl(pageHtml), { waitUntil: 'load' });
      assertEqual(await page.title(), 'Rustwright POC');
    });
    await check('Read page content', async () => {
      assertEqual(await page.textContent('#title'), 'Rustwright is running');
    });
    await check('Fill and click', async () => {
      await page.fill('#name', 'Playwright API');
      await page.click('#run');
      assertEqual(await page.textContent('#result'), 'Playwright API works with Rustwright');
    });
    await check('Capture page screenshot', async () => {
      await page.screenshot({ path: automationScreenshot, fullPage: true });
    });
  } finally {
    const image = fs.existsSync(automationScreenshot)
      ? `data:image/png;base64,${fs.readFileSync(automationScreenshot).toString('base64')}`
      : '';
    const report = buildReport(browserPath, 'automation.png');
    fs.writeFileSync(reportFile, report);
    if (page) {
      await page.goto(dataUrl(buildReport(browserPath, image)), { waitUntil: 'load' });
      await page.screenshot({ path: reportScreenshot, fullPage: true });
    }
    if (browser) {
      await browser.close();
    }
  }

  const failed = results.filter((result) => result.status === 'Failed').length;
  console.log(`${results.length - failed} passed, ${failed} failed`);
  console.log(`Report: ${reportFile}`);
  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
