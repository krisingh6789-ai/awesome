import React, { useEffect, useRef, useState } from "react";
import {
	ArrowLeft,
	ArrowRight,
	BookOpen,
	Download,
	Search,
} from "lucide-react";
import { curriculum } from "./content/pack.js";
import {
	researchedLessons,
	researchSources,
} from "./content/researched-lessons.js";
import { deepDives } from "./content/deep-dives.js";
import {
	bookParts,
	chapterWords,
	matchesChapter,
	bookHTML,
	editorialNotice,
} from "./content/textbook.js";

function downloadBook(subject) {
	const url = URL.createObjectURL(
		new Blob([bookHTML(subject)], { type: "text/html;charset=utf-8" }),
	);
	const a = document.createElement("a");
	a.href = url;
	a.download = `Abhyas-${subject}-Reading-Book.html`;
	a.click();
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function ResearchReading({ id }) {
	const r = researchedLessons[id];
	if (!r) return null;
	return (
		<section className="research-reading">
			<p className="source-note">
				Source-informed expansion · consulted {r.consulted} · independent
				editorial review pending
			</p>
			{r.sections.map((s) => (
				<section className="reading-section" id={s.id} key={s.id}>
					<h2>{s.title}</h2>
					<p className="reading-hindi" lang="hi">
						{s.hindi}
					</p>
					{s.paragraphs.map((p, i) => (
						<p key={i}>{p}</p>
					))}
					<small className="reading-basis">Basis: {s.basis}</small>
				</section>
			))}
			<details className="reading-sources">
				<summary>
					Sources consulted for these explanations ({r.sources.length})
				</summary>
				<p>
					Source references apply to the new sections, not to every earlier
					note. Explanations and Hindi recaps are original AI-written teaching
					material. External publications open online; reading these notes needs
					no connection.
				</p>
				{r.sources.map((key) => {
					const s = researchSources[key];
					return (
						<section key={key}>
							<h3>
								<a href={s.url} target="_blank" rel="noreferrer">
									{s.name} ↗
								</a>
							</h3>
							<p>{s.edition}</p>
							<p>{s.scope}</p>
						</section>
					);
				})}
			</details>
		</section>
	);
}
export function ChapterReading({ chapter: c }) {
	const deep = deepDives[c.id];
	return (
		<article className="book-chapter" id={`read-${c.id}`}>
			<p className="eyebrow">
				{c.subject} / Chapter {c.number}
			</p>
			<h1>{c.title}</h1>
			<p className="reading-hindi" lang="hi">
				{c.hindi}
			</p>
			<p>{c.intro}</p>
			{!c.resourceOnly && (
				<>
					<section>
						<h2>The essential idea</h2>
						<p className="source-note">
							Earlier core explanation · source review pending
						</p>
						{c.facts.map((f, i) => (
							<p key={i}>{f}</p>
						))}
					</section>
					<ResearchReading id={c.id} />
					{deep && (
						<section className="reading-section">
							<h2>{deep.title}</h2>
							<p className="source-note">
								Earlier advanced guide · separate primary-source review pending
							</p>
							{deep.paragraphs.map((p, i) => (
								<p key={i}>{p}</p>
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
							<h3>Apply the idea</h3>
							<p>{deep.caseStudy}</p>
							<h3>Try it yourself</h3>
							<p>{deep.practice}</p>
						</section>
					)}
					<details className="reading-sources">
						<summary>Quick recall & original Mains prompt</summary>
						<h3>Common trap</h3>
						<p>{c.trap}</p>
						<h3>Write an answer</h3>
						<p>{c.mains}</p>
					</details>
				</>
			)}
			<details className="reading-sources">
				<summary>Chapter scope & remaining work</summary>
				<p>
					{researchedLessons[c.id]
						? "Selected concepts have expanded source-informed teaching, but not every photographed subheading has exhaustive coverage."
						: "This chapter has an earlier core explanation, not yet a newly researched long-form expansion."}{" "}
					Full Hindi translation and independent editorial review remain
					pending.
				</p>
				<p>
					Photographed book pages {c.pageRange}. {c.sourceCaveat}
				</p>
				<ul>
					{(c.subtopics.length
						? c.subtopics
						: (c.editorialOutline || []).map((title) => ({ title }))
					).map((s, i) => (
						<li key={i}>
							{s.title}
							{s.page ? ` · p. ${s.page}` : ""}
						</li>
					))}
				</ul>
			</details>
		</article>
	);
}
export default function Textbook({ data, save, onOpen, onTools }) {
	const [subject, setSubject] = useState("Polity"),
		[query, setQuery] = useState(""),
		[selection, setSelection] = useState(null),
		[size, setSize] = useState(18),
		[error, setError] = useState("");
	const heading = useRef(null);
	const parts = bookParts(subject),
		all = parts.flatMap((p) => p.chapters);
	const selected = selection?.part
		? parts.find((p) => p.id === selection.part)?.chapters || []
		: all.filter((c) => c.id === selection?.chapter);
	const c = selected[0],
		index = all.findIndex((x) => x.id === c?.id);
	const resume = data.settings.find(
		(s) => s.id === `reader:${subject}`,
	)?.chapterId;
	const matching = all.filter((c) => matchesChapter(c, query));
	useEffect(() => {
		if (selection) {
			heading.current?.focus({ preventScroll: true });
			heading.current?.scrollIntoView({ block: "start" });
		}
	}, [selection]);
	const open = (choice) => {
		setSelection(choice);
		setError("");
		const first =
			choice.chapter ||
			parts.find((p) => p.id === choice.part)?.chapters[0]?.id;
		if (first)
			save("settings", { id: `reader:${subject}`, chapterId: first }).catch(
				() =>
					setError(
						"Reading position could not be saved. You can still read this chapter.",
					),
			);
	};
	const tools = (chapter) => {
		const t = data.topics.find((t) => t.id === chapter.id);
		if (t) onOpen(t);
		else
			setError(
				"This lesson is not installed in storage. The reading text remains available.",
			);
	};
	return (
		<div className="textbook-library">
			{error && (
				<p role="alert" className="notice">
					{error}
				</p>
			)}
			{selection ? (
				<>
					<div className="reader-toolbar" ref={heading} tabIndex={-1}>
						<button className="secondary" onClick={() => setSelection(null)}>
							<ArrowLeft size={16} />
							Contents
						</button>
						<span>
							{subject}
							{selection.part
								? ` · Part ${selection.part}`
								: ` · ${c?.number} / ${all.length}`}
						</span>
						<label>
							Text size
							<select
								aria-label="Reading text size"
								value={size}
								onChange={(e) => setSize(Number(e.target.value))}
							>
								<option value={18}>Normal</option>
								<option value={21}>Large</option>
								<option value={24}>Extra large</option>
							</select>
						</label>
					</div>
					<div
						className="book-reader"
						style={{ "--reading-size": `${size}px` }}
					>
						<div tabIndex={-1} className="reader-start">
							<p className="source-note">
								{selection.part ? "Continuous part reading. " : ""}Read first;
								open Practice & notes when you need the study tools.
							</p>
						</div>
						<details className="reading-sources">
							<summary>On this {selection.part ? "part" : "chapter"}</summary>
							<ul>
								{selected.map((ch) => (
									<li key={ch.id}>
										<a href={`#read-${ch.id}`}>
											{ch.number}. {ch.title}
										</a>
										{researchedLessons[ch.id] && (
											<ul>
												{researchedLessons[ch.id].sections.map((s) => (
													<li key={s.id}>
														<a href={`#${s.id}`}>{s.title}</a>
													</li>
												))}
											</ul>
										)}
									</li>
								))}
							</ul>
						</details>
						{selected.map((ch) => (
							<React.Fragment key={ch.id}>
								<ChapterReading chapter={ch} />
								{!ch.resourceOnly && (
									<div className="reader-study-tools">
										<button className="secondary" onClick={() => tools(ch)}>
											Practice & notes · {ch.title}
										</button>
										<label>
											Your study status
											<select
												aria-label={`${ch.title} chapter status`}
												value={
													data.topics.find((t) => t.id === ch.id)?.status ||
													"Not started"
												}
												onChange={async (e) => {
													const t = data.topics.find((t) => t.id === ch.id);
													if (t)
														try {
															await save("topics", {
																...t,
																status: e.target.value,
															});
														} catch {
															setError("Status could not be saved.");
														}
												}}
											>
												{[
													"Not started",
													"Learning",
													"Completed",
													"Revised",
													"Mastered",
												].map((s) => (
													<option key={s}>{s}</option>
												))}
											</select>
										</label>
									</div>
								)}
							</React.Fragment>
						))}
						{!selection.part && (
							<nav
								className="reader-pagination"
								aria-label="Chapter navigation"
							>
								<button
									className="secondary"
									disabled={index <= 0}
									onClick={() => open({ chapter: all[index - 1].id })}
								>
									<ArrowLeft size={16} />
									Previous chapter
								</button>
								<button
									className="secondary"
									disabled={index >= all.length - 1}
									onClick={() => open({ chapter: all[index + 1].id })}
								>
									Next chapter
									<ArrowRight size={16} />
								</button>
							</nav>
						)}
						<button className="secondary" onClick={() => downloadBook(subject)}>
							<Download size={16} />
							Download complete {subject} reading book
						</button>
					</div>
				</>
			) : (
				<>
					<header className="book-library-header">
						<span className="eyebrow">YOUR READING DESK</span>
						<h2>One subject. All its chapters.</h2>
						<p>
							Choose a part, then read a chapter—or the whole part without
							interruptions.
						</p>
					</header>
					<div className="book-controls">
						<div className="tabs" aria-label="Subject">
							{["Polity", "Economy"].map((s) => (
								<button
									key={s}
									className={s === subject ? "selected" : ""}
									onClick={() => {
										setSubject(s);
										setQuery("");
									}}
								>
									{s}
								</button>
							))}
						</div>
						<div className="search-inline">
							<Search size={16} />
							<input
								aria-label="Search textbook"
								placeholder="Find a chapter, heading or explanation…"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
							/>
						</div>
					</div>
					<div className="book-overview">
						<p>
							{all.length} mapped units · {parts.length} parts
							{subject === "Economy" ? " (editorial groups)" : ""} ·{" "}
							{matching.length !== all.length
								? `${matching.length} matches`
								: "available offline"}
						</p>
						{resume && all.some((c) => c.id === resume) && (
							<button
								className="secondary"
								onClick={() => open({ chapter: resume })}
							>
								Continue reading
								<ArrowRight size={16} />
							</button>
						)}
					</div>
					{parts.map((p) => {
						const chapters = p.chapters.filter((c) => matchesChapter(c, query));
						if (!chapters.length) return null;
						return (
							<details
								className="book-part"
								key={`${subject}-${p.id}-${!!query}`}
								open={query.trim() ? true : undefined}
							>
								<summary>
									<span className="part-number">{p.id}</span>
									<span>
										<strong>{p.title}</strong>
										<small>{p.chapters.length} chapters / entries</small>
									</span>
								</summary>
								<div className="part-chapters">
									<button
										className="part-read secondary"
										onClick={() => open({ part: p.id })}
									>
										<BookOpen size={16} />
										Read this entire part
									</button>
									{chapters.map((c) => (
										<button
											className="chapter-row"
											key={c.id}
											onClick={() => open({ chapter: c.id })}
										>
											<span className="chapter-number">
												{String(c.number).padStart(2, "0")}
											</span>
											<span>
												<strong>{c.title}</strong>
												<small>
													{c.resourceOnly
														? "Source pages needed"
														: `${researchedLessons[c.id] ? "Expanded reading" : "Core reading"} · ${Math.max(1, Math.ceil(chapterWords(c) / 180))} min`}
													{["Completed", "Revised", "Mastered"].includes(
														data.topics.find((t) => t.id === c.id)?.status,
													)
														? " · Studied"
														: ""}
												</small>
											</span>
											<ArrowRight size={16} />
										</button>
									))}
								</div>
							</details>
						);
					})}
					{!matching.length && (
						<p className="notice">
							No matching chapters. Try another word or select the other
							subject.
						</p>
					)}
					<div className="book-bottom-tools">
						<button className="secondary" onClick={() => downloadBook(subject)}>
							<Download size={16} />
							Download {subject} reading book
						</button>
						<button className="text-btn" onClick={onTools}>
							Coverage & resources
						</button>
					</div>
					<details className="reading-sources">
						<summary>About depth, sources & offline books</summary>
						<p>{editorialNotice}</p>
						<p>
							Every photographed chapter is retained. 97 have core lessons; 10
							currently have 59 newly researched explanatory sections, with
							Hindi recaps. Two Economy entries list the book's practice sets
							and answers whose actual pages have not been supplied. The
							complete reading books include all available teaching, not a claim
							that all teaching is finished.
						</p>
						<p>
							Download a subject as one offline, read-only HTML book. Open it in
							a browser and choose Print → Save as PDF if needed. There is no
							page-count cap. Notes and progress stay in the app; external
							source links require internet.
						</p>
					</details>
				</>
			)}
		</div>
	);
}
