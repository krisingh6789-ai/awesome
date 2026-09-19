import { launchBrowser } from "./browser.mjs";
import fs from "node:fs/promises";
const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("dialog", (d) => d.accept());
await page.goto("http://localhost:4173");
await page
	.getByRole("heading", { name: "A little better, every day." })
	.waitFor();
const nav = async (name) =>
	page.locator(".sidebar").getByRole("button", { name, exact: true }).click();
await nav("Practice");
await page.getByRole("button", { name: /Timed mock test/ }).click();
await page.getByRole("button", { name: "A Article 14" }).click();
await page
	.getByRole("button", { name: "Mark for review", exact: true })
	.click();
await page.getByRole("button", { name: "Next", exact: true }).click();
await page.getByRole("button", { name: "B Fundamental Rights" }).click();
await page.getByRole("button", { name: "Finish & analyze" }).click();
await page.getByRole("heading", { name: "A step forward." }).waitFor();
await page.getByText("1.33 / 30", { exact: true }).waitFor();
await page.getByRole("button", { name: "Back to your workspace" }).click();
await nav("Writing");
await page.getByRole("button", { name: "New answer" }).click();
await page.getByLabel("Question / topic").fill("Why accountability matters");
await page
	.locator(".writing textarea")
	.fill("Accountability builds trust in public institutions.");
await page.getByRole("button", { name: "Save draft" }).click();
await page.getByRole("button", { name: "Saved offline" }).waitFor();
await page.getByRole("button", { name: "Close dialog" }).click();
await page
	.getByRole("button", { name: /Why accountability matters/ })
	.waitFor();
await nav("Resources");
await page
	.locator(".import-area input")
	.setInputFiles({
		name: "offline.txt",
		mimeType: "text/plain",
		buffer: Buffer.from("Offline file content"),
	});
await page.getByRole("heading", { name: "offline.txt" }).first().waitFor();
await page.getByRole("button", { name: "Import", exact: true }).click();
await page
	.locator("input[type=file]")
	.setInputFiles({
		name: "pack.json",
		mimeType: "application/json",
		buffer: Buffer.from(
			JSON.stringify({
				version: 1,
				questions: [
					{
						id: "test-import",
						text: "Imported test question?",
						options: ["one", "two", "three", "four"],
						answer: 0,
						subject: "Polity",
						topic: "rights",
						kind: "User-imported",
						explanation: "One is correct.",
						source: "User test pack",
					},
				],
			}),
		),
	});
await page.getByText("1 content items imported").waitFor();
await page.getByRole("button", { name: "Search anything…" }).click();
await page
	.getByPlaceholder("Search lessons, notes, questions…")
	.fill("Imported test question");
await page
	.getByRole("button", { name: "Question Imported test question?" })
	.waitFor();
await page.getByRole("button", { name: "Close dialog" }).click();
await page
	.locator(".sidebar")
	.getByRole("button", { name: "Settings & preferences" })
	.click();
const event = page.waitForEvent("download");
await page.getByRole("button", { name: "Export backup" }).click();
const file = await event;
const backup = JSON.parse(await fs.readFile(await file.path(), "utf8"));
if (
	backup.data.tests.length !== 1 ||
	backup.data.resources.length !== 1 ||
	!backup.data.resources[0].base64
)
	throw Error("Backup missing data");
await page
	.locator('label:has-text("Restore") input')
	.setInputFiles({
		name: "backup.json",
		mimeType: "application/json",
		buffer: Buffer.from(JSON.stringify(backup)),
	});
await page.getByText("Backup restored", { exact: true }).waitFor();
await nav("Analytics");
await page.getByText("1 mock tests submitted", { exact: false }).waitFor();
console.log(
	"Mock score, review flags, writing, document import, JSON import, global search, backup with binary files and restore passed",
	errors,
);
if (errors.length) process.exitCode = 1;
await browser.close();
