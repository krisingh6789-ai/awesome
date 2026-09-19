import { curriculum } from "./pack.js";
import { deepDives } from "./deep-dives.js";
import { researchedLessons, researchSources } from "./researched-lessons.js";

export const editorialNotice =
	"Original AI-written study material, not a reproduction of your books. New source-informed sections cite consulted publications; independent editorial review, exhaustive subheading treatment and full Hindi translation are still pending.";
export function bookParts(subject) {
	const chapters = curriculum.chapters.filter((c) => c.subject === subject);
	// Keep the photographed order. Economy has no printed parts: these groups are editorial.
	if (subject === "Economy")
		return [
			["I", "Foundations & development", 1, 4],
			["II", "Banking & productive sectors", 5, 8],
			["III", "Public finance, investment & reform", 9, 11],
			["IV", "Trade & international institutions", 12, 13],
			["V", "Land, evidence & economic debates", 14, 16],
			["VI", "Glossary & source resources", 17, 19],
		].map(([id, title, first, last]) => ({
			id,
			title,
			chapters: chapters.filter((c) => c.number >= first && c.number <= last),
		}));
	return [...new Set(chapters.map((c) => c.part))].map((id) => ({
		id,
		title: chapters.find((c) => c.part === id).section,
		chapters: chapters.filter((c) => c.part === id),
	}));
}
export function chapterText(c) {
	const r = researchedLessons[c.id],
		d = deepDives[c.id];
	return [
		c.title,
		c.hindi,
		c.intro,
		...c.facts,
		...(r?.sections.flatMap((s) => [s.title, s.hindi, ...s.paragraphs]) || []),
		...(d
			? [
					d.title,
					...d.paragraphs,
					...d.comparisons.flat(),
					d.caseStudy,
					d.practice,
				]
			: []),
		c.trap || "",
		c.mains || "",
	].join(" ");
}
export function chapterWords(c) {
	return chapterText(c).trim().split(/\s+/).length;
}
export function matchesChapter(c, q) {
	return (
		chapterText(c) +
		" " +
		c.subtopics.map((s) => s.title).join(" ") +
		" " +
		(c.editorialOutline || []).join(" ")
	)
		.toLocaleLowerCase()
		.includes(q.trim().toLocaleLowerCase());
}
export const escapeHTML = (value) =>
	String(value ?? "").replace(
		/[&<>"']/g,
		(c) =>
			({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
				c
			],
	);
const e = escapeHTML;
export function researchHTML(id) {
	const r = researchedLessons[id];
	if (!r) return "";
	return `<section class="research-reading"><h3>Source-informed explanations</h3><p>${e(r.status)} · consulted ${r.consulted}</p>${r.sections.map((s) => `<section id="${s.id}"><h3>${e(s.title)}</h3><p lang="hi">${e(s.hindi)}</p>${s.paragraphs.map((p) => `<p>${e(p)}</p>`).join("")}<small>Basis: ${e(s.basis)}</small></section>`).join("")}<h3>Sources consulted</h3><p>These citations support the new sections, not every older core or advanced note. External sources require internet; these explanations are embedded offline.</p>${r.sources
		.map((id) => {
			const s = researchSources[id];
			return `<p><a href="${e(s.url)}">${e(s.name)}</a><br>${e(s.edition)}<br>${e(s.scope)}</p>`;
		})
		.join("")}</section>`;
}
export function chapterHTML(c) {
	const d = deepDives[c.id];
	return `<article id="${c.id}" class="chapter"><p>${e(c.subject)} · Chapter ${c.number}</p><h2>${e(c.title)}</h2><p lang="hi">${e(c.hindi)}</p><p>${e(c.intro)}</p>${!c.resourceOnly ? `<h3>Core explanation · earlier draft, review pending</h3><ul>${c.facts.map((f) => `<li>${e(f)}</li>`).join("")}</ul>${researchHTML(c.id)}${d ? `<h3>${e(d.title)} · earlier advanced draft</h3>${d.paragraphs.map((p) => `<p>${e(p)}</p>`).join("")}<table>${d.comparisons.map((row, i) => `<tr>${row.map((v) => `<${i ? "td" : "th"}>${e(v)}</${i ? "td" : "th"}>`).join("")}</tr>`).join("")}</table><p><b>Apply:</b> ${e(d.caseStudy)}</p><p><b>Practice:</b> ${e(d.practice)}</p>` : ""}<h3>Recall & application</h3><p><b>Exam trap:</b> ${e(c.trap)}</p><p><b>Original Mains prompt:</b> ${e(c.mains)}</p>` : ""}<details><summary>Scope checklist · photographed book pages ${e(c.pageRange)}</summary><p>Listed headings are not a claim of full teaching coverage.</p><ul>${(c.subtopics.length ? c.subtopics : (c.editorialOutline || []).map((title) => ({ title }))).map((s) => `<li>${e(s.title)}${s.page ? " — " + e(s.page) : ""}</li>`).join("")}</ul>${c.sourceCaveat ? `<p>${e(c.sourceCaveat)}</p>` : ""}</details><p><a href="#contents">Back to contents</a></p></article>`;
}
export function bookHTML(subject) {
	const parts = bookParts(subject),
		chapters = parts.flatMap((p) => p.chapters);
	return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Abhyas · ${subject} reading book</title><style>html{scroll-behavior:smooth}body{max-width:760px;margin:0 auto;padding:28px;font:18px/1.8 Georgia,serif;color:#24332e;background:#faf9f5}h1,h2,h3,summary{font-family:system-ui,sans-serif;line-height:1.35}h1{font-size:2.3rem}h2{margin-top:1.8em}h3{margin-top:1.6em}p,li{overflow-wrap:anywhere}a{color:#136248}small{color:#53635d}table{width:100%;table-layout:fixed;overflow-wrap:anywhere;border-collapse:collapse;font-size:.85em}th,td{border:1px solid #bec8c1;padding:8px;text-align:left;vertical-align:top}.chapter{border-top:1px solid #bec8c1;margin-top:55px;padding-top:25px}li{margin-bottom:10px}[lang=hi]{color:#546857}details{padding:12px;border:1px solid #bec8c1;margin:20px 0}summary{cursor:pointer}@media print{body{max-width:none;font-size:11pt;background:white;color:black;padding:0}.chapter{break-before:page;border:0}a{color:black;text-decoration:none}h2,h3{break-after:avoid}p,li{orphans:3;widows:3}table{break-inside:avoid}details{display:block}details>*{display:block}}</style></head><body><header><p>ABHYAS / READING EDITION / 19 SEPTEMBER 2026</p><h1>${subject}</h1><p>${chapters.length} mapped units · ${chapters.reduce((n, c) => n + chapterWords(c), 0).toLocaleString("en-IN")} words of teaching, worked examples and recall material.</p><p>${e(editorialNotice)}</p><p>All chapters stay together. Read continuously or use the contents below. To create a PDF, choose Print → Save as PDF in your browser. Page count depends on paper size and font; no 10–20-page limit is imposed. This file needs no JavaScript and makes no automatic network requests. It is read-only: progress and notes remain in the app.</p>${subject === "Economy" ? "<p>Parts are editorial study groupings; chapter order follows your photograph. Practice Sets and Answers are listed as missing source resources, not fabricated.</p>" : ""}</header><nav id="contents"><h2>Contents</h2>${parts.map((p) => `<h3>Part ${p.id} · ${e(p.title)}</h3><ol start="${p.chapters[0].number}">${p.chapters.map((c) => `<li><a href="#${c.id}">${e(c.title)}</a>${c.resourceOnly ? " · source pages needed" : ""}</li>`).join("")}</ol>`).join("")}</nav>${parts.map((p) => `<section><h2>Part ${p.id} · ${e(p.title)}</h2>${p.chapters.map(chapterHTML).join("")}</section>`).join("")}<footer><h2>Scope and edition notes</h2>${curriculum.notes.map((n) => `<p>${e(n)}</p>`).join("")}<h3>Supplementary headings retained from the photographs</h3><p>The following source pages were not supplied; their titles do not constitute imported teaching content.</p><ul>${(subject === "Polity" ? curriculum.supplementary : []).map((s) => `<li>${e(s.group)}: ${e(s.title)} — ${e(s.page)}. ${e(s.status)}</li>`).join("")}</ul></footer></body></html>`;
}
