import {
	researchedLessons,
	researchSources,
} from "../src/content/researched-lessons.js";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const read = async (name) =>
	(await fs.readFile(`src/content/${name}.txt`, "utf8"))
		.trim()
		.split("\n")
		.map((s) => s.split("|"));
const polity = await read("polity-outline"),
	economy = await read("economy-outline");
const pLessons = await read("polity-lessons"),
	eLessons = await read("economy-lessons");
assert.equal(polity.length, 80);
assert.equal(economy.length, 19);
assert.equal(pLessons.length, 80);
assert.equal(eLessons.length, 17);
const sections = {
	I: "Constitutional Framework",
	II: "System of Government",
	III: "Central Government",
	IV: "State Government",
	V: "Local Government",
	VI: "Union Territories and Special Areas",
	VII: "Constitutional Bodies",
	VIII: "Non-Constitutional Bodies",
	IX: "Other Constitutional Dimensions",
	X: "Political Dynamics",
	XI: "Working of the Constitution",
};
const sourcePhotos = {
	xix: "IMG-20260919-WA0033.jpg",
	xx: "IMG-20260919-WA0016.jpg",
	xxi: "IMG-20260919-WA0018.jpg",
	xxii: "IMG-20260919-WA0014.jpg",
	xxiii: "IMG-20260919-WA0020.jpg",
	xxiv: "IMG-20260919-WA0023.jpg",
	xxv: "IMG-20260919-WA0025.jpg",
	xxvi: "IMG-20260919-WA0027.jpg",
	xxvii: "IMG-20260919-WA0029.jpg",
	xxviii: "IMG-20260919-WA0031.jpg",
	xxix: "IMG-20260919-WA0035.jpg",
	xxx: "IMG-20260919-WA0037.jpg",
	xxxi: "IMG-20260919-WA0039.jpg",
	xxxii: "IMG-20260919-WA0041.jpg",
	xxxiii: "IMG-20260919-WA0043.jpg",
};
const chapters = [
	...polity.map(([n, title, part, toc, pageRange, subtopics]) => {
		assert.ok(Number(n) > 0 && title && subtopics);
		return {
			id: `pe-p${n.padStart(2, "0")}`,
			number: Number(n),
			subject: "Polity",
			title,
			part,
			section: sections[part],
			toc,
			pageRange,
			sourcePhotos: toc.split("–").map((p) => sourcePhotos[p]),
			sourceType: "User-provided contents photograph",
			subtopics: subtopics.split(";").map((s, i) => {
				const at = s.lastIndexOf("@");
				assert.ok(at > 0);
				const title = s.slice(0, at);
				return {
					id: `pe-p${n.padStart(2, "0")}-s${i + 1}`,
					title,
					page: s.slice(at + 1),
					type: title === "Notes and References" ? "reference" : "syllabus",
					origin: "Photographed heading",
					contentStatus: "Detailed treatment pending",
				};
			}),
			sourceCaveat:
				n === "36"
					? "Printed chapter-end range is cropped; the visible Notes and References entry is 36.10. No missing range has been guessed."
					: null,
		};
	}),
	...economy.map(([n, title, pageRange]) => ({
		id: `pe-e${n.padStart(2, "0")}`,
		number: Number(n),
		subject: "Economy",
		title,
		part: "Economy",
		section: Number(n) >= 17 ? "Reference & practice" : "Indian Economy",
		toc: "1",
		pageRange,
		sourcePhotos: ["IMG-20260919-WA0007.jpg"],
		sourceType: "User-provided contents photograph",
		resourceOnly: Number(n) >= 18,
		subtopics: [],
		sourceCaveat:
			"This photograph supplies chapter titles and page ranges, not printed subtopics. Any study outline below is editorial, not a transcription.",
	})),
];
for (const c of chapters) {
	const lesson = (c.subject === "Polity" ? pLessons : eLessons).find(
		(r) => Number(r[0]) === c.number,
	);
	if (lesson) {
		assert.ok(lesson.length >= 7, `Missing lesson fields ${c.id}`);
		const [, hindi, intro, facts, trap, mains, reference, outline] = lesson;
		Object.assign(c, {
			hindi,
			intro,
			facts: facts.split("~"),
			trap,
			mains,
			reference,
			coverage: "Core lesson available; detailed subtopic expansion pending",
			provenance:
				"AI-generated original explanatory material; not textbook chapter text",
			reviewStatus: "Primary-source review pending",
			editorialOutline: (outline || "").split(";").filter(Boolean),
		});
	} else {
		c.coverage = "Source pages not provided";
		c.intro =
			"The supplied image lists this resource but does not include its questions or answers. No source questions or answer key have been fabricated.";
		c.facts = [];
		c.hindi = c.number === 18 ? "अभ्यास प्रश्नपत्र" : "उत्तर";
	}
}
assert.equal(new Set(chapters.map((c) => c.id)).size, 99);
const supplementary = JSON.parse(
	await fs.readFile("src/content/supplementary.json", "utf8"),
).map(([group, title, page], i) => ({
	id: `pe-ref-${i + 1}`,
	group,
	title,
	page,
	sourcePage: group === "Front matter" ? "xix" : "xxxiii",
	status: "Heading mapped; source text not provided",
}));
const result = {
	id: "polity-economy-v1",
	revision: 2,
	mappedOn: "2026-09-19",
	title: "Your Polity & Economy curriculum",
	chapters,
	supplementary,
	sourcePhotos,
	notes: [
		"Contents pages are a user study outline, not the official UPSC syllabus.",
		"Handwritten ticks, reading counts, article annotations and marginal notes have not been converted into progress or verified facts.",
		"Economy page 188 is not allocated in the printed ranges visible between Agriculture and Industry; this gap is retained, not filled by inference.",
		"The Polity contents indicate a sixth edition and PYQ appendices ending in 2019. Current law, rules, officeholders, budget figures, index ranks and statistical series require updated primary-source checks.",
		"The title Articles of the Constitution (1–395) is preserved as a book appendix label, not asserted to be the number of articles currently in force.",
		"Publisher supplementary URL shown in photograph: http://www.mhhe.co.in/indianpolity6e. Supplement contents have not been imported.",
		"All 15 visible Polity contents pages xix–xxxiii and the Economy contents table are mapped. Photograph files and personal markings are not included in the public app.",
	],
};
await fs.writeFile(
	"src/content/curriculum.json",
	JSON.stringify(result, null, 2) + "\n",
);
const report = [
	"# Polity & Economy coverage register",
	"",
	`Mapped ${chapters.length} numbered units: 80 Polity chapters and 19 Economy entries.`,
	`${chapters.reduce((a, c) => a + c.subtopics.length, 0)} printed Polity subheadings/reference lines; ${supplementary.length} supplementary/front-matter entries.`,
	`${chapters.filter((c) => !c.resourceOnly).length} original core lessons; 10 chapters have 59 source-informed expanded sections. Exhaustive subheading treatment and independent review remain pending.`,
	...result.notes.map((n) => `- ${n}`),
	"",
];
for (const c of chapters) {
	report.push(
		`## ${c.subject} ${c.number}. ${c.title}`,
		`Source: contents ${c.toc}; chapter pages ${c.pageRange}.`,
		`Coverage: ${c.coverage}.`,
	);
	if (researchedLessons[c.id]) {
		report.push(
			"Source-informed expansion (original teaching; independent review pending):",
			...researchedLessons[c.id].sections.map(
				(s) => `- ${s.title} — ${s.basis}`,
			),
			...researchedLessons[c.id].sources.map(
				(id) =>
					`- Consulted 2026-09-19: [${researchSources[id].name}](${researchSources[id].url}) — ${researchSources[id].edition}`,
			),
		);
	}
	for (const s of c.subtopics)
		report.push(`- [ ] ${s.title} — ${s.page} [${s.type}; ${s.contentStatus}]`);
	for (const s of c.editorialOutline || [])
		report.push(
			`- [ ] ${s} [editorial study outline, not a printed subheading]`,
		);
	if (c.sourceCaveat) report.push(`Note: ${c.sourceCaveat}`);
	report.push("");
}
report.push(
	"## Supplementary register",
	...supplementary.map(
		(s) => `- ${s.group}: ${s.title} — ${s.page}. ${s.status}.`,
	),
);
await fs.writeFile("CONTENT_COVERAGE.md", report.join("\n") + "\n");
console.log(
	`Compiled ${chapters.length} units / ${chapters.reduce((a, c) => a + c.subtopics.length, 0)} Polity entries / ${supplementary.length} supplementary entries.`,
);
