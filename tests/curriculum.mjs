import assert from "node:assert/strict";
import { launchBrowser } from "./browser.mjs";
import { curriculum, packTopics, packQuestions } from "../src/content/pack.js";
import { deepDives } from "../src/content/deep-dives.js";
assert.equal(curriculum.chapters.length, 99);
assert.deepEqual(
	curriculum.chapters
		.filter((c) => c.subject === "Polity")
		.map((c) => c.number),
	Array.from({ length: 80 }, (_, i) => i + 1),
);
assert.deepEqual(
	curriculum.chapters
		.filter((c) => c.subject === "Economy")
		.map((c) => c.number),
	Array.from({ length: 19 }, (_, i) => i + 1),
);
assert.equal(
	curriculum.chapters.reduce((n, c) => n + c.subtopics.length, 0),
	515,
);
assert.equal(curriculum.supplementary.length, 26);
assert.equal(packTopics.length, 97);
assert.equal(packQuestions.length, 60);
assert.equal(Object.keys(deepDives).length, 8);
for (const t of packTopics) {
	assert.ok(t.intro.length > 100, t.id);
	assert.ok(t.facts.length >= 4, t.id);
	assert.ok(t.mains && t.trap && t.reference);
	assert.equal(t.reviewStatus, "Primary-source review pending");
}
for (const q of packQuestions) {
	assert.ok(packTopics.some((t) => t.id === q.topic));
	assert.equal(q.options.length, 4);
	assert.ok(q.answer >= 0 && q.answer < 4);
	assert.equal(q.kind, "AI-generated");
}
assert.ok(
	curriculum.chapters
		.find((c) => c.id === "pe-p36")
		.sourceCaveat.includes("cropped"),
);
assert.ok(
	curriculum.chapters
		.find((c) => c.id === "pe-p04")
		.subtopics.some((s) => s.title === "Amendability of the Preamble"),
);
assert.ok(
	curriculum.chapters
		.find((c) => c.id === "pe-p20")
		.subtopics.some((s) => s.title === "Kitchen Cabinet"),
);
assert.equal(
	curriculum.chapters
		.filter((c) => c.subject === "Economy")
		.reduce((n, c) => n + c.subtopics.length, 0),
	0,
	"Editorial outlines must not masquerade as photographed subheadings",
);
const browser = await launchBrowser();
const context = await browser.newContext({
	viewport: { width: 1280, height: 900 },
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("dialog", (d) => d.accept());
try {
	await page.goto("http://localhost:4173");
	await page
		.getByRole("heading", { name: "A little better, every day." })
		.waitFor();
	await page
		.locator(".sidebar")
		.getByRole("button", { name: "Study", exact: true })
		.click();
	await page.getByRole("button", { name: "Open Polity & Economy" }).click();
	assert.equal(await page.locator(".curriculum-card").count(), 12);
	await page.getByLabel("Search curriculum").fill("Fundamental Rights");
	const rights = page
		.locator(".curriculum-card")
		.filter({
			has: page.getByRole("heading", {
				name: "Fundamental Rights",
				exact: true,
			}),
		});
	await rights.getByRole("button", { name: "Read lesson" }).click();
	await page
		.getByRole("button", { name: "Source checklist", exact: true })
		.click();
	assert.equal(await page.locator(".modal .coverage-row").count(), 19);
	await page
		.getByLabel("Right to Equality learning status", { exact: true })
		.selectOption("Completed");
	await page.getByRole("button", { name: "Deep dive", exact: true }).click();
	await page
		.getByRole("heading", { name: "A rights-analysis method" })
		.waitFor();
	assert.equal(await page.locator(".comparison-wrap table").count(), 1);
	await page.getByRole("button", { name: "Bookmark lesson" }).click();
	await page
		.getByRole("button", { name: "Write an answer", exact: true })
		.click();
	assert.equal(
		await page.getByLabel("Question / topic").inputValue(),
		"How do constitutional remedies convert formal rights into practical protection?",
	);
	await page.getByRole("button", { name: "Close dialog" }).click();
	await rights.getByRole("button", { name: "Read lesson" }).click();
	await page
		.getByRole("button", { name: "Source checklist", exact: true })
		.click();
	await page.getByTitle("Add note: Right to Equality", { exact: true }).click();
	await page
		.getByLabel("Note · plain text / Markdown")
		.fill(
			"Equality requires a justified distinction, not arbitrary exclusion.",
		);
	await page.getByRole("button", { name: "Save note offline" }).click();
	// Export source map and the learner's separate checklist state.
	const dl = page.waitForEvent("download");
	await page
		.getByRole("button", { name: "Export coverage", exact: true })
		.click();
	await dl;
	await page.getByRole("button", { name: "Economy", exact: true }).click();
	await page.getByLabel("Search curriculum").fill("Government Budgeting");
	await page
		.locator(".curriculum-card")
		.getByRole("button", { name: "Read lesson" })
		.click();
	await page.getByRole("button", { name: "Deep dive", exact: true }).click();
	await page
		.getByRole("heading", {
			name: "Read a budget using identities and trade-offs",
		})
		.waitFor();
	await page
		.getByRole("button", { name: "Practice topic MCQs", exact: true })
		.click();
	await page.getByRole("button", { name: "B 250", exact: true }).click();
	await page.getByRole("button", { name: "Check answer", exact: true }).click();
	await page.getByText("Well reasoned.", { exact: true }).waitFor();
	await page.getByRole("button", { name: "Close dialog" }).click();
	// Re-run pack installation as an upgrade: preserve topic progress, spaced-review scheduling and notes.
	await page.evaluate(async () => {
		const db = await new Promise((ok, no) => {
			const r = indexedDB.open("abhyas-v1");
			r.onsuccess = () => ok(r.result);
			r.onerror = () => no(r.error);
		});
		await new Promise((ok, no) => {
			const tx = db.transaction(["settings", "topics", "cards"], "readwrite");
			tx.objectStore("settings").delete("pack:polity-economy");
			const t = tx.objectStore("topics").get("pe-p07");
			t.onsuccess = () =>
				tx.objectStore("topics").put({ ...t.result, status: "Revised" });
			const c = tx.objectStore("cards").get("pe-card-pe-p07");
			c.onsuccess = () =>
				tx
					.objectStore("cards")
					.put({ ...c.result, step: 3, due: 2000000000000 });
			tx.oncomplete = ok;
			tx.onerror = () => no(tx.error);
		});
		db.close();
	});
	await page.reload();
	await page
		.getByRole("heading", { name: "A little better, every day." })
		.waitFor();
	const state = await page.evaluate(async () => {
		const db = await new Promise((ok) => {
			const r = indexedDB.open("abhyas-v1");
			r.onsuccess = () => ok(r.result);
		});
		const tx = db.transaction(
			["topics", "cards", "settings", "notes"],
			"readonly",
		);
		const get = (store, key) =>
			new Promise((ok) => {
				const r = key
					? tx.objectStore(store).get(key)
					: tx.objectStore(store).getAll();
				r.onsuccess = () => ok(r.result);
			});
		const values = await Promise.all([
			get("topics"),
			get("cards", "pe-card-pe-p07"),
			get("settings", "coverage:pe-p07"),
			get("notes"),
		]);
		db.close();
		return values;
	});
	assert.equal(state[0].length, 105);
	assert.equal(state[0].find((t) => t.id === "pe-p07").status, "Revised");
	assert.equal(state[1].step, 3);
	assert.equal(state[1].due, 2000000000000);
	assert.equal(state[2].marks["pe-p07-s4"], "Completed");
	assert.ok(state[3].some((n) => n.syllabusItem === "pe-p07-s4"));
	await page.evaluate(() => navigator.serviceWorker.ready);
	await page.reload();
	await page
		.getByRole("heading", { name: "A little better, every day." })
		.waitFor();
	await context.setOffline(true);
	await page.reload();
	await page
		.locator(".sidebar")
		.getByRole("button", { name: "Syllabus tracker" })
		.click();
	await page.getByRole("button", { name: "Source & appendices" }).click();
	assert.equal(await page.locator(".supplementary-item").count(), 26);
	await page.setViewportSize({ width: 390, height: 844 });
	assert.equal(
		await page.evaluate(
			() => document.documentElement.scrollWidth > innerWidth,
		),
		false,
	);
	await page.getByRole("button", { name: "Chapters", exact: true }).click();
	await page.screenshot({
		path: "/tmp/abhyas-curriculum-mobile.png",
		fullPage: true,
	});
	assert.deepEqual(errors, []);
	console.log(
		"PASS: all 99 units/515 source lines/26 references mapped; 97 lessons/60 questions; pagination, subtopic search and persisted progress; linked notes/writing; budget MCQ; upgrade preserves review schedules; offline/mobile curriculum.",
	);
} finally {
	await browser.close();
}
