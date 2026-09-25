import { chromium } from "@playwright/test";
import axe from "axe-core";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

try {
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.addScriptTag({ content: axe.source });
  const results = await page.evaluate(async () => window.axe.run(document));
  const serious = results.violations.filter((violation) => ["critical", "serious"].includes(violation.impact));
  console.log(`Accessibility audit: ${results.passes.length} passes, ${results.violations.length} violations`);
  for (const violation of results.violations.filter((item) => !serious.includes(item))) {
    console.warn(`${violation.impact || "minor"}: ${violation.id} - ${violation.help}`);
    for (const node of violation.nodes) console.warn(`  ${node.target.join(" ")}`);
  }
  for (const violation of serious) {
    console.error(`${violation.impact}: ${violation.id} - ${violation.help}`);
    for (const node of violation.nodes) {
      console.error(`  ${node.target.join(" ")}\n  ${node.failureSummary || ""}`);
    }
  }
  process.exitCode = serious.length ? 1 : 0;
} finally {
  await browser.close();
}
