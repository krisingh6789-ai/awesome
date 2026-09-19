import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { launchBrowser } from "./browser.mjs";
import { curriculum } from "../src/content/pack.js";
import {
	researchedLessons,
	researchSources,
} from "../src/content/researched-lessons.js";
import {
	bookParts,
	bookHTML,
	chapterText,
	matchesChapter,
} from "../src/content/textbook.js";
assert.equal(Object.keys(researchedLessons).length, 10);
assert.equal(
	Object.values(researchedLessons).reduce((n, r) => n + r.sections.length, 0),
	59,
);
assert.equal(
	new Set(
		Object.values(researchedLessons).flatMap((r) =>
			r.sections.map((s) => s.id),
		),
	).size,
	59,
);
for (const [id, r] of Object.entries(researchedLessons)) {
	assert.ok(curriculum.chapters.some((c) => c.id === id));
	assert.ok(
		r.sources.every((s) => researchSources[s]?.url.startsWith("https://")),
	);
	assert.ok(
		r.sections.every(
			(s) => s.basis && s.hindi && s.paragraphs.join(" ").length > 400,
		),
	);
}
for (const subject of ["Polity", "Economy"]) {
	const actual = bookParts(subject).flatMap((p) => p.chapters.map((c) => c.id));
	assert.deepEqual(
		actual,
		curriculum.chapters.filter((c) => c.subject === subject).map((c) => c.id),
	);
	assert.ok(!bookHTML(subject).includes("<script"));
	assert.equal(
		(bookHTML(subject).match(/class="chapter"/g) || []).length,
		actual.length,
	);
}
assert.ok(
	matchesChapter(
		curriculum.chapters.find((c) => c.id === "pe-e05"),
		"Standing Deposit Facility",
	),
);
assert.ok(
	chapterText(curriculum.chapters.find((c) => c.id === "pe-p07")).length >
		18000,
);
assert.equal(5347315 - (3533150 + 38397 + 80000), 1695768);
assert.equal(1695768 - 1403972, 291796);
const browser = await launchBrowser();
const context = await browser.newContext({
	viewport: { width: 390, height: 844 },
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
try {
	await page.goto("http://localhost:4173");
	await page
		.locator(".bottom-nav")
		.getByRole("button", { name: "Study", exact: true })
		.click();
	await page.getByRole("button", { name: "Open Polity & Economy" }).click();
	assert.equal(await page.locator(".book-part").count(), 11);
	assert.equal(await page.locator(".chapter-row").count(), 80);
	assert.equal(await page.locator(".book-part[open]").count(), 0);
	await page.screenshot({
		path: "/tmp/abhyas-textbook-contents.png",
		fullPage: true,
	});
	await page.getByLabel("Search textbook").fill("Right to Equality");
	await page.getByRole("button", { name: /07 Fundamental Rights/ }).click();
	assert.equal(
		await page.locator(".research-reading .reading-section").count(),
		12,
	);
	assert.equal(
		await page
			.locator(".book-reader")
			.getByRole("heading", { name: "Fundamental Rights", exact: true })
			.count(),
		1,
	);
	await page.getByLabel("Reading text size").selectOption("24");
	assert.equal(
		await page
			.locator(".book-reader")
			.evaluate((e) => getComputedStyle(e).fontSize),
		"24px",
	);
	assert.equal(
		await page.evaluate(
			() => document.documentElement.scrollWidth > innerWidth,
		),
		false,
	);
	await page
		.getByLabel("Fundamental Rights chapter status")
		.selectOption("Learning");
	await page.screenshot({
		path: "/tmp/abhyas-textbook-reading.png",
		fullPage: false,
	});
	await page.getByRole("button", { name: "Next chapter", exact: true }).click();
	await page
		.getByRole("heading", {
			name: "Directive Principles of State Policy",
			exact: true,
		})
		.waitFor();
	await page
		.getByRole("button", { name: "Previous chapter", exact: true })
		.click();
	assert.equal(
		await page.getByLabel("Fundamental Rights chapter status").inputValue(),
		"Learning",
	);
	await page.getByRole("button", { name: "Contents", exact: true }).click();
	await page
		.getByRole("button", { name: "Continue reading", exact: true })
		.click();
	await page
		.getByRole("heading", { name: "Fundamental Rights", exact: true })
		.waitFor();
	await page.getByRole("button", { name: "Contents", exact: true }).click();
	await page.getByLabel("Search textbook").fill("");
	await page.locator(".book-part").first().locator("summary").click();
	await page
		.locator(".book-part")
		.first()
		.getByRole("button", { name: "Read this entire part" })
		.click();
	assert.equal(
		await page.locator(".book-chapter").count(),
		bookParts("Polity")[0].chapters.length,
	);
	assert.equal(
		await page.locator(".research-reading .reading-section").count(),
		16,
	);
	await page.getByRole("button", { name: "Contents", exact: true }).click();
	await page.getByRole("button", { name: "Economy", exact: true }).click();
	assert.equal(await page.locator(".chapter-row").count(), 19);
	await page.getByLabel("Search textbook").fill("Standing Deposit Facility");
	await page.getByRole("button", { name: /05 Money and Banking/ }).click();
	await page
		.getByRole("heading", {
			name: "3. Repo, SDF and MSF: understand the corridor",
			exact: true,
		})
		.waitFor();
	const download = page.waitForEvent("download");
	await page
		.getByRole("button", { name: "Download complete Economy reading book" })
		.click();
	const file = await download;
	const html = await fs.readFile(await file.path(), "utf8");
	assert.ok(html.includes("₹16,95,768"));
	assert.ok(html.includes("Practice Sets (1–10)"));
	assert.ok(html.includes("source pages")); // retained missing-source disclosure
	await page
		.getByRole("button", { name: /Practice & notes · Money and Banking/ })
		.click();
	await page
		.getByRole("button", { name: "Practice topic MCQs", exact: true })
		.waitFor();
	await page.getByRole("button", { name: "Close dialog" }).click();
	await page.evaluate(() => navigator.serviceWorker.ready);
	await page.reload();
	await context.setOffline(true);
	await page.reload();
	await page
		.locator(".bottom-nav")
		.getByRole("button", { name: "Study", exact: true })
		.click();
	await page.getByRole("button", { name: "Open Polity & Economy" }).click();
	await page.getByRole("button", { name: "Economy", exact: true }).click();
	await page
		.getByRole("button", { name: "Continue reading", exact: true })
		.click();
	await page
		.getByRole("heading", { name: "Money and Banking", exact: true })
		.waitFor();
	assert.deepEqual(errors, []);
	const plain = await browser.newContext({
		javaScriptEnabled: false,
		offline: true,
		viewport: { width: 390, height: 844 },
	});
	const book = await plain.newPage();
	await book.goto(
		pathToFileURL(`${process.cwd()}/Abhyas-Economy-Reading-Book.html`).href,
	);
	assert.equal(await book.locator(".chapter").count(), 19);
	assert.equal(
		await book.evaluate(
			() => document.documentElement.scrollWidth > innerWidth,
		),
		false,
	);
	await book.emulateMedia({ media: "print" });
	await book.pdf({
		path: "/tmp/abhyas-economy-book.pdf",
		format: "A4",
		margin: { top: "18mm", bottom: "18mm", left: "18mm", right: "18mm" },
	});
	console.log(
		"PASS: 99 chapters in ordered parts; 59 sourced sections; full-text search; chapter/part reading; font sizing; saved status/resume; study tools; HTML download; offline reload; no-JS book and print/mobile layout.",
	);
} finally {
	await browser.close();
}
