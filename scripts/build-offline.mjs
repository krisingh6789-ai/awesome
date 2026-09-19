import { build } from "esbuild";
import fs from "node:fs/promises";
import { topics, questions } from "../src/data.js";
import { lessonHindi } from "../src/hindi.js";
const result = await build({
	entryPoints: ["src/main.jsx"],
	bundle: true,
	write: false,
	outfile: "build/offline.js",
	format: "iife",
	platform: "browser",
	minify: true,
	target: ["es2020"],
	legalComments: "inline",
	loader: { ".woff2": "dataurl", ".woff": "dataurl" },
	define: { "process.env.NODE_ENV": '"production"', "import.meta.env.BASE_URL": '"/"' },
});
const js = result.outputFiles
	.find((f) => f.path.endsWith(".js"))
	.text.replace(/<\/script/gi, "<\\/script");
const css = result.outputFiles
	.find((f) => f.path.endsWith(".css"))
	.text.replace(/<\/style/gi, "<\\/style");
const escape = (text) =>
	String(text).replace(
		/[&<>"']/g,
		(c) =>
			({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
				c
			],
	);
// Usable reading content remains visible even when an attachment viewer blocks JavaScript.
const library = topics
	.map(
		(t) =>
			`<section class="panel roomy"><span class="badge">${escape(t.subject)} · STARTER CONTENT</span><h2>${escape(t.title)} · ${escape(t.hindi)}</h2><p>${escape(t.intro)}</p><p class="hindi-reading">${escape(lessonHindi[t.id]?.intro || "")}</p><ul>${t.facts.map((f, i) => `<li>${escape(f)}<p class="hindi-reading">${escape(lessonHindi[t.id]?.facts[i] || "")}</p></li>`).join("")}</ul>${questions
				.filter((q) => q.topic === t.id)
				.map(
					(q) =>
						`<details class="offline-question"><summary>${escape(q.text)}</summary><ol type="A">${q.options.map((o) => `<li>${escape(o)}</li>`).join("")}</ol><p><b>Answer: ${escape(q.options[q.answer])}</b></p><p>${escape(q.explanation)}</p></details>`,
				)
				.join("")}</section>`,
	)
	.join("");
const html = `<!doctype html><html lang="en" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#111816"><title>Abhyas — Offline Study Viewer</title><link rel="icon" href="data:,"><style>${css}\n.fallback-reader{max-width:960px;margin:auto;padding:32px 20px}.offline-question{padding:16px 0;border-top:1px solid var(--line);line-height:1.8}.offline-question summary{cursor:pointer}.portable-notice{margin-top:0;font-size:11px}</style></head><body><div id="root"><main class="fallback-reader"><span class="eyebrow">ABHYAS · OFFLINE STUDY VIEWER</span><h1>Your UPSC starter library</h1><p>Reading mode works without scripts. Download this file and open it in a JavaScript-enabled browser for quizzes, saved notes, revision and the full workspace. AI and external source links require internet.</p>${library}</main></div><script>window.__ABHYAS_PORTABLE__=true;${js}</script></body></html>`;
await fs.writeFile("Abhyas-Offline.html", html);
console.log(
	`Created Abhyas-Offline.html (${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB). Code, starter lessons and fonts are embedded. No server or network is required for core use.`,
);
