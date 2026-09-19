import { launchBrowser } from "./browser.mjs";
import { pathToFileURL } from "node:url";
import path from "node:path";
import assert from "node:assert/strict";
const browser = await launchBrowser();
const context = await browser.newContext({
	offline: true,
	viewport: { width: 390, height: 844 },
});
const page = await context.newPage();
const errors = [],
	network = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("request", (r) => {
	if (/^https?:/.test(r.url())) network.push(r.url());
});
const url = pathToFileURL(path.resolve("Abhyas-Offline.html")).href;
await page.goto(url);
await page
	.getByRole("heading", { name: "A little better, every day." })
	.waitFor();
await page.getByText("Offline file edition.", { exact: true }).waitFor();
await page
	.getByRole("button", { name: "Continue learning", exact: true })
	.click();
await page.getByRole("button", { name: "Practice topic MCQs" }).click();
await page.getByRole("button", { name: "C Article 32" }).click();
await page.getByRole("button", { name: "Check answer", exact: true }).click();
await page.getByText("Well reasoned.").waitFor();
page.on("dialog", (d) => d.accept());
await page.getByRole("button", { name: "Close dialog" }).click();
await page.setViewportSize({ width: 1280, height: 900 });
await page
	.locator(".sidebar")
	.getByRole("button", { name: "Resources", exact: true })
	.click();
await page.getByRole("button", { name: "Create note" }).click();
await page.getByLabel("Title", { exact: true }).fill("Offline local-file note");
await page
	.getByLabel("Note · plain text / Markdown")
	.fill("Saved without a server or internet.");
await page.getByRole("button", { name: "Save note offline" }).click();
await page.getByRole("heading", { name: "Offline local-file note" }).waitFor();
await page.reload();
await page
	.locator(".sidebar")
	.getByRole("button", { name: "Resources", exact: true })
	.click();
await page.getByRole("heading", { name: "Offline local-file note" }).waitFor();
await page
	.locator(".sidebar")
	.getByRole("button", { name: "Settings & preferences" })
	.click();
const downloaded = page.waitForEvent("download");
await page.getByRole("button", { name: "Export backup" }).click();
await downloaded;
await page.setViewportSize({ width: 390, height: 844 });
assert.equal(
	await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
	false,
);
assert.deepEqual(network, [], "Offline edition must make no HTTP requests");
assert.deepEqual(errors, []);
console.log(
	"PASS: file:// opened with network disabled; quiz, note persistence after reload, backup export, no HTTP requests, no browser errors, mobile width.",
);
const noStorage = await browser.newContext({ offline: true });
await noStorage.addInitScript(() => {
	Object.defineProperty(window, "indexedDB", { value: undefined });
});
const fallback = await noStorage.newPage();
await fallback.goto(url);
await fallback
	.getByRole("heading", { name: "Your offline study library" })
	.waitFor();
assert.equal(await fallback.locator(".offline-question").count(), 75);
console.log(
	"PASS: browser storage unavailable → readable 105-lesson / 75-question fallback.",
);
const noScripts = await browser.newContext({
	offline: true,
	javaScriptEnabled: false,
});
const staticPage = await noScripts.newPage();
await staticPage.goto(url);
await staticPage
	.getByRole("heading", { name: "Your UPSC offline library" })
	.waitFor();
assert.equal(await staticPage.locator(".offline-question").count(), 75);
console.log(
	"PASS: JavaScript disabled → self-contained reading library remains usable.",
);
await browser.close();
