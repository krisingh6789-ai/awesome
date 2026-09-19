import React, { useState, useMemo } from "react";
import {
	Search,
	BookOpen,
	ChevronRight,
	ChevronLeft,
	Download,
	CheckCircle2,
	ClipboardList,
	Landmark,
	Coins,
	FileText,
	ArrowRight,
	Link,
	PenLine,
} from "lucide-react";
import {
	curriculum,
	packTopics,
	packQuestions,
	references,
} from "./content/pack.js";
import { deepDives } from "./content/deep-dives.js";
const states = ["Not started", "Learning", "Completed", "Revised", "Mastered"];
const exportJSON = (data, name) => {
	const url = URL.createObjectURL(
		new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
	);
	const a = document.createElement("a");
	a.href = url;
	a.download = name;
	a.click();
	setTimeout(() => URL.revokeObjectURL(url), 1000);
};
export function SourceChecklist({ chapter, data, save, onNote }) {
	const record = data.settings.find(
		(s) => s.id === `coverage:${chapter.id}`,
	) || { id: `coverage:${chapter.id}`, chapterId: chapter.id, marks: {} };
	const [busy, setBusy] = useState(false);
	const items = chapter.subtopics.length
		? chapter.subtopics
		: (chapter.editorialOutline || []).map((title, i) => ({
				id: `${chapter.id}-editorial-${i + 1}`,
				title,
				page: null,
				type: "editorial",
				origin: "Editorial study outline",
			}));
	return (
		<div className="source-checklist">
			<p className="source-note">
				{chapter.subject === "Polity"
					? "Printed headings below are transcribed from your contents photographs."
					: "The Economy photograph has no printed subheadings. The items below are an original study outline, not a transcription."}{" "}
				Your study status is separate from editorial content coverage.
			</p>
			{items.map((item) => (
				<div className="coverage-row" key={item.id}>
					<div>
						<strong>{item.title}</strong>
						<small>
							{item.page ? `Book p. ${item.page} · ` : ""}
							{item.type === "reference"
								? "Source references not supplied"
								: item.type === "editorial"
									? "Editorial scope · full expansion pending"
									: "Heading mapped · full expansion pending"}
						</small>
					</div>
					{item.type !== "reference" && (
						<>
							<select
								disabled={busy}
								aria-label={`${item.title} learning status`}
								value={record.marks[item.id] || "Not started"}
								onChange={async (e) => {
									const status = e.target.value;
									setBusy(true);
									try {
										await save("settings", {
											...record,
											marks: { ...record.marks, [item.id]: status },
										});
									} finally {
										setBusy(false);
									}
								}}
							>
								{states.map((s) => (
									<option key={s}>{s}</option>
								))}
							</select>
							<button
								className="icon-btn"
								title={`Add note: ${item.title}`}
								onClick={() => onNote(chapter, item)}
							>
								<PenLine size={16} />
							</button>
						</>
					)}
				</div>
			))}
		</div>
	);
}
export default function Curriculum({ data, save, onOpen, onNote }) {
	const [subject, setSubject] = useState("Polity"),
		[section, setSection] = useState("All"),
		[query, setQuery] = useState(""),
		[view, setView] = useState("Chapters"),
		[page, setPage] = useState(1);
	const [learnedOnly, setLearnedOnly] = useState(false);
	const records = data.topics.filter((t) => t.packId === curriculum.id);
	const learned = records.filter((t) =>
		["Completed", "Revised", "Mastered"].includes(t.status),
	).length;
	const sourceItems = curriculum.chapters.reduce(
		(n, c) => n + c.subtopics.length,
		0,
	);
	const filtered = useMemo(
		() =>
			curriculum.chapters.filter(
				(c) =>
					(subject === "All" || c.subject === subject) &&
					(section === "All" || c.section === section) &&
					(!learnedOnly ||
						["Learning", "Completed", "Revised", "Mastered"].includes(
							records.find((t) => t.id === c.id)?.status,
						)) &&
					`${c.number} ${c.title} ${c.hindi} ${(c.subtopics || []).map((s) => s.title).join(" ")} ${(c.editorialOutline || []).join(" ")}`
						.toLowerCase()
						.includes(query.toLowerCase()),
			),
		[subject, section, query, learnedOnly, data.topics],
	);
	const pageCount = Math.max(1, Math.ceil(filtered.length / 12)),
		current = Math.min(page, pageCount),
		visible = filtered.slice((current - 1) * 12, current * 12);
	const changeSubject = (s) => {
		setSubject(s);
		setSection("All");
		setPage(1);
	};
	return (
		<div className="curriculum">
			<section className="curriculum-intro panel">
				<div>
					<span className="eyebrow">FROM YOUR BOOKS TO YOUR STUDY DESK</span>
					<h2>Polity & Economy, connected.</h2>
					<p>भारतीय राजव्यवस्था और अर्थव्यवस्था · 2027 preparation</p>
					<p>
						All visible numbered headings are mapped. These are book
						contents—not the official UPSC syllabus. Core lessons are original
						AI-generated material, not copied chapters or verified official
						teaching notes.
					</p>
				</div>
				<span className="curriculum-emblem">
					<Landmark size={46} />
					<Coins size={25} />
				</span>
			</section>
			<div className="stats-grid">
				<section className="stat">
					<div className="stat-label">Mapped units</div>
					<strong>99</strong>
					<p>80 Polity + 19 Economy entries</p>
				</section>
				<section className="stat">
					<div className="stat-label">Printed Polity entries</div>
					<strong>{sourceItems}</strong>
					<p>Subheadings + reference lines preserved</p>
				</section>
				<section className="stat">
					<div className="stat-label">Original core lessons</div>
					<strong>97</strong>
					<p>8 expanded guides · source review pending</p>
				</section>
				<section className="stat">
					<div className="stat-label">Your completed lessons</div>
					<strong>{learned} / 97</strong>
					<p>Self-reported learning progress only</p>
				</section>
			</div>
			<div className="tabs">
				{["Chapters", "Coverage register", "Source & appendices"].map((v) => (
					<button
						key={v}
						className={view === v ? "selected" : ""}
						onClick={() => {
							setView(v);
							setPage(1);
						}}
					>
						{v}
					</button>
				))}
			</div>
			{view === "Source & appendices" ? (
				<>
					<section className="panel roomy">
						<h2>What the photographs establish</h2>
						<ul>
							{curriculum.notes.map((n) => (
								<li key={n}>
									<p>{n}</p>
								</li>
							))}
						</ul>
						<div className="notice">
							Edition gap: do not use this older contents page as a statement of
							law or statistics currently in force. All new core lessons need
							primary-source review. Current figures, officeholders and live
							rankings are deliberately not invented.
						</div>
						<h3>Coverage is not a completion claim</h3>
						<p>
							97 core lessons have been written; 8 contain additional worked
							examples, comparisons and case analysis. Detailed standalone
							treatment of every subheading, complete Hindi translations,
							official PYQs, the book’s ten practice sets and its answer pages
							are still pending.
						</p>
						<button
							className="secondary"
							onClick={() =>
								exportJSON(
									{
										version: 1,
										topics: packTopics,
										questions: packQuestions,
										cards: [],
										notes: [],
										affairs: [],
									},
									"abhyas-polity-economy-content.json",
								)
							}
						>
							<Download size={16} />
							Export original content pack
						</button>
					</section>
					<section className="panel roomy">
						<h2>Front matter, appendices & extra reading</h2>
						<p>
							All {curriculum.supplementary.length} visible entries are
							retained. Their underlying pages were not supplied.
							Historic-frequency headings are not a prediction of future exams.
						</p>
						{curriculum.supplementary.map((s) => (
							<div className="supplementary-item" key={s.id}>
								<span className="badge">{s.group}</span>
								<h3>{s.title}</h3>
								<p>
									{s.page} · {s.status}
								</p>
							</div>
						))}
					</section>
				</>
			) : (
				<>
					<div className="curriculum-controls">
						<div className="tabs subject-tabs">
							{["Polity", "Economy", "All"].map((s) => (
								<button
									key={s}
									className={subject === s ? "selected" : ""}
									onClick={() => changeSubject(s)}
								>
									{s}
								</button>
							))}
						</div>
						<div className="search-inline">
							<Search size={16} />
							<input
								aria-label="Search curriculum"
								placeholder="Search chapters or subtopics…"
								value={query}
								onChange={(e) => {
									setQuery(e.target.value);
									setPage(1);
								}}
							/>
						</div>
						<select
							aria-label="Curriculum section"
							value={section}
							onChange={(e) => {
								setSection(e.target.value);
								setPage(1);
							}}
						>
							<option>All</option>
							{[
								...new Set(
									curriculum.chapters
										.filter((c) => subject === "All" || c.subject === subject)
										.map((c) => c.section),
								),
							].map((s) => (
								<option key={s}>{s}</option>
							))}
						</select>
					</div>
					<div className="toolbar">
						<p>
							{filtered.length} matching units ·{" "}
							{subject === "Economy"
								? "2 listed source resources have no supplied question/answer pages"
								: "Select a chapter to learn or inspect exact source headings"}
						</p>
						<button
							className="secondary"
							onClick={() => {
								setLearnedOnly(!learnedOnly);
								setPage(1);
							}}
						>
							{learnedOnly ? "Show every unit" : "My started lessons"}
						</button>
						<button
							className="secondary"
							onClick={() =>
								exportJSON(
									{
										...curriculum,
										learnerProgress: data.settings.filter((s) =>
											s.id.startsWith("coverage:"),
										),
										lessonProgress: records.map((t) => ({
											id: t.id,
											status: t.status,
										})),
									},
									"abhyas-syllabus-coverage.json",
								)
							}
						>
							<Download size={15} />
							Export coverage
						</button>
					</div>
					{view === "Chapters" ? (
						<div className="curriculum-grid">
							{visible.map((c) => {
								const t = records.find((t) => t.id === c.id),
									qCount = packQuestions.filter((q) => q.topic === c.id).length;
								return (
									<section className="panel curriculum-card" key={c.id}>
										<div className="chapter-card-top">
											<span className="chapter-number">
												{String(c.number).padStart(2, "0")}
											</span>
											<span className="badge">
												{c.subject}
												{c.resourceOnly ? " · SOURCE NEEDED" : ""}
											</span>
											{deepDives[c.id] && (
												<span className="green-badge">Expanded guide</span>
											)}
										</div>
										<small>{c.section}</small>
										<h3>{c.title}</h3>
										<p lang="hi" className="hindi-reading">
											{c.hindi}
										</p>
										<p>
											{c.resourceOnly
												? c.intro
												: `${c.subtopics.length ? c.subtopics.length + " printed headings" : (c.editorialOutline || []).length + " editorial study areas"} · ${qCount} original MCQs`}
										</p>
										<div className="chapter-card-bottom">
											<small>Book pp. {c.pageRange}</small>
											{t ? (
												<button className="primary" onClick={() => onOpen(t)}>
													Read lesson
													<ArrowRight size={15} />
												</button>
											) : (
												<span className="muted small-text">
													Questions / answers not provided
												</span>
											)}
										</div>
										{t && (
											<span className="source-note">
												Your status: {t.status} · core coverage, not full
												chapter
											</span>
										)}
									</section>
								);
							})}
						</div>
					) : (
						<div className="coverage-register">
							{visible.map((c) => (
								<section className="panel roomy" key={c.id}>
									<div className="section-heading">
										<h2>
											{c.number}. {c.title}
										</h2>
										{!c.resourceOnly && (
											<button
												onClick={() =>
													onOpen(records.find((t) => t.id === c.id))
												}
											>
												Read core lesson
												<ArrowRight size={16} />
											</button>
										)}
									</div>
									<p>
										Source: {c.subject} contents {c.toc} · chapter pp.{" "}
										{c.pageRange}
									</p>
									{c.sourceCaveat && (
										<p className="source-note">{c.sourceCaveat}</p>
									)}
									{c.resourceOnly ? (
										<p>{c.intro}</p>
									) : (
										<SourceChecklist
											chapter={c}
											data={data}
											save={save}
											onNote={onNote}
										/>
									)}
								</section>
							))}
						</div>
					)}
					{!filtered.length && (
						<div className="panel roomy">
							<h2>No matching units</h2>
							<p>
								Try a different word, change the section, or show every unit.
							</p>
						</div>
					)}
					<div className="pagination">
						<button
							className="secondary"
							disabled={current === 1}
							onClick={() => setPage(current - 1)}
						>
							<ChevronLeft size={16} />
							Previous
						</button>
						<span>
							Page {current} / {pageCount}
						</span>
						<button
							className="secondary"
							disabled={current === pageCount}
							onClick={() => setPage(current + 1)}
						>
							Next
							<ChevronRight size={16} />
						</button>
					</div>
				</>
			)}
		</div>
	);
}
export function ExpandedLesson({ topic: t, data, save, onNote, onRelated }) {
	const [section, setSection] = useState("Learn");
	const deep = deepDives[t.id],
		ref = references[t.reference] || references.constitution;
	const qCount = packQuestions.filter((q) => q.topic === t.id).length;
	return (
		<div className="expanded-lesson">
			<div className="notice">
				Core lesson · original AI-generated explanation · primary-source review
				pending. Detailed coverage of every printed subheading is not yet
				complete. English explanations with Hindi chapter titles; full Hindi
				translation pending.
			</div>
			<div className="tabs">
				{["Learn", "Deep dive", "Source checklist", "Revision & sources"].map(
					(s) => (
						<button
							key={s}
							className={section === s ? "selected" : ""}
							onClick={() => setSection(s)}
						>
							{s}
						</button>
					),
				)}
			</div>
			{section === "Learn" ? (
				<>
					<p className="reading-text">{t.intro}</p>
					<h2>Understand the essential distinctions</h2>
					{t.facts.map((f, i) => (
						<section className="concept-block" key={i}>
							<span>{String(i + 1).padStart(2, "0")}</span>
							<p className="reading-text">{f}</p>
						</section>
					))}
					<div className="exam-trap">
						<strong>Common exam trap</strong>
						<p>{t.trap}</p>
					</div>
					<h2>Mains question · original prompt</h2>
					<p className="reading-text">{t.mains}</p>
					<p className="source-note">
						The connected practice bank currently includes {qCount} original
						question{qCount === 1 ? "" : "s"} for this chapter. It is not a
						comprehensive question bank.
					</p>
				</>
			) : section === "Deep dive" ? (
				deep ? (
					<>
						<h2>{deep.title}</h2>
						{deep.paragraphs.map((p) => (
							<p className="reading-text" key={p}>
								{p}
							</p>
						))}
						<div className="comparison-wrap">
							<table>
								<thead>
									<tr>
										{deep.comparisons[0].map((h) => (
											<th key={h}>{h}</th>
										))}
									</tr>
								</thead>
								<tbody>
									{deep.comparisons.slice(1).map((row, i) => (
										<tr key={i}>
											{row.map((v, j) => (
												<td key={j}>{v}</td>
											))}
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<h2>Apply it to a situation</h2>
						<p className="reading-text">{deep.caseStudy}</p>
						<div className="revision-sheet">
							<strong>Deliberate practice</strong>
							<p>{deep.practice}</p>
						</div>
					</>
				) : (
					<>
						<h2>Detailed expansion is pending</h2>
						<p>
							This chapter has a substantive core lesson and an exact source
							checklist, but no additional worked deep-dive guide yet. It is not
							marked complete just because a chapter card exists.
						</p>
						<p>
							Use the Source checklist to record what you have studied from your
							own material and add linked notes. The Mains question and exam
							trap are available in Learn.
						</p>
						<button
							className="secondary"
							onClick={() => setSection("Source checklist")}
						>
							Open source checklist
							<ArrowRight size={16} />
						</button>
					</>
				)
			) : section === "Source checklist" ? (
				<>
					<h2>Nothing silently dropped</h2>
					<p>
						Contents page {t.toc} · book pages {t.pageRange}. {t.sourceCaveat}
					</p>
					<SourceChecklist
						chapter={t}
						data={data}
						save={save}
						onNote={onNote}
					/>
				</>
			) : (
				<>
					<h2>One-page recall sheet</h2>
					<div className="revision-sheet">
						<h3>
							{t.title} · {t.hindi}
						</h3>
						{t.facts.map((f, i) => (
							<p key={i}>
								{i + 1}. {f}
							</p>
						))}
						<p>
							<b>Trap:</b> {t.trap}
						</p>
					</div>
					<h2>Verification route</h2>
					<p>
						Source photographs establish the headings only. The following
						primary-source portal is a place to check the applicable law,
						judgment, methodology or release; it is not a claim that every
						sentence has received independent source review.
					</p>
					<a href={ref.url} target="_blank" rel="noreferrer">
						{ref.name} ↗
					</a>
					<p className="source-note">
						External link requires internet. Constitutional cases should be
						checked against the actual judgment, not merely a portal homepage.
						Current rules and figures require a dated release.
					</p>
					<button
						className="secondary"
						onClick={() =>
							exportJSON(
								{
									title: t.title,
									hindi: t.hindi,
									facts: t.facts,
									trap: t.trap,
									mains: t.mains,
									source: ref,
									reviewStatus: t.reviewStatus,
								},
								`${t.id}-revision.json`,
							)
						}
					>
						<Download size={16} />
						Export revision sheet
					</button>
					{deep?.related && (
						<>
							<h2>Connect this chapter</h2>
							<div className="related-topics">
								{deep.related.map((id) => {
									const other = data.topics.find((x) => x.id === id);
									return (
										other && (
											<button
												className="secondary"
												key={id}
												onClick={() => {
													setSection("Learn");
													onRelated(other);
												}}
											>
												{other.title}
												<ArrowRight size={14} />
											</button>
										)
									);
								})}
							</div>
						</>
					)}
				</>
			)}
		</div>
	);
}
