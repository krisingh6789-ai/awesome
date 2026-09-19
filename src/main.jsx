import Curriculum, { ExpandedLesson } from "./Curriculum.jsx";
import {
	installCurriculum,
	curriculum,
	packTopics,
	packQuestions,
} from "./content/pack.js";
import { lessonHindi } from "./hindi";
import "@fontsource-variable/noto-sans-devanagari";
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/manrope";
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
	LayoutDashboard,
	BookOpen,
	ClipboardList,
	Layers,
	PenLine,
	FolderOpen,
	ChartNoAxesCombined,
	CalendarDays,
	Settings,
	Search,
	Bell,
	ChevronRight,
	ArrowUpRight,
	ArrowRight,
	Plus,
	Check,
	Clock,
	Target,
	Flame,
	MoreHorizontal,
	Play,
	Pause,
	RotateCcw,
	Bookmark,
	Download,
	Upload,
	WifiOff,
	X,
	Sun,
	Moon,
	GraduationCap,
	Leaf,
	Landmark,
	Globe,
	Coins,
	History,
	Brain,
	Sparkles,
	CheckCircle2,
	FileText,
	Menu,
	ChevronLeft,
	Trash2,
	Send,
	Monitor,
	BookMarked,
} from "lucide-react";
import {
	db,
	init,
	syllabus,
	topics as starterTopics,
	questions as starterQuestions,
} from "./data";
const PORTABLE =
	Boolean(window.__ABHYAS_PORTABLE__) || location.protocol === "file:";
import "./style.css";
const icons = {
	Polity: Landmark,
	Economy: Coins,
	Geography: Globe,
	Environment: Leaf,
	History: History,
	Ethics: Brain,
	CSAT: Target,
};
const nav = [
	["Dashboard", LayoutDashboard],
	["Study", BookOpen],
	["Practice", ClipboardList],
	["Revision", Layers],
	["Writing", PenLine],
	["Resources", FolderOpen],
	["Analytics", ChartNoAxesCombined],
];
const day = () => new Date().toLocaleDateString("en-CA");
const fmt = (s) =>
	`${Math.floor(s / 60)
		.toString()
		.padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
const download = (data, name) => {
	const a = document.createElement("a");
	a.href = URL.createObjectURL(
		new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
	);
	a.download = name;
	a.click();
	setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};
function App() {
	const [ready, setReady] = useState(false),
		[startupError, setStartupError] = useState(null),
		[page, setPage] = useState("Dashboard"),
		[data, setData] = useState({}),
		[modal, setModal] = useState(null),
		[toast, setToast] = useState(""),
		[search, setSearch] = useState(""),
		[revisionLimit, setRevisionLimit] = useState(24),
		[filter, setFilter] = useState("All"),
		[online, setOnline] = useState(navigator.onLine),
		[menu, setMenu] = useState(false),
		[lang, setLang] = useState(false),
		[install, setInstall] = useState(null),
		[focus, setFocus] = useState(false),
		[seconds, setSeconds] = useState(25 * 60),
		[elapsed, setElapsed] = useState(0),
		[timerSubject, setTimerSubject] = useState("Polity");
	const refresh = async () => {
		const o = {};
		for (const t of db.tables) o[t.name] = await t.toArray();
		const order = [
			"rights",
			"inflation",
			"monsoon",
			"parliament",
			"biodiversity",
			"movement",
			"ethics",
			"csat",
		];
		o.topics.sort(
			(a, b) =>
				(order.indexOf(a.id) < 0 ? 99 : order.indexOf(a.id)) -
				(order.indexOf(b.id) < 0 ? 99 : order.indexOf(b.id)),
		);
		o.questions.sort(
			(a, b) =>
				Number(Boolean(a.packId)) - Number(Boolean(b.packId)) ||
				a.id.localeCompare(b.id, undefined, { numeric: true }),
		);
		setData(o);
		setReady(true);
	};
	useEffect(() => {
		init()
			.then(refresh)
			.catch((error) =>
				setStartupError(error.message || "Device storage is unavailable."),
			);
		const on = () => setOnline(navigator.onLine);
		window.addEventListener("online", on);
		window.addEventListener("offline", on);
		const ins = (e) => {
			e.preventDefault();
			setInstall(e);
		};
		window.addEventListener("beforeinstallprompt", ins);
		if (
			!PORTABLE &&
			/^https?:$/.test(location.protocol) &&
			"serviceWorker" in navigator
		)
			navigator.serviceWorker
				.register(`${import.meta.env.BASE_URL}sw.js`)
				.catch(() =>
					setToast(
						"Offline cache could not be registered. Use the downloaded offline viewer or enable browser storage.",
					),
				);
		return () => {
			window.removeEventListener("online", on);
			window.removeEventListener("offline", on);
			window.removeEventListener("beforeinstallprompt", ins);
		};
	}, []);
	useEffect(() => {
		if (!toast) return;
		const t = setTimeout(() => setToast(""), 4000);
		return () => clearTimeout(t);
	}, [toast]);
	useEffect(() => {
		if (!focus) return;
		const t = setInterval(() => {
			setSeconds((s) => Math.max(0, s - 1));
			setElapsed((e) => e + 1);
		}, 1000);
		return () => clearInterval(t);
	}, [focus]);
	useEffect(() => {
		if (seconds === 0 && focus) {
			setFocus(false);
			setToast("Focus session complete. Save your study time.");
		}
	}, [seconds, focus]);
	const go = (p) => {
		setPage(p);
		setFilter("All");
		setMenu(false);
		window.scrollTo(0, 0);
	};
	const save = async (table, obj) => {
		await db[table].put(obj);
		await refresh();
	};
	const profile = data.settings?.find((s) => s.id === "profile") || {};
	useEffect(() => {
		document.documentElement.dataset.theme = profile.theme || "dark";
	}, [profile.theme]);
	if (startupError)
		return (
			<main className="fallback-reader">
				<span className="eyebrow">ABHYAS · OFFLINE READING MODE</span>
				<h1>Your offline study library</h1>
				<div className="notice">
					This browser cannot access local storage for this file. You can still
					read the included core lessons and questions below. Progress, notes
					and bookmarks cannot be saved in this mode. For the interactive
					workspace, download the file and open it directly in a browser that
					supports local-file IndexedDB.
				</div>
				<details>
					<summary>Storage diagnostic</summary>
					<p>{startupError}</p>
				</details>
				{[...starterTopics, ...packTopics].map((t) => (
					<section className="panel roomy" key={t.id}>
						<span className="badge">
							{t.packId
								? "ORIGINAL CORE LESSON · REVIEW PENDING"
								: "STARTER LESSON"}{" "}
							· {t.subject}
						</span>
						<h2>
							{t.title} · {t.hindi}
						</h2>
						<p>{t.intro}</p>
						<p className="hindi-reading">{lessonHindi[t.id]?.intro}</p>
						<ul>
							{t.facts.map((f, i) => (
								<li key={f}>
									{f}
									<p className="hindi-reading">{lessonHindi[t.id]?.facts[i]}</p>
								</li>
							))}
						</ul>
						{[...starterQuestions, ...packQuestions]
							.filter((q) => q.topic === t.id)
							.map((q) => (
								<details className="offline-question" key={q.id}>
									<summary>{q.text}</summary>
									<ol type="A">
										{q.options.map((o) => (
											<li key={o}>{o}</li>
										))}
									</ol>
									<p>
										<b>Answer: {q.options[q.answer]}</b>
									</p>
									<p>{q.explanation}</p>
								</details>
							))}
					</section>
				))}
			</main>
		);
	if (!ready)
		return (
			<div className="loading">
				<GraduationCap size={40} />
				<h2>Preparing your study space…</h2>
			</div>
		);
	const attempts = data.attempts,
		correct = attempts.filter((a) => a.correct).length,
		accuracy = attempts.length
			? Math.round((correct / attempts.length) * 100)
			: 0,
		due = data.cards.filter((c) => c.due <= Date.now()),
		studyToday = data.sessions
			.filter((s) => s.date === day())
			.reduce((a, s) => a + s.seconds, 0),
		complete = data.topics.filter((t) =>
			["Completed", "Revised", "Mastered"].includes(t.status),
		).length;
	const subjects = [...new Set(data.topics.map((t) => t.subject))];
	const weak = subjects
		.map((s) => {
			const a = attempts.filter((a) => a.subject === s);
			return {
				subject: s,
				count: a.length,
				accuracy: a.length
					? Math.round((a.filter((a) => a.correct).length / a.length) * 100)
					: 0,
			};
		})
		.filter((s) => s.count)
		.sort((a, b) => a.accuracy - b.accuracy);
	const streak = (() => {
		const dates = new Set([...attempts, ...data.sessions].map((a) => a.date));
		let n = 0,
			d = new Date();
		if (!dates.has(day())) d.setDate(d.getDate() - 1);
		while (dates.has(d.toLocaleDateString("en-CA"))) {
			n++;
			d.setDate(d.getDate() - 1);
		}
		return n;
	})();
	const bookmark = async (id, type) => {
		if (await db.bookmarks.get(id)) {
			await db.bookmarks.delete(id);
			setToast("Bookmark removed");
		} else {
			await db.bookmarks.put({ id, type, folder: "Must Revise" });
			setToast("Saved to Must Revise");
		}
		refresh();
	};
	const openTopic = (t) => {
		if (t) setModal({ type: "topic", topic: t });
	};
	const linkedNote = (chapter, item) =>
		setModal({
			type: "note",
			note: {
				title: `${chapter.title} — ${item.title}`,
				body: "",
				type: "Topic",
				topic: chapter.id,
				syllabusItem: item.id,
				tags: chapter.subject,
				date: day(),
			},
		});
	const startQuiz = (mode = "Practice", subject = "All", mistakes = false) => {
		let qs = data.questions.filter(
			(q) =>
				(subject === "All" || q.subject === subject) &&
				(!mistakes || data.mistakes.some((m) => m.questionId === q.id)),
		);
		if (mode === "PYQs") qs = qs.filter((q) => q.kind === "PYQ");
		if (!qs.length) {
			setToast("No matching questions. Import a question pack in Resources.");
			return;
		}
		setModal({ type: "quiz", mode, questions: qs });
	};
	const todayTasks = data.tasks.filter((t) => t.date === day());
	const header = (eyebrow, title, desc, actions) => (
		<div className="page-head">
			<div>
				<div className="eyebrow">{eyebrow}</div>
				<h1>{title}</h1>
				<p>{desc}</p>
			</div>
			{actions}
		</div>
	);
	const cards = (items) => (
		<div className="topic-grid">
			{items.map((t) => {
				const Icon = icons[t.subject] || BookOpen;
				return (
					<button
						className="topic-card"
						key={t.id}
						onClick={() => openTopic(t)}
					>
						<span className={"subject-icon " + t.subject.toLowerCase()}>
							<Icon size={22} />
						</span>
						<small>
							{t.subject} <span>• Starter lesson</span>
						</small>
						<h3>{t.title}</h3>
						<p>{t.hindi}</p>
						<div className="topic-foot">
							<span>{t.status}</span>
							<ArrowUpRight size={17} />
						</div>
					</button>
				);
			})}
		</div>
	);
	return (
		<div className="app">
			<aside className={menu ? "sidebar open" : "sidebar"}>
				<a className="brand" onClick={() => go("Dashboard")}>
					<div className="brand-mark">
						A<span />
					</div>
					<div>
						abhyas<span>THE UPSC COMPANION</span>
					</div>
				</a>
				<div className="workspace">
					<div className="workspace-icon">
						<GraduationCap size={19} />
					</div>
					<div>
						UPSC CSE {profile.year}
						<small>Your preparation workspace</small>
					</div>
					<span className="status-dot" />
				</div>
				<div className="nav-label">YOUR WORKSPACE</div>
				<nav>
					{nav.map(([p, I]) => (
						<button
							key={p}
							className={page === p ? "active" : ""}
							onClick={() => go(p)}
						>
							<I size={19} />
							{p}
							{p === "Revision" && (
								<span className="nav-count">{due.length}</span>
							)}
						</button>
					))}
				</nav>
				<div className="nav-sep" />
				<nav>
					<button
						className={page === "Planner" ? "active" : ""}
						onClick={() => go("Planner")}
					>
						<CalendarDays size={19} />
						Study planner
					</button>
					<button
						className={page === "Syllabus" ? "active" : ""}
						onClick={() => go("Syllabus")}
					>
						<BookMarked size={19} />
						Syllabus tracker
					</button>
				</nav>
				<div className="sidebar-bottom">
					<div className="offline-card">
						<span className="status-dot" />
						<strong>Built for your focus.</strong>
						<p>
							Your study space works offline.
							<br />
							Your progress stays with you.
						</p>
						<span>
							<WifiOff size={12} /> Offline-ready workspace
						</span>
					</div>
					<button className="settings-nav" onClick={() => go("Profile")}>
						<Settings size={19} />
						Settings & preferences
					</button>
					<button className="profile" onClick={() => go("Profile")}>
						<span className="avatar">A</span>
						<span>
							Aspirant
							<small>
								CSE {profile.year} · {profile.language}
							</small>
						</span>
						<MoreHorizontal size={18} />
					</button>
				</div>
			</aside>
			<div className="main-wrap">
				<header className="topbar">
					<div className="breadcrumb">
						<button
							className="mobile-menu icon-btn"
							onClick={() => setMenu(!menu)}
						>
							<Menu size={20} />
						</button>
						<span>My workspace</span>
						<ChevronRight size={14} />
						<b>{page}</b>
					</div>
					<div className="top-actions">
						<button
							className="search-trigger"
							onClick={() => setModal({ type: "search" })}
						>
							<Search size={15} />
							<span>Search anything…</span>
							<kbd>⌕</kbd>
						</button>
						<span className="online-label">
							<span className="status-dot" />
							{PORTABLE
								? "Offline file"
								: online
									? "Offline ready"
									: "Offline mode"}
						</span>
						<button className="lang" onClick={() => setLang(!lang)}>
							{lang ? "हिं" : "EN"}
							<span> / {lang ? "EN" : "हिं"}</span>
						</button>
						<button
							title="Revision notifications"
							className="icon-btn notification"
							onClick={() => {
								go("Revision");
								setToast(`${due.length} flashcards are ready for revision`);
							}}
						>
							<Bell size={19} />
							{due.length > 0 && <i />}
						</button>
						<button className="avatar small" onClick={() => go("Profile")}>
							A
						</button>
					</div>
				</header>
				<main>
					{PORTABLE && (
						<div className="notice portable-notice">
							<WifiOff size={17} />
							<span>
								<b>Offline file edition.</b> No server needed. Keep this file in
								the same location and use Settings → Export backup to protect
								your progress. This file is not an APK.
							</span>
						</div>
					)}
					{page === "Dashboard" && (
						<>
							{header(
								"YOUR JOURNEY. ONE DAY AT A TIME.",
								lang ? "नमस्ते, अभ्यर्थी।" : "A little better, every day.",
								lang
									? "आज का अभ्यास, कल की सफलता।"
									: "Big goals are built on small, consistent steps. Let’s make today count.",
								<div className="date-chip">
									<CalendarDays size={16} />
									{new Date().toLocaleDateString("en-GB", {
										day: "numeric",
										month: "short",
										year: "numeric",
									})}
								</div>,
							)}
							<section className="hero">
								<div className="hero-copy">
									<span className="hero-eyebrow">
										<span className="status-dot" /> YOUR ROAD TO CSE{" "}
										{profile.year}
									</span>
									<h2>One goal. A thousand small wins.</h2>
									<p>
										Learn with intention. Practice with purpose.
										<br />
										Build the confidence to become who you aspire to be.
									</p>
									<div className="hero-actions">
										<button
											className="primary"
											onClick={() =>
												openTopic(
													data.topics.find((t) => t.status === "Learning") ||
														data.topics[0],
												)
											}
										>
											Continue learning
											<ArrowRight size={16} />
										</button>
										<button
											className="text-button"
											onClick={() => go("Planner")}
										>
											View study plan
											<ArrowUpRight size={15} />
										</button>
									</div>
									<div className="hero-tags">
										<span>
											<CheckCircle2 size={13} /> Prelims + Mains + Interview
										</span>
										<i /> <span>{profile.hours} hours / day</span>
										<i />
										<span>English + हिंदी</span>
									</div>
								</div>
								<div className="hero-art" aria-hidden="true">
									<div className="orb" />
									<div className="art-stars">
										✦<span>✧</span>
									</div>
									<svg viewBox="0 0 300 190">
										<path d="M70 97 165 50 259 97 163 144Z" fill="#658571" />
										<path d="M70 97v17l93 48 96-49V97l-96 47Z" fill="#2c493a" />
										<path
											d="m77 100 86 43 88-44v9l-88 45-86-45Z"
											fill="#bbc6aa"
										/>
										<path d="M64 75 163 24 257 72 159 123Z" fill="#294b3d" />
										<path d="M64 75v17l95 48 98-50V72l-98 51Z" fill="#163326" />
										<path
											d="m72 78 87 45 89-44v9l-89 43-87-45Z"
											fill="#d0caaa"
										/>
										<path
											d="M61 60c31-15 66-13 99 6 35-28 67-28 97-17l-4 29c-35-5-64 6-93 26-32-17-64-27-99-20Z"
											fill="#d9d9b8"
										/>
										<path
											d="M160 66v38M68 64c29-10 54-5 84 11m17-5c28-19 52-23 77-18M69 72c28-8 53-2 82 12m19-6c26-17 48-21 74-20"
											fill="none"
											stroke="#a1ae8e"
											strokeWidth="2"
										/>
										<path d="M206 41 265 15l4 5-60 27Z" fill="#b8a575" />
										<path d="m206 41-9 8 12-2" fill="#ece0ba" />
									</svg>
									<span className="art-caption">
										अभ्यासात् सिद्धिः<small>EXCELLENCE THROUGH PRACTICE</small>
									</span>
								</div>
							</section>
							<div className="stats-grid">
								<Stat
									icon={Clock}
									label="Study time today"
									value={`${Math.floor(studyToday / 3600)}h ${Math.floor((studyToday % 3600) / 60)}m`}
									sub={`of your ${profile.hours}-hour daily goal`}
									progress={(studyToday / (profile.hours * 3600)) * 100}
								/>
								<Stat
									icon={Target}
									label="Questions practiced"
									value={attempts.length}
									sub={
										attempts.length
											? `${correct} correct answers`
											: "A fresh start. Make it count."
									}
								/>
								<Stat
									icon={ChartNoAxesCombined}
									label="Overall accuracy"
									value={attempts.length ? `${accuracy}%` : "—"}
									sub={
										attempts.length
											? "Across all your attempts"
											: "Your first attempt starts here"
									}
								/>
								<Stat
									icon={Flame}
									label="Current streak"
									value={`${streak} ${streak === 1 ? "day" : "days"}`}
									sub="Consistency is your superpower"
								/>
							</div>
							<div className="dashboard-columns">
								<div>
									<section className="panel plan-panel">
										<div className="section-heading">
											<h2>
												<CalendarDays size={18} />
												Your plan for today
											</h2>
											<button onClick={() => go("Planner")}>
												View planner
												<ArrowUpRight size={15} />
											</button>
										</div>
										<div className="plan-summary">
											<span>A focused day, one task at a time</span>
											<b>
												{todayTasks.filter((t) => t.done).length} /{" "}
												{todayTasks.length} completed
											</b>
										</div>
										{todayTasks.map((t) => (
											<div
												className={"task-row " + (t.done ? "done" : "")}
												key={t.id}
											>
												<button
													className="checkbox"
													aria-label="Toggle task completion"
													onClick={() => save("tasks", { ...t, done: !t.done })}
												>
													{t.done && <Check size={14} />}
												</button>
												<div>
													<strong>{t.title}</strong>
													<small>
														<span
															className={"tiny-dot " + t.subject.toLowerCase()}
														/>
														{t.subject}
														<span>·</span>
														{t.minutes} min
													</small>
												</div>
												<button
													className="task-go"
													onClick={() =>
														t.subject === "Polity"
															? openTopic(
																	data.topics.find((t) => t.id === "rights") ||
																		data.topics[0],
																)
															: t.subject === "Mixed practice"
																? startQuiz()
																: go("Revision")
													}
												>
													<ChevronRight size={18} />
												</button>
											</div>
										))}
										<button
											className="add-task"
											onClick={() => setModal({ type: "task" })}
										>
											<Plus size={16} />
											Add a study task
										</button>
									</section>
									<section className="continue-section">
										<div className="section-heading">
											<h2>Pick up where you begin</h2>
											<button onClick={() => go("Study")}>
												All subjects
												<ArrowUpRight size={15} />
											</button>
										</div>
										{cards(data.topics.slice(0, 3))}
									</section>
								</div>
								<div>
									<section className="panel revision-panel">
										<div className="section-heading">
											<h2>
												<Layers size={18} />A little revision goes a long way
											</h2>
											<span className="green-badge">{due.length} due</span>
										</div>
										<p>Turn what you’ve learned into what you know.</p>
										<div className="revision-preview">
											<div className="mini-cards">
												<span />
												<span />
												<span>
													<Layers size={23} />
												</span>
											</div>
											<div>
												<strong>{due.length} flashcards ready</strong>
												<small>
													Strengthen your recall, one card at a time.
												</small>
											</div>
										</div>
										<button
											className="secondary full"
											onClick={() => go("Revision")}
										>
											Start revision
											<ArrowRight size={16} />
										</button>
									</section>
									<section className="panel focus-panel">
										<div className="section-heading">
											<h2>
												<Clock size={18} />
												Time to focus
											</h2>
											<span className="muted small-text">POMODORO</span>
										</div>
										<div className="focus-timer">{fmt(seconds)}</div>
										<p>One thing at a time. You’ve got this.</p>
										<div className="focus-controls">
											<button
												className="primary"
												onClick={() => setFocus(!focus)}
											>
												{focus ? <Pause size={15} /> : <Play size={15} />}{" "}
												{focus ? "Pause session" : "Start focus session"}
											</button>
											<button
												className="icon-btn outlined"
												aria-label="Reset timer"
												onClick={() => {
													setFocus(false);
													setSeconds(1500);
												}}
											>
												<RotateCcw size={17} />
											</button>
										</div>
										{elapsed > 0 && (
											<button
												className="text-button"
												onClick={async () => {
													await db.sessions.add({
														date: day(),
														subject: timerSubject,
														seconds: elapsed,
													});
													setElapsed(0);
													setFocus(false);
													refresh();
													setToast("Study session saved");
												}}
											>
												Save {Math.floor(elapsed / 60)}m {elapsed % 60}s to
												study log
											</button>
										)}
									</section>
								</div>
							</div>
							<section className="bottom-band">
								<div>
									<span className="subject-icon economy">
										<Sparkles size={20} />
									</span>
									<div>
										<strong>
											Practice is where understanding becomes confidence.
										</strong>
										<p>
											{weak.length
												? `Your next focus: ${weak[0].subject} · ${weak[0].accuracy}% accuracy`
												: "Meet your daily challenge with the 15-question starter set."}
										</p>
									</div>
								</div>
								<button className="text-button" onClick={() => startQuiz()}>
									Let’s practice
									<ArrowRight size={16} />
								</button>
							</section>
							<footer>
								<span>
									LEARN <i>→</i> PRACTICE <i>→</i> ANALYZE <i>→</i> REVISE{" "}
									<i>→</i> IMPROVE
								</span>
								<span>Made for the journey, not just the exam.</span>
							</footer>
						</>
					)}
					{page === "Study" && (
						<>
							{header(
								"BUILD A STRONG FOUNDATION",
								lang ? "अध्ययन कक्ष" : "Your reading room",
								"Understand the idea. Connect the dots. Make it your own.",
								<button className="secondary" onClick={() => go("Syllabus")}>
									Syllabus tracker
									<ArrowUpRight size={16} />
								</button>,
							)}
							<section className="bottom-band curriculum-invite">
								<div>
									<span className="subject-icon">
										<Landmark size={21} />
									</span>
									<div>
										<strong>Your Polity & Economy syllabus is mapped</strong>
										<p>
											80 Polity chapters · 19 Economy entries · original core
											lessons and exact source checklists.
										</p>
									</div>
								</div>
								<button className="primary" onClick={() => go("Syllabus")}>
									Open Polity & Economy
									<ArrowRight size={16} />
								</button>
							</section>
							<div className="tabs">
								{[
									"All",
									"Prelims",
									"Mains",
									"Optional",
									"Current Affairs",
									"Interview",
								].map((x) => (
									<button
										className={filter === x ? "selected" : ""}
										onClick={() => setFilter(x)}
										key={x}
									>
										{x}
									</button>
								))}
							</div>
							{["All", "Prelims", "Mains"].includes(filter) ? (
								<>
									<div className="notice">
										<BookOpen size={18} />
										<span>
											Starter library ·{" "}
											{data.topics.filter((t) => !t.packId).length} introductory
											lessons. Expand your library with your own verified study
											material.
										</span>
									</div>
									{cards(
										data.topics.filter(
											(t) =>
												!t.packId &&
												(filter !== "Mains" ||
													t.subject === "Ethics" ||
													t.subject === "Polity"),
										),
									)}
								</>
							) : filter === "Optional" ? (
								<section className="panel roomy">
									<h2>Your optional, your space</h2>
									<p>
										Selected subject: {profile.optional}. Choose it in your
										preferences, then import notes and content for it.
									</p>
									<button className="primary" onClick={() => go("Profile")}>
										Set optional subject
									</button>
								</section>
							) : filter === "Current Affairs" ? (
								<section className="panel roomy">
									<h2>A dated current-affairs notebook</h2>
									<p>
										No live news is bundled. Add verified material with its
										publication date. New information requires internet; your
										saved notes remain offline.
									</p>
									<button
										className="primary"
										onClick={() =>
											setModal({ type: "note", noteType: "Current affairs" })
										}
									>
										<Plus size={16} />
										Add current-affairs note
									</button>
									{data.affairs.map((a) => (
										<article key={a.id}>
											<span className="badge">
												{a.source || "User-imported"} · {a.date}
											</span>
											<h3>{a.title}</h3>
											<p>{a.background}</p>
											<p>{a.whyItMatters}</p>
											<p>{a.prelimsRelevance}</p>
											<p>{a.mainsRelevance}</p>
										</article>
									))}
									{data.notes
										.filter((n) => n.type === "Current affairs")
										.map((n) => (
											<article key={n.id}>
												<h3>{n.title}</h3>
												<small>{n.date}</small>
												<p className="prewrap">{n.body}</p>
											</article>
										))}
								</section>
							) : (
								<section className="panel roomy">
									<h2>Prepare for the personality test</h2>
									<p>
										Reflect on your background, public service motivation, and
										ethical judgment. Keep sensitive DAF details out of online
										prompts.
									</p>
									{[
										"Why do you want to join the civil services?",
										"What is one development challenge in your home district?",
										"How would you handle political pressure to favour a contractor?",
									].map((q) => (
										<button
											className="list-link"
											key={q}
											onClick={() =>
												setModal({
													type: "write",
													prompt: q,
													kind: "Interview reflection",
												})
											}
										>
											{q}
											<PenLine size={17} />
										</button>
									))}
								</section>
							)}
						</>
					)}
					{page === "Practice" && (
						<>
							{header(
								"UNDERSTAND. APPLY. IMPROVE.",
								lang ? "प्रश्न अभ्यास" : "Make every attempt count",
								"A practice engine built for deliberate learning, not just scores.",
							)}
							<div className="stats-grid">
								<Stat
									icon={ClipboardList}
									label="Questions in library"
									value={data.questions.length}
									sub="Clearly marked source material"
								/>
								<Stat
									icon={Target}
									label="Attempts"
									value={attempts.length}
									sub="Every attempt is saved locally"
								/>
								<Stat
									icon={ChartNoAxesCombined}
									label="Accuracy"
									value={attempts.length ? accuracy + "%" : "—"}
									sub="Based on real attempts"
								/>
								<Stat
									icon={BookMarked}
									label="Mistake book"
									value={data.mistakes.length}
									sub="Your next learning opportunity"
								/>
							</div>
							<div className="toolbar">
								<label>
									Subject{" "}
									<select
										value={filter}
										onChange={(e) => setFilter(e.target.value)}
									>
										<option>All</option>
										{subjects.map((s) => (
											<option key={s}>{s}</option>
										))}
									</select>
								</label>
								<button className="secondary" onClick={() => go("Resources")}>
									<Upload size={16} />
									Import question pack
								</button>
							</div>
							<div className="feature-grid">
								{[
									[
										"Practice",
										"Untimed practice",
										"Learn after every question. Get the reasoning behind each answer.",
										BookOpen,
									],
									[
										"Exam",
										"Timed mock test",
										"Question palette, review flags, timer and one-third negative marking.",
										Clock,
									],
									[
										"PYQs",
										"Previous year questions",
										"Solve authentic imported PYQs. No demo questions are labeled official.",
										History,
									],
									[
										"Mistakes",
										"Previous mistakes",
										"Revisit what challenged you and close your knowledge gaps.",
										BookMarked,
									],
									[
										"Daily",
										"Daily challenge",
										"Complete the available starter set. Expand to 20, 50 or 100 through imports.",
										Flame,
									],
									[
										"Random",
										"Mixed practice",
										"Shuffle your question bank for a fresh perspective.",
										Layers,
									],
								].map(([mode, title, desc, I]) => (
									<button
										className="panel feature-card"
										key={mode}
										onClick={() =>
											mode === "Random"
												? setModal({
														type: "quiz",
														mode: "Practice",
														questions: [
															...data.questions.filter(
																(q) => filter === "All" || q.subject === filter,
															),
														].sort(() => Math.random() - 0.5),
													})
												: startQuiz(mode, filter, mode === "Mistakes")
										}
									>
										<I size={26} />
										<h2>{title}</h2>
										<p>{desc}</p>
										<span>
											Begin session
											<ArrowRight size={16} />
										</span>
									</button>
								))}
							</div>
							{data.tests.length > 0 && (
								<section className="panel roomy">
									<h2>Mock test history</h2>
									{data.tests.map((t) => (
										<div className="list-link" key={t.id}>
											<span>
												{t.date} · {t.total} questions · {fmt(t.time)} spent
											</span>
											<b>
												{t.score.toFixed(2)} marks · {t.correct} correct /{" "}
												{t.wrong} wrong
											</b>
										</div>
									))}
								</section>
							)}
						</>
					)}
					{page === "Revision" && (
						<>
							{header(
								"REMEMBER WHAT MATTERS",
								lang ? "पुनरावृत्ति" : "Small reviews. Lasting knowledge.",
								"Spaced repetition turns familiarity into confident recall.",
								<button
									className="secondary"
									onClick={() => setModal({ type: "card" })}
								>
									<Plus size={16} />
									Create flashcard
								</button>,
							)}
							<div className="tabs">
								{["All", "Flashcards", "Mistake Book", "Bookmarks"].map((x) => (
									<button
										className={filter === x ? "selected" : ""}
										key={x}
										onClick={() => setFilter(x)}
									>
										{x}
									</button>
								))}
							</div>
							{filter === "Mistake Book" ? (
								<section className="panel roomy">
									<h2>Understand the mistake, not just the answer.</h2>
									{!data.mistakes.length && (
										<p>
											Your incorrect answers will appear here automatically.
											Start a practice session to build your learning history.
										</p>
									)}
									{data.mistakes.map((m) => {
										const q = data.questions.find((q) => q.id === m.questionId);
										return (
											q && (
												<article className="mistake-item" key={m.questionId}>
													<h3>{q.text}</h3>
													<p>{q.explanation}</p>
													<label>
														Why did you miss it?{" "}
														<select
															value={m.reason || "Not recorded"}
															onChange={(e) =>
																save("mistakes", {
																	...m,
																	reason: e.target.value,
																})
															}
														>
															{[
																"Not recorded",
																"Didn’t know",
																"Concept confusion",
																"Misread",
																"Silly mistake",
																"Guessing",
																"Lack of revision",
																"Current-affairs gap",
															].map((r) => (
																<option key={r}>{r}</option>
															))}
														</select>
													</label>
												</article>
											)
										);
									})}
									<button
										className="primary"
										onClick={() => startQuiz("Practice", "All", true)}
									>
										Retest mistakes
										<ArrowRight size={16} />
									</button>
								</section>
							) : filter === "Bookmarks" ? (
								<section className="panel roomy">
									<h2>Must Revise</h2>
									{!data.bookmarks.length && (
										<p>Bookmark lessons and questions to find them here.</p>
									)}
									{data.bookmarks.map((b) => {
										const t = data.topics.find((t) => t.id === b.id),
											q = data.questions.find((q) => q.id === b.id);
										return (
											<button
												className="list-link"
												key={b.id}
												onClick={() =>
													t
														? openTopic(t)
														: q &&
															setModal({
																type: "quiz",
																mode: "Practice",
																questions: [q],
															})
												}
											>
												{t?.title || q?.text || b.id}
												<ChevronRight size={16} />
											</button>
										);
									})}
								</section>
							) : (
								<>
									<section className="revision-banner panel">
										<div>
											<span className="eyebrow">YOUR REVISION QUEUE</span>
											<h2>{due.length} cards ready for a fresh look.</h2>
											<p>
												Review intervals: same day → 1 → 3 → 7 → 14 → 30 → 60 →
												90 days.
											</p>
										</div>
										<button
											className="primary"
											disabled={!due.length}
											onClick={() => setModal({ type: "review", cards: due })}
										>
											Review due cards
											<ArrowRight size={17} />
										</button>
									</section>
									<div className="topic-grid">
										{data.cards.slice(0, revisionLimit).map((c) => (
											<button
												className="topic-card"
												key={c.id}
												onClick={() => setModal({ type: "review", cards: [c] })}
											>
												<Layers size={23} />
												<h3>{c.front}</h3>
												<p>
													{c.due <= Date.now()
														? "Ready to review"
														: `Due ${new Date(c.due).toLocaleDateString()}`}
												</p>
												<div className="topic-foot">
													<span>Review level {c.step}</span>
													<ArrowUpRight size={16} />
												</div>
											</button>
										))}
									</div>
									{data.cards.length > revisionLimit && (
										<button
											className="secondary"
											onClick={() => setRevisionLimit((n) => n + 24)}
										>
											Show 24 more flashcards (
											{data.cards.length - revisionLimit} remaining)
										</button>
									)}
								</>
							)}
						</>
					)}
					{page === "Writing" && (
						<>
							{header(
								"THINK CLEARLY. WRITE WITH PURPOSE.",
								lang ? "उत्तर लेखन" : "Your answer-writing desk",
								"Build structure, depth and a voice of your own.",
								<button
									className="primary"
									onClick={() =>
										setModal({ type: "write", kind: "Mains answer" })
									}
								>
									<Plus size={16} />
									New answer
								</button>,
							)}
							<div className="feature-grid">
								<section className="panel roomy">
									<PenLine size={27} />
									<h2>Mains answer practice</h2>
									<p>
										“Constitutional morality is a guiding principle for public
										institutions.” Discuss. (150 words)
									</p>
									<span className="badge">ORIGINAL PRACTICE PROMPT</span>
									<br />
									<button
										className="secondary"
										onClick={() =>
											setModal({
												type: "write",
												kind: "Mains answer",
												prompt:
													"“Constitutional morality is a guiding principle for public institutions.” Discuss. (150 words)",
											})
										}
									>
										Start writing
										<ArrowRight size={16} />
									</button>
								</section>
								<section className="panel roomy">
									<FileText size={27} />
									<h2>The essay studio</h2>
									<p>
										Education is not only preparation for life, but life itself.
									</p>
									<span className="badge">ORIGINAL PRACTICE PROMPT</span>
									<br />
									<button
										className="secondary"
										onClick={() =>
											setModal({
												type: "write",
												kind: "Essay",
												prompt:
													"Education is not only preparation for life, but life itself.",
											})
										}
									>
										Explore the essay
										<ArrowRight size={16} />
									</button>
								</section>
							</div>
							<section className="panel roomy">
								<h2>Your drafts · {data.writing.length}</h2>
								{!data.writing.length && (
									<p>
										Your saved answers and essays will appear here. Writing is
										stored offline; online AI feedback is not official UPSC
										evaluation.
									</p>
								)}
								{data.writing.map((w) => (
									<button
										className="list-link"
										key={w.id}
										onClick={() =>
											setModal({ type: "write", ...w, writingId: w.id })
										}
									>
										<span>
											{w.prompt || "Untitled answer"}
											<small>
												{w.kind} · {w.date} ·{" "}
												{w.text.trim().split(/\s+/).filter(Boolean).length}{" "}
												words
											</small>
										</span>
										<PenLine size={18} />
									</button>
								))}
							</section>
						</>
					)}
					{page === "Resources" && (
						<>
							{header(
								"A LIBRARY THAT GROWS WITH YOU",
								lang ? "आपकी अध्ययन सामग्री" : "Everything, in one place.",
								"Your notes, documents and question packs. Always within reach.",
								<button
									className="primary"
									onClick={() => setModal({ type: "note" })}
								>
									<Plus size={16} />
									Create note
								</button>,
							)}
							<div className="toolbar">
								<div className="tabs">
									{["All", "Notes", "Files", "Import"].map((x) => (
										<button
											className={filter === x ? "selected" : ""}
											key={x}
											onClick={() => setFilter(x)}
										>
											{x}
										</button>
									))}
								</div>
								<div className="search-inline">
									<Search size={16} />
									<input
										placeholder="Search your library"
										value={search}
										onChange={(e) => setSearch(e.target.value)}
									/>
								</div>
							</div>
							{filter === "Import" ? (
								<Importer refresh={refresh} notify={setToast} />
							) : (
								<>
									<label className="import-area">
										<Upload size={26} />
										<strong>Bring your study material with you</strong>
										<span>
											PDF, image, TXT or Markdown · saved on this device for
											offline use
										</span>
										<input
											type="file"
											accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.md"
											hidden
											multiple
											onChange={async (e) => {
												for (const f of e.target.files) {
													await db.resources.add({
														title: f.name,
														type: f.type,
														date: day(),
														blob: f,
														size: f.size,
													});
													if (/\.(txt|md)$/i.test(f.name))
														await db.notes.add({
															title: f.name,
															body: await f.text(),
															type: "Imported",
															date: day(),
														});
												}
												refresh();
												setToast(
													"Files saved offline. Scanned PDF OCR is not bundled.",
												);
											}}
										/>
									</label>
									<div className="topic-grid">
										{filter !== "Files" &&
											data.notes
												.filter((n) =>
													(n.title + " " + n.body)
														.toLowerCase()
														.includes(search.toLowerCase()),
												)
												.map((n) => (
													<button
														className="topic-card"
														key={"n" + n.id}
														onClick={() => setModal({ type: "note", note: n })}
													>
														<FileText size={23} />
														<small>
															{n.type} · {n.date}
														</small>
														<h3>{n.title}</h3>
														<p>{n.body.slice(0, 120)}</p>
													</button>
												))}
										{filter !== "Notes" &&
											data.resources
												.filter((r) =>
													r.title.toLowerCase().includes(search.toLowerCase()),
												)
												.map((r) => (
													<div className="topic-card" key={"r" + r.id}>
														<FolderOpen size={23} />
														<h3>{r.title}</h3>
														<p>
															{(r.size / 1024).toFixed(1)} KB · {r.date}
														</p>
														<button
															className="secondary"
															onClick={() => {
																const url = URL.createObjectURL(r.blob);
																window.open(url, "_blank");
																setTimeout(
																	() => URL.revokeObjectURL(url),
																	60000,
																);
															}}
														>
															Open offline file
															<ArrowUpRight size={15} />
														</button>
													</div>
												))}
									</div>
									{!data.notes.length && !data.resources.length && (
										<div className="empty-note">
											Your personal library starts here. Add a note or import
											your first document.
										</div>
									)}
									<section className="panel roomy">
										<h2>Quick reference · Constitution</h2>
										<p>
											Starter reference only. Source: Constitution of India,
											Legislative Department.
										</p>
										{[
											[
												"Article 14",
												"Equality before law and equal protection of the laws.",
											],
											[
												"Article 19",
												"Protection of specified freedoms, subject to reasonable restrictions.",
											],
											[
												"Article 21",
												"Protection of life and personal liberty.",
											],
											[
												"Article 32",
												"Remedies for enforcement of Fundamental Rights.",
											],
											["Article 79", "Constitution of Parliament."],
										]
											.filter((r) =>
												r
													.join(" ")
													.toLowerCase()
													.includes(search.toLowerCase()),
											)
											.map(([a, b]) => (
												<div className="list-link" key={a}>
													<b>{a}</b>
													<span>{b}</span>
												</div>
											))}
										<a
											href="https://legislative.gov.in/constitution-of-india/"
											target="_blank"
											rel="noreferrer"
										>
											Read the official Constitution ↗ (internet required)
										</a>
									</section>
								</>
							)}
						</>
					)}
					{page === "Analytics" && (
						<>
							{header(
								"REFLECT. ADJUST. MOVE FORWARD.",
								lang ? "प्रगति विश्लेषण" : "Your effort, made visible.",
								"Real activity only. No invented scores, streaks or progress.",
							)}
							<div className="stats-grid">
								<Stat
									icon={Clock}
									label="Total study time"
									value={`${(data.sessions.reduce((a, s) => a + s.seconds, 0) / 3600).toFixed(1)}h`}
									sub={`${data.sessions.length} saved sessions`}
								/>
								<Stat
									icon={Target}
									label="Overall accuracy"
									value={attempts.length ? accuracy + "%" : "—"}
									sub={`${attempts.length} attempts · ${correct} correct`}
								/>
								<Stat
									icon={BookOpen}
									label="Loaded lesson progress"
									value={`${Math.round((complete / data.topics.length) * 100)}%`}
									sub={`${complete} / ${data.topics.length} loaded topics complete`}
								/>
								<Stat
									icon={PenLine}
									label="Writing practice"
									value={data.writing.length}
									sub={`${data.writing.filter((w) => w.kind === "Essay").length} essays saved`}
								/>
							</div>
							<div className="two-col">
								<section className="panel roomy">
									<h2>Subject performance</h2>
									{subjects.map((s) => {
										const a = weak.find((x) => x.subject === s);
										return (
											<div className="performance-row" key={s}>
												<div>
													<span>{s}</span>
													<b>{a ? a.accuracy + "%" : "No attempts"}</b>
												</div>
												<div className="progress-track">
													<i style={{ width: (a?.accuracy || 0) + "%" }} />
												</div>
											</div>
										);
									})}
								</section>
								<section className="panel roomy">
									<h2>Your next best step</h2>
									{weak.length ? (
										<>
											<p>
												Start with <b>{weak[0].subject}</b>, your
												lowest-accuracy practiced subject. This is based on{" "}
												{weak[0].count} attempts, not a prediction of future
												exams.
											</p>
											<button
												className="primary"
												onClick={() => startQuiz("Practice", weak[0].subject)}
											>
												Practice {weak[0].subject}
												<ArrowRight size={16} />
											</button>
										</>
									) : (
										<p>
											Complete a practice session to uncover your strengths and
											learning opportunities.
										</p>
									)}
									<hr />
									<h3>Learning activity</h3>
									<p>
										{data.cards.filter((c) => c.step > 0).length} flashcards
										advanced
										<br />
										{data.tests.length} mock tests submitted
										<br />
										{
											attempts.filter(
												(a) =>
													data.questions.find((q) => q.id === a.questionId)
														?.kind === "PYQ",
											).length
										}{" "}
										PYQ attempts
										<br />
										{
											data.notes.filter((n) => n.type === "Current affairs")
												.length
										}{" "}
										current-affairs notes
									</p>
									<h3>PYQ historical patterns</h3>
									<p>
										{data.questions.filter((q) => q.kind === "PYQ").length}{" "}
										authentic imported PYQs available. Historical frequency is
										not a prediction of future questions.
									</p>
								</section>
							</div>
						</>
					)}
					{page === "Planner" && (
						<>
							{header(
								"GIVE YOUR GOAL A PLAN",
								lang
									? "अध्ययन योजना"
									: "A little structure. A lot of progress.",
								"Plan around your 8-hour target. Make room for learning, practice and rest.",
								<button
									className="primary"
									onClick={() => setModal({ type: "task" })}
								>
									<Plus size={16} />
									Add task
								</button>,
							)}
							<section className="panel roomy">
								<h2>Your study schedule</h2>
								<p>
									Manually reschedule any task below. Dates are local to your
									device.
								</p>
								{[...data.tasks]
									.sort((a, b) => a.date.localeCompare(b.date))
									.map((t) => (
										<div className="task-row" key={t.id}>
											<button
												className="checkbox"
												onClick={() => save("tasks", { ...t, done: !t.done })}
											>
												{t.done && <Check size={14} />}
											</button>
											<div>
												<strong>{t.title}</strong>
												<small>
													{t.subject} · {t.minutes} minutes
												</small>
											</div>
											<input
												aria-label="Task date"
												type="date"
												value={t.date}
												onChange={(e) =>
													save("tasks", { ...t, date: e.target.value })
												}
											/>
											<button
												className="icon-btn"
												title="Delete task"
												onClick={async () => {
													await db.tasks.delete(t.id);
													refresh();
												}}
											>
												<Trash2 size={16} />
											</button>
										</div>
									))}
							</section>
							<section className="panel roomy">
								<h2>Focus session</h2>
								<label>
									Track subject{" "}
									<select
										value={timerSubject}
										onChange={(e) => setTimerSubject(e.target.value)}
									>
										{subjects.map((s) => (
											<option key={s}>{s}</option>
										))}
									</select>
								</label>
								<div className="focus-timer">{fmt(seconds)}</div>
								<div className="button-row">
									<button className="primary" onClick={() => setFocus(!focus)}>
										{focus ? "Pause" : "Start"} timer
									</button>
									<button
										className="secondary"
										onClick={async () => {
											if (!elapsed) return setToast("Start a session first");
											await db.sessions.add({
												date: day(),
												subject: timerSubject,
												seconds: elapsed,
											});
											setElapsed(0);
											setFocus(false);
											refresh();
											setToast("Study time saved");
										}}
									>
										Save study time
									</button>
								</div>
							</section>
						</>
					)}
					{page === "Syllabus" && (
						<>
							{header(
								"YOUR MATERIAL. YOUR LEARNING MAP.",
								"Polity & Economy syllabus",
								"An exact source map, original core lessons, and honest coverage tracking.",
							)}
							<Curriculum
								data={data}
								save={save}
								onOpen={openTopic}
								onNote={linkedNote}
							/>
							<details className="panel roomy">
								<summary>
									Other UPSC stages · broad preparation framework
								</summary>
								<p>This organizer is not a verbatim official UPSC syllabus.</p>
								{Object.entries(syllabus).map(([stage, items]) => (
									<section key={stage}>
										<h2>{stage}</h2>
										<ul>
											{items.map((i) => (
												<li key={i}>{i}</li>
											))}
										</ul>
									</section>
								))}
								<a
									href="https://upsc.gov.in/examinations"
									target="_blank"
									rel="noreferrer"
								>
									Check official examination notices ↗
								</a>
							</details>
						</>
					)}
					{page === "Profile" && (
						<>
							{header(
								"MAKE THIS SPACE YOUR OWN",
								"Your preparation preferences",
								"One aspirant. One goal. Your data stays on your device.",
							)}
							<div className="two-col">
								<section className="panel roomy form">
									<h2>Preparation profile</h2>
									<label>
										Target year
										<input
											type="number"
											value={profile.year}
											onChange={(e) =>
												save("settings", {
													...profile,
													year: Number(e.target.value),
												})
											}
										/>
									</label>
									<label>
										Daily study hours
										<input
											type="number"
											min="1"
											max="16"
											value={profile.hours}
											onChange={(e) =>
												save("settings", {
													...profile,
													hours: Number(e.target.value),
												})
											}
										/>
									</label>
									<label>
										Optional subject
										<input
											placeholder="e.g. Sociology"
											value={
												profile.optional === "Not selected"
													? ""
													: profile.optional
											}
											onChange={(e) =>
												save("settings", {
													...profile,
													optional: e.target.value,
												})
											}
										/>
									</label>
									<label>
										Appearance
										<select
											value={profile.theme}
											onChange={(e) =>
												save("settings", { ...profile, theme: e.target.value })
											}
										>
											<option value="dark">Academic dark</option>
											<option value="light">Paper light</option>
											<option value="amoled">AMOLED black</option>
										</select>
									</label>
									<p>
										English interface with bilingual starter explanations and
										key facts. Quiz questions are currently in English;
										bilingual imports are supported as text.
									</p>
								</section>
								<section className="panel roomy">
									<h2>Install & keep your work safe</h2>
									<p>
										{PORTABLE
											? "This is the standalone HTML edition. Reopen your downloaded file in the same browser. Local-file storage depends on the browser; make regular backups. Home-screen PWA installation requires the hosted HTTPS edition."
											: "Install on your home screen for an app-like experience. This is a PWA, not a native APK."}
									</p>
									<button
										className="primary"
										onClick={async () => {
											if (PORTABLE) {
												setToast(
													"Keep Abhyas-Offline.html in Downloads and open it in your browser. No installation or server is required.",
												);
												return;
											}
											if (install) {
												await install.prompt();
												setInstall(null);
											} else
												setToast(
													"Use your browser menu → Install app / Add to Home Screen. Requires HTTPS or localhost.",
												);
										}}
									>
										<Download size={16} />
										{PORTABLE ? "How to reopen this file" : "Install Abhyas"}
									</button>
									<hr />
									<h3>Backup & restore</h3>
									<p>
										Export includes your progress, notes, question banks and
										imported files. Store a backup outside your device.
									</p>
									<div className="button-row">
										<button
											className="secondary"
											onClick={async () => {
												const backup = {
													format: "abhyas",
													version: 1,
													data: {},
												};
												for (const t of db.tables) {
													backup.data[t.name] = await t.toArray();
													if (t.name === "resources")
														for (const r of backup.data.resources) {
															r.base64 = await new Promise((resolve) => {
																const reader = new FileReader();
																reader.onload = () => resolve(reader.result);
																reader.readAsDataURL(r.blob);
															});
															delete r.blob;
														}
												}
												download(backup, `abhyas-backup-${day()}.json`);
												setToast("Backup exported");
											}}
										>
											<Download size={16} />
											Export backup
										</button>
										<label className="secondary">
											<Upload size={16} />
											Restore
											<input
												type="file"
												accept=".json"
												hidden
												onChange={async (e) => {
													try {
														const b = JSON.parse(
															await e.target.files[0].text(),
														);
														if (
															b.format !== "abhyas" ||
															b.version !== 1 ||
															!b.data ||
															db.tables.some(
																(t) => !Array.isArray(b.data[t.name]),
															)
														)
															throw Error("Invalid backup format");
														if (
															!confirm(
																"Replace all local data with this backup?",
															)
														)
															return;
														for (const r of b.data.resources) {
															if (
																typeof r.base64 !== "string" ||
																!r.base64.startsWith("data:")
															)
																throw Error("Invalid embedded resource");
															r.blob = await (await fetch(r.base64)).blob();
															delete r.base64;
														}
														await db.transaction("rw", db.tables, async () => {
															for (const t of db.tables) {
																await t.clear();
																await t.bulkPut(b.data[t.name]);
															}
														});
														refresh();
														await installCurriculum(db);
														await refresh();
														setToast("Backup restored");
													} catch (err) {
														setToast("Restore failed: " + err.message);
													}
												}}
											/>
										</label>
									</div>
									<hr />
									<button
										className="text-button"
										onClick={async () => {
											const granted = await navigator.storage?.persist?.();
											setToast(
												granted
													? "Persistent storage enabled"
													: "Browser manages storage. Keep regular external backups.",
											);
										}}
									>
										Request persistent device storage
										<ArrowRight size={16} />
									</button>
								</section>
							</div>
							<AISettings profile={profile} save={save} />
						</>
					)}
				</main>
			</div>
			<nav className="bottom-nav">
				{[
					["Dashboard", "Home", LayoutDashboard],
					["Study", "Study", BookOpen],
					["Practice", "Practice", ClipboardList],
					["Revision", "Revision", Layers],
					["Profile", "Profile", Settings],
				].map(([p, l, I]) => (
					<button
						key={p}
						onClick={() => go(p)}
						className={page === p ? "active" : ""}
					>
						<I size={20} />
						<span>{l}</span>
					</button>
				))}
			</nav>
			<button className="tutor-fab" onClick={() => setModal({ type: "ai" })}>
				<Sparkles size={18} />
				<span>Ask your tutor</span>
			</button>
			{toast && (
				<div role="status" className="toast">
					<CheckCircle2 size={18} />
					{toast}
				</div>
			)}
			{modal && (
				<div
					className="modal-backdrop"
					onMouseDown={(e) =>
						e.target === e.currentTarget &&
						modal.type !== "quiz" &&
						setModal(null)
					}
				>
					<div
						role="dialog"
						aria-modal="true"
						aria-label="Study workspace"
						className={
							"modal " +
							(["topic", "quiz", "write"].includes(modal.type) ? "wide" : "")
						}
					>
						<button
							className="modal-close icon-btn"
							aria-label="Close dialog"
							onClick={() => {
								if (
									modal.type !== "quiz" ||
									confirm("Leave this session? Submitted answers remain saved.")
								)
									setModal(null);
							}}
						>
							<X size={22} />
						</button>
						{modal.type === "topic" && (
							<Topic
								key={modal.topic.id}
								data={data}
								onNote={linkedNote}
								onRelated={openTopic}
								topic={data.topics.find((t) => t.id === modal.topic.id)}
								save={save}
								bookmark={bookmark}
								bookmarked={data.bookmarks.some((b) => b.id === modal.topic.id)}
								practice={() =>
									setModal({
										type: "quiz",
										mode: "Practice",
										questions: data.questions.filter(
											(q) => q.topic === modal.topic.id,
										),
									})
								}
								revise={() => {
									const cs = data.cards.filter(
										(c) => c.topic === modal.topic.id,
									);
									cs.length
										? setModal({ type: "review", cards: cs })
										: setToast(
												"No flashcards for this topic yet. Create one in Revision.",
											);
								}}
								write={() =>
									setModal({
										type: "write",
										kind: "Mains answer",
										prompt:
											modal.topic.mains ||
											`Discuss the importance of ${modal.topic.title} with suitable examples. (150 words)`,
									})
								}
							/>
						)}
						{modal.type === "quiz" && (
							<Quiz
								{...modal}
								refresh={refresh}
								bookmark={bookmark}
								close={() => setModal(null)}
							/>
						)}
						{modal.type === "review" && (
							<Review
								cards={modal.cards}
								refresh={refresh}
								close={() => setModal(null)}
							/>
						)}
						{modal.type === "task" && (
							<TaskForm
								subjects={subjects}
								done={async (task) => {
									await db.tasks.add(task);
									refresh();
									setModal(null);
									setToast("Study task added");
								}}
							/>
						)}
						{modal.type === "note" && (
							<NoteForm
								note={modal.note}
								noteType={modal.noteType}
								done={async (n) => {
									await db.notes.put(n);
									refresh();
									setModal(null);
									setToast("Note saved offline");
								}}
							/>
						)}
						{modal.type === "card" && (
							<CardForm
								done={async (c) => {
									await db.cards.put(c);
									refresh();
									setModal(null);
									setToast("Flashcard added to revision queue");
								}}
							/>
						)}
						{modal.type === "write" && (
							<Writing
								{...modal}
								done={async (w) => {
									await db.writing.put(w);
									refresh();
									setToast("Draft saved offline");
								}}
							/>
						)}
						{modal.type === "search" && (
							<GlobalSearch
								data={data}
								open={openTopic}
								quiz={(q) =>
									setModal({ type: "quiz", mode: "Practice", questions: [q] })
								}
								note={(n) => setModal({ type: "note", note: n })}
							/>
						)}
						{modal.type === "ai" && (
							<AITutor
								profile={profile}
								online={online}
								settings={() => {
									setModal(null);
									go("Profile");
								}}
							/>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
function Stat({ icon: I, label, value, sub, progress }) {
	return (
		<section className="stat">
			<div className="stat-label">
				<span>{label}</span>
				<I size={18} />
			</div>
			<strong>{value}</strong>
			<p>{sub}</p>
			{progress !== undefined && (
				<div className="progress-track">
					<i style={{ width: Math.min(progress, 100) + "%" }} />
				</div>
			)}
		</section>
	);
}
function Topic({
	data,
	onNote,
	onRelated,
	topic: t,
	save,
	bookmark,
	bookmarked,
	practice,
	revise,
	write,
}) {
	const hi = lessonHindi[t.id];
	const [level, setLevel] = useState("Exam-ready");
	if (t.packId)
		return (
			<div className="topic-detail">
				<span className="eyebrow">
					{t.subject} · CHAPTER {t.number} · {t.section}
				</span>
				<h1>{t.title}</h1>
				<h3 className="hindi">{t.hindi}</h3>
				<div className="button-row">
					<span className="badge">ORIGINAL CORE LESSON</span>
					<button
						className="icon-btn"
						title="Bookmark lesson"
						onClick={() => bookmark(t.id, "topic")}
					>
						<Bookmark size={20} fill={bookmarked ? "currentColor" : "none"} />
					</button>
					<select
						aria-label="Chapter learning status"
						value={t.status}
						onChange={(e) => save("topics", { ...t, status: e.target.value })}
					>
						{[
							"Not started",
							"Learning",
							"Completed",
							"Revised",
							"Mastered",
						].map((x) => (
							<option key={x}>{x}</option>
						))}
					</select>
				</div>
				<ExpandedLesson
					topic={t}
					data={data}
					save={save}
					onNote={onNote}
					onRelated={onRelated}
				/>
				<h2>Practice → Revise → Write</h2>
				<div className="button-row">
					<button className="primary" onClick={practice}>
						Practice topic MCQs
						<ArrowRight size={16} />
					</button>
					<button className="secondary" onClick={revise}>
						Recall with flashcards
					</button>
					<button className="secondary" onClick={write}>
						Write an answer
					</button>
				</div>
				<p className="source-note">{t.source}</p>
			</div>
		);

	return (
		<div className="topic-detail">
			<span className="eyebrow">{t.subject} / STARTER LESSON</span>
			<h1>{t.title}</h1>
			<h3 className="hindi">{t.hindi}</h3>
			<div className="button-row">
				<span className="badge">DEMO CONTENT</span>
				<button
					className="icon-btn"
					title="Bookmark lesson"
					onClick={() => bookmark(t.id, "topic")}
				>
					<Bookmark size={20} fill={bookmarked ? "currentColor" : "none"} />
				</button>
				<select
					value={t.status}
					onChange={(e) => save("topics", { ...t, status: e.target.value })}
				>
					{["Not started", "Learning", "Completed", "Revised", "Mastered"].map(
						(x) => (
							<option key={x}>{x}</option>
						),
					)}
				</select>
			</div>
			<div className="tabs">
				{["Beginner", "Exam-ready", "Advanced", "Mains-ready"].map((l) => (
					<button
						key={l}
						className={level === l ? "selected" : ""}
						onClick={() => setLevel(l)}
					>
						{l}
					</button>
				))}
			</div>
			<h2>{level === "Beginner" ? "The simple idea" : "Introduction"}</h2>
			<p className="reading-text">{t.intro}</p>
			{hi && (
				<p className="hindi-reading" lang="hi">
					{hi.intro}
				</p>
			)}
			{level !== "Beginner" && (
				<>
					<h2>Key facts & prelims points</h2>
					<ul className="reading-text">
						{t.facts.map((f, i) => (
							<li key={f}>
								{f}
								{hi?.facts[i] && (
									<span className="hindi-reading" lang="hi">
										{hi.facts[i]}
									</span>
								)}
							</li>
						))}
					</ul>
				</>
			)}
			{["Advanced", "Mains-ready"].includes(level) && (
				<>
					<h2>Think beyond recall</h2>
					<p className="reading-text">
						Explain the underlying principle, identify its limitations, and
						connect it to a real public-policy situation. Distinguish an
						established fact from your interpretation.
					</p>
					<h2>Mains-ready framework</h2>
					<p className="reading-text">
						Define {t.title.toLowerCase()} in your introduction. Organize the
						body around its significance, practical challenges and possible
						improvements. Use a verified example, then conclude with a balanced
						way forward.
					</p>
					<p className="notice">
						This starter lesson is introductory, not a complete advanced
						chapter. Import your detailed notes to deepen coverage.
					</p>
				</>
			)}
			<h2>One-page revision</h2>
			<div className="revision-sheet">
				<b>
					{t.title} · {t.hindi}
				</b>
				{t.facts.map((f, i) => (
					<p key={f}>
						{i + 1}. {f}
					</p>
				))}
			</div>
			<h2>Put understanding into practice</h2>
			<div className="button-row">
				<button className="primary" onClick={practice}>
					Practice topic MCQs
					<ArrowRight size={16} />
				</button>
				<button className="secondary" onClick={revise}>
					Recall with flashcards
				</button>
				<button className="secondary" onClick={write}>
					Write an answer
				</button>
			</div>
			<p className="source-note">
				{t.source}. Original learning summary; verify against primary material.
				Official PYQs and dated current relevance can be added through imports.
			</p>
		</div>
	);
}
function Quiz({ questions: qs, mode, refresh, bookmark, close }) {
	const [idx, setIdx] = useState(0),
		[answers, setAnswers] = useState({}),
		[checked, setChecked] = useState({}),
		[flagged, setFlagged] = useState([]),
		[result, setResult] = useState(null),
		[remaining, setRemaining] = useState(qs.length * 72),
		[negative, setNegative] = useState(1 / 3);
	const start = useRef(Date.now()),
		lock = useRef(false);
	const exam = mode === "Exam",
		q = qs[idx];
	useEffect(() => {
		if (!exam || result) return;
		const t = setInterval(
			() =>
				setRemaining(
					Math.max(
						0,
						qs.length * 72 - Math.floor((Date.now() - start.current) / 1000),
					),
				),
			1000,
		);
		return () => clearInterval(t);
	}, [exam, result]);
	useEffect(() => {
		if (exam && remaining === 0 && !result) submit();
	}, [remaining]);
	const record = async (question, answer) => {
		await db.attempts.add({
			questionId: question.id,
			subject: question.subject,
			topic: question.topic,
			date: day(),
			correct: answer === question.answer,
			answer,
		});
		if (answer !== question.answer)
			await db.mistakes.put({
				questionId: question.id,
				reason: "Not recorded",
			});
	};
	const check = async () => {
		if (answers[q.id] === undefined || checked[q.id]) return;
		setChecked((c) => ({ ...c, [q.id]: true }));
		await record(q, answers[q.id]);
		refresh();
	};
	async function submit() {
		if (lock.current) return;
		lock.current = true;
		let c = 0,
			w = 0;
		for (const question of qs) {
			if (answers[question.id] !== undefined) {
				answers[question.id] === question.answer ? c++ : w++;
				if (exam || !checked[question.id])
					await record(question, answers[question.id]);
			}
		}
		const r = {
			date: day(),
			total: qs.length,
			correct: c,
			wrong: w,
			unattempted: qs.length - c - w,
			score: c * 2 - w * 2 * negative,
			time: Math.floor((Date.now() - start.current) / 1000),
			negativeMarks: w * 2 * negative,
		};
		if (exam) await db.tests.add(r);
		setResult(r);
		refresh();
	}
	if (!qs.length)
		return (
			<div className="roomy">
				<h2>No questions available</h2>
				<p>
					This chapter’s question expansion is pending. Use its core lesson,
					flashcard and Mains prompt, or import a verified question pack.
				</p>
			</div>
		);
	if (result)
		return (
			<div>
				<span className="eyebrow">SESSION COMPLETE</span>
				<h1>A step forward.</h1>
				<div className="stats-grid compact">
					<Stat icon={Target} label="Correct" value={result.correct} />
					<Stat icon={X} label="Incorrect" value={result.wrong} />
					<Stat icon={Clock} label="Unattempted" value={result.unattempted} />
					<Stat
						icon={ChartNoAxesCombined}
						label="Score / maximum"
						value={`${result.score.toFixed(2)} / ${qs.length * 2}`}
					/>
				</div>
				<p>
					Accuracy:{" "}
					{result.correct + result.wrong
						? Math.round(
								(result.correct / (result.correct + result.wrong)) * 100,
							)
						: 0}
					% · Negative marks: {result.negativeMarks.toFixed(2)} · Time:{" "}
					{fmt(result.time)}
				</p>
				<h2>Subject analysis</h2>
				{[...new Set(qs.map((q) => q.subject))].map((s) => {
					const arr = qs.filter((q) => q.subject === s);
					return (
						<p key={s}>
							{s}: {arr.filter((q) => answers[q.id] === q.answer).length} /{" "}
							{arr.length} correct
						</p>
					);
				})}
				<h2>Review your reasoning</h2>
				{qs.map((question) => (
					<article className="answer-review" key={question.id}>
						<span
							className={
								answers[question.id] === question.answer
									? "green-badge"
									: "badge"
							}
						>
							{answers[question.id] === undefined
								? "Unattempted"
								: answers[question.id] === question.answer
									? "Correct"
									: "Review this"}
						</span>
						<h3>{question.text}</h3>
						<p>
							<b>Answer: {question.options[question.answer]}</b>
						</p>
						<p>{question.explanation}</p>
					</article>
				))}
				<button className="primary" onClick={close}>
					Back to your workspace
				</button>
			</div>
		);
	return (
		<div className="quiz">
			<div className="eyebrow">
				{mode.toUpperCase()} · {q.subject.toUpperCase()}
			</div>
			<h2>{exam ? "Your mock test" : "A question worth thinking about."}</h2>
			<div className="quiz-meta">
				<span>
					Question {idx + 1} of {qs.length}
				</span>
				{exam ? (
					<b>
						<Clock size={16} /> {fmt(remaining)}
					</b>
				) : (
					<span className="badge">{q.difficulty}</span>
				)}
			</div>
			<div className="progress-track">
				<i style={{ width: ((idx + 1) / qs.length) * 100 + "%" }} />
			</div>
			<h2 className="question-text">{q.text}</h2>
			<div className="options">
				{q.options.map((o, i) => (
					<button
						key={i}
						disabled={!!checked[q.id]}
						className={
							(answers[q.id] === i ? "chosen " : "") +
							(checked[q.id]
								? i === q.answer
									? "correct"
									: answers[q.id] === i
										? "wrong"
										: ""
								: "")
						}
						onClick={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
					>
						<span>{String.fromCharCode(65 + i)}</span>
						{o}
						{checked[q.id] && i === q.answer && <CheckCircle2 size={19} />}
					</button>
				))}
			</div>
			{checked[q.id] && (
				<div className="explanation">
					<h3>
						{answers[q.id] === q.answer
							? "Well reasoned."
							: "A chance to learn."}
					</h3>
					<p>{q.explanation}</p>
					{answers[q.id] !== q.answer && (
						<label>
							What happened?{" "}
							<select
								onChange={async (e) => {
									await db.mistakes.put({
										questionId: q.id,
										reason: e.target.value,
									});
									refresh();
								}}
							>
								<option>Choose a reason</option>
								{[
									"Didn’t know",
									"Concept confusion",
									"Misread",
									"Silly mistake",
									"Guessing",
									"Lack of revision",
									"Current-affairs gap",
								].map((s) => (
									<option key={s}>{s}</option>
								))}
							</select>
						</label>
					)}
				</div>
			)}
			<p className="source-note">{q.source}</p>
			<div className="button-row quiz-tools">
				<button
					className="text-button"
					onClick={() => bookmark(q.id, "question")}
				>
					<Bookmark size={15} />
					Bookmark
				</button>
				<button
					className="text-button"
					onClick={() =>
						setFlagged((a) =>
							a.includes(q.id) ? a.filter((x) => x !== q.id) : [...a, q.id],
						)
					}
				>
					{flagged.includes(q.id) ? "Unmark review" : "Mark for review"}
				</button>
				{!checked[q.id] && (
					<button
						className="text-button"
						onClick={() =>
							setAnswers((a) => {
								const n = { ...a };
								delete n[q.id];
								return n;
							})
						}
					>
						Clear response
					</button>
				)}
			</div>
			<div className="quiz-navigation">
				<button
					className="secondary"
					disabled={idx === 0}
					onClick={() => setIdx((i) => i - 1)}
				>
					<ChevronLeft size={16} />
					Previous
				</button>
				{!exam && !checked[q.id] && (
					<button
						className="primary"
						disabled={answers[q.id] === undefined}
						onClick={check}
					>
						Check answer
					</button>
				)}
				<button
					className="secondary"
					disabled={idx === qs.length - 1}
					onClick={() => setIdx((i) => i + 1)}
				>
					Next
					<ChevronRight size={16} />
				</button>
			</div>
			<div className="palette">
				{qs.map((q, i) => (
					<button
						key={q.id}
						className={
							(idx === i ? "current " : "") +
							(answers[q.id] !== undefined ? "answered " : "") +
							(flagged.includes(q.id) ? "flagged" : "")
						}
						onClick={() => setIdx(i)}
					>
						{i + 1}
					</button>
				))}
			</div>
			<div className="toolbar">
				<label className="small-text">
					Negative marking{" "}
					<select
						value={negative}
						onChange={(e) => setNegative(Number(e.target.value))}
					>
						<option value={1 / 3}>⅓ per wrong answer</option>
						<option value={0}>None</option>
						<option value={0.25}>¼ per wrong answer</option>
					</select>
				</label>
				<button
					className="primary"
					onClick={() => {
						if (confirm("Submit this session and view results?")) submit();
					}}
				>
					Finish & analyze
				</button>
			</div>
		</div>
	);
}
function Review({ cards, refresh, close }) {
	const [index, setIndex] = useState(0),
		[flipped, setFlipped] = useState(false),
		[busy, setBusy] = useState(false);
	const c = cards[index];
	const rate = async (good) => {
		if (busy) return;
		setBusy(true);
		const intervals = [0, 1, 3, 7, 14, 30, 60, 90],
			step = good ? Math.min(c.step + 1, 7) : 0;
		await db.cards.put({
			...c,
			step,
			due: Date.now() + (good ? intervals[step] * 86400000 : 600000),
		});
		await refresh();
		setIndex((i) => i + 1);
		setFlipped(false);
		setBusy(false);
	};
	return (
		<div className="review">
			<span className="eyebrow">ACTIVE RECALL</span>
			<h2>
				{c
					? `Card ${index + 1} of ${cards.length}`
					: "Good work. Let it settle."}
			</h2>
			{c ? (
				<>
					<button
						className={"flashcard " + (flipped ? "flipped" : "")}
						onClick={() => setFlipped(!flipped)}
					>
						<small>{flipped ? "THE ANSWER" : "THINK BEFORE YOU FLIP"}</small>
						<h2 className="prewrap">{flipped ? c.back : c.front}</h2>
						<span>
							{flipped ? "Click to see question" : "Tap to reveal answer"}
							<RotateCcw size={15} />
						</span>
					</button>
					{flipped && (
						<div className="button-row">
							<button
								disabled={busy}
								className="secondary"
								onClick={() => rate(false)}
							>
								Again · 10 min
							</button>
							<button
								disabled={busy}
								className="primary"
								onClick={() => rate(true)}
							>
								Remembered
								<Check size={16} />
							</button>
						</div>
					)}
				</>
			) : (
				<>
					<p>Your next review has been scheduled automatically.</p>
					<button className="primary" onClick={close}>
						Done for now
					</button>
				</>
			)}
		</div>
	);
}
function TaskForm({ subjects, done }) {
	return (
		<form
			className="form"
			onSubmit={(e) => {
				e.preventDefault();
				const f = new FormData(e.currentTarget);
				done({
					title: f.get("title"),
					subject: f.get("subject"),
					minutes: Number(f.get("minutes")),
					date: f.get("date"),
					done: false,
				});
			}}
		>
			<span className="eyebrow">INTENTION INTO ACTION</span>
			<h2>Add a study task</h2>
			<label>
				What will you work on?
				<input
					autoFocus
					required
					name="title"
					placeholder="e.g. Revise Parliament notes"
				/>
			</label>
			<label>
				Subject
				<select name="subject">
					{subjects.map((s) => (
						<option key={s}>{s}</option>
					))}
				</select>
			</label>
			<div className="two-col">
				<label>
					Minutes
					<input
						type="number"
						min="1"
						max="960"
						name="minutes"
						defaultValue="60"
						required
					/>
				</label>
				<label>
					Date
					<input type="date" name="date" defaultValue={day()} required />
				</label>
			</div>
			<button className="primary" type="submit">
				Add to plan
				<Plus size={16} />
			</button>
		</form>
	);
}
function NoteForm({ note, noteType, done }) {
	return (
		<form
			className="form"
			onSubmit={(e) => {
				e.preventDefault();
				const f = new FormData(e.currentTarget);
				done({
					...note,
					title: f.get("title"),
					body: f.get("body"),
					type: f.get("type"),
					date: f.get("date"),
					tags: f.get("tags"),
				});
			}}
		>
			<span className="eyebrow">YOUR PERSONAL KNOWLEDGE</span>
			<h2>{note ? "Edit note" : "A new thought worth keeping"}</h2>
			<label>
				Title
				<input
					name="title"
					defaultValue={note?.title}
					required
					placeholder="Give your note a title"
				/>
			</label>
			<label>
				Category
				<select name="type" defaultValue={note?.type || noteType || "Personal"}>
					{[
						"Personal",
						"Topic",
						"Mains",
						"Current affairs",
						"Mistake",
						"Revision",
						"Imported",
					].map((t) => (
						<option key={t}>{t}</option>
					))}
				</select>
			</label>
			<label>
				Note · plain text / Markdown
				<textarea
					name="body"
					rows="10"
					defaultValue={note?.body}
					required
					placeholder="Explain it in your own words…"
				/>
			</label>
			<label>
				Tags
				<input
					name="tags"
					defaultValue={note?.tags}
					placeholder="polity, prelims, must-revise"
				/>
			</label>
			<label>
				Date
				<input
					type="date"
					name="date"
					defaultValue={note?.date || day()}
					required
				/>
			</label>
			<button className="primary">
				Save note offline
				<Check size={16} />
			</button>
		</form>
	);
}
function CardForm({ done }) {
	return (
		<form
			className="form"
			onSubmit={(e) => {
				e.preventDefault();
				const f = new FormData(e.currentTarget);
				done({
					id: crypto.randomUUID(),
					front: f.get("front"),
					back: f.get("back"),
					topic: "personal",
					due: Date.now(),
					step: 0,
				});
			}}
		>
			<h2>Create a flashcard</h2>
			<label>
				Front · question
				<textarea required name="front" rows="3" />
			</label>
			<label>
				Back · answer
				<textarea required name="back" rows="5" />
			</label>
			<button className="primary">Add to revision queue</button>
		</form>
	);
}
function Writing({
	kind = "Mains answer",
	prompt = "",
	text = "",
	writingId,
	done,
}) {
	const [p, setP] = useState(prompt),
		[body, setBody] = useState(text),
		[id, setId] = useState(writingId),
		[running, setRunning] = useState(false),
		[secs, setSecs] = useState(0),
		[saved, setSaved] = useState(false);
	useEffect(() => {
		if (!running) return;
		const t = setInterval(() => setSecs((s) => s + 1), 1000);
		return () => clearInterval(t);
	}, [running]);
	const count = body.trim().split(/\s+/).filter(Boolean).length;
	return (
		<div className="form writing">
			<span className="eyebrow">{kind.toUpperCase()} WORKSPACE</span>
			<h2>Give your ideas a clear structure.</h2>
			<label>
				Question / topic
				<input value={p} onChange={(e) => setP(e.target.value)} />
			</label>
			<div className="writing-guide">
				{kind === "Essay"
					? "Interpret → Brainstorm dimensions → Arguments & counterarguments → Examples → Synthesis"
					: "Introduction → Arguments & evidence → Challenges → Way forward → Conclusion"}
			</div>
			<div className="toolbar">
				<span>
					{count} words ·{" "}
					{kind === "Essay"
						? "Aim for 1,000–1,200"
						: "Aim for 150 or 250 words as required"}
				</span>
				<button className="secondary" onClick={() => setRunning(!running)}>
					{running ? <Pause size={14} /> : <Play size={14} />} {fmt(secs)}
				</button>
			</div>
			<textarea
				rows="17"
				value={body}
				onChange={(e) => {
					setBody(e.target.value);
					setSaved(false);
				}}
				placeholder="Introduction\n\nBuild your argument with relevant facts and examples.\n\nConclusion"
			/>
			<div className="button-row">
				<button
					className="primary"
					onClick={async () => {
						const key = id || Date.now();
						await done({
							id: key,
							kind,
							prompt: p,
							text: body,
							date: day(),
							seconds: secs,
						});
						setId(key);
						setSaved(true);
					}}
				>
					<Check size={16} />
					{saved ? "Saved offline" : "Save draft"}
				</button>
				<button
					className="secondary"
					onClick={() => {
						setBody(
							(b) =>
								b +
								"\n\n## Introduction\n\n## Key arguments\n\n## Examples and evidence\n\n## Counterarguments\n\n## Conclusion\n",
						);
						setSaved(false);
					}}
				>
					Insert structure
				</button>
			</div>
			<p className="source-note">
				Plain-text / Markdown workspace. Save before closing. AI feedback, when
				configured, is not official UPSC evaluation.
			</p>
		</div>
	);
}
function GlobalSearch({ data, open, quiz, note }) {
	const [q, setQ] = useState(""),
		[type, setType] = useState("All");
	const results = [
		...data.topics.map((t) => ({
			label: t.title + " " + t.hindi,
			body: [
				t.intro,
				...(t.facts || []),
				...(t.subtopics || []).map((x) => x.title),
				...(t.editorialOutline || []),
			].join(" "),
			type: "Topic",
			click: () => open(t),
		})),
		...data.questions.map((t) => ({
			label: t.text,
			body: t.explanation,
			type: "Question",
			click: () => quiz(t),
		})),
		...data.notes.map((t) => ({
			label: t.title,
			body: t.body,
			type: "Note",
			click: () => note(t),
		})),
		...data.cards.map((t) => ({
			label: t.front,
			body: t.back,
			type: "Flashcard",
			click: () => {},
		})),
		...data.resources.map((t) => ({
			label: t.title,
			body: "",
			type: "File",
			click: () => {
				const url = URL.createObjectURL(t.blob);
				window.open(url, "_blank");
				setTimeout(() => URL.revokeObjectURL(url), 60000);
			},
		})),
	]
		.filter(
			(r) =>
				(type === "All" || r.type === type) &&
				(r.label + " " + r.body).toLowerCase().includes(q.toLowerCase()),
		)
		.slice(0, 40);
	return (
		<div>
			<h2>Find your next connection.</h2>
			<div className="search-inline big">
				<Search size={20} />
				<input
					autoFocus
					placeholder="Search lessons, notes, questions…"
					value={q}
					onChange={(e) => setQ(e.target.value)}
				/>
			</div>
			<div className="tabs">
				{["All", "Topic", "Question", "Note", "Flashcard", "File"].map((t) => (
					<button
						key={t}
						className={type === t ? "selected" : ""}
						onClick={() => setType(t)}
					>
						{t}
					</button>
				))}
			</div>
			<p className="muted small-text">
				Showing up to 40 matches from your offline library.
			</p>
			{results.map((r, i) => (
				<div className="search-result" key={i}>
					{r.type === "Flashcard" ? (
						<div>
							<small>{r.type}</small>
							<strong>{r.label}</strong>
						</div>
					) : (
						<button onClick={r.click}>
							<small>{r.type}</small>
							<strong>{r.label}</strong>
						</button>
					)}
					{r.type === "Flashcard" && <p>{r.body}</p>}
				</div>
			))}
			{!results.length && (
				<p>No matches. Try a different word or import more content.</p>
			)}
		</div>
	);
}
function Importer({ refresh, notify }) {
	const [error, setError] = useState("");
	const sample = {
		version: 1,
		questions: [
			{
				id: "custom-1",
				topic: "rights",
				subject: "Polity",
				text: "Your question?",
				options: ["A", "B", "C", "D"],
				answer: 0,
				explanation: "Explain the answer and alternatives.",
				difficulty: "Moderate",
				kind: "User-imported",
				source: "Your source",
				year: null,
			},
		],
		topics: [],
		cards: [],
		notes: [],
	};
	async function importFile(e) {
		try {
			const p = JSON.parse(await e.target.files[0].text());
			const allowed = ["questions", "topics", "cards", "notes", "affairs"];
			if (p.version !== 1) throw Error("Expected content pack version 1");
			let count = 0;
			for (const k of allowed) {
				if (p[k] && !Array.isArray(p[k])) throw Error(k + " must be an array");
				for (const x of p[k] || []) {
					count++;
					if (
						k === "questions" &&
						(!x.id ||
							!x.text ||
							!x.subject ||
							!Array.isArray(x.options) ||
							x.options.length !== 4 ||
							!Number.isInteger(x.answer) ||
							x.answer < 0 ||
							x.answer > 3 ||
							!x.explanation)
					)
						throw Error(
							"Questions need id, text, subject, 4 options, answer index 0–3 and explanation",
						);
					if (
						k === "topics" &&
						(!x.id ||
							!x.title ||
							!x.subject ||
							!x.intro ||
							!Array.isArray(x.facts))
					)
						throw Error("Topics need id, title, subject, intro and facts[]");
					if (k === "cards" && (!x.id || !x.front || !x.back))
						throw Error("Cards need id, front and back");
					if (k === "notes" && (!x.title || !x.body))
						throw Error("Notes need title and body");
					if (k === "affairs" && (!x.id || !x.date || !x.title))
						throw Error("Current affairs need id, date and title");
				}
			}
			if (!count) throw Error("No supported records found");
			if (!confirm(`Import ${count} items? Matching IDs will be updated.`))
				return;
			await db.transaction(
				"rw",
				allowed.map((k) => db[k]),
				async () => {
					for (const k of allowed) {
						const values = (p[k] || []).map((x) =>
							k === "cards"
								? { due: Date.now(), step: 0, ...x }
								: k === "topics"
									? { status: "Not started", stage: "Prelims", ...x }
									: k === "notes"
										? { type: "Imported", date: day(), ...x }
										: x,
						);
						if (values.length) await db[k].bulkPut(values);
					}
				},
			);
			await refresh();
			setError("");
			notify(`${count} content items imported`);
		} catch (e) {
			setError(e.message);
		}
	}
	return (
		<section className="panel roomy">
			<h2>Import a structured content pack</h2>
			<p>
				Use JSON for lessons, questions, flashcards, notes and dated current
				affairs. PDF files are stored as documents; they are not automatically
				converted or verified.
			</p>
			<div className="button-row">
				<button
					className="secondary"
					onClick={() => download(sample, "abhyas-content-template.json")}
				>
					<Download size={16} />
					Download JSON template
				</button>
				<label className="primary">
					<Upload size={16} />
					Import JSON
					<input hidden type="file" accept=".json" onChange={importFile} />
				</label>
			</div>
			{error && <p className="error">Import failed: {error}</p>}
			<h3>Source integrity matters</h3>
			<p>
				Use kind “PYQ” only for authentic questions. Include the examination
				year and a verifiable source. AI-generated and user-imported material
				should be labeled accordingly.
			</p>
			<pre>{JSON.stringify(sample, null, 2)}</pre>
		</section>
	);
}
function AISettings({ profile, save }) {
	const [endpoint, setEndpoint] = useState(profile.aiEndpoint || "");
	return (
		<section className="panel roomy form">
			<div className="section-heading">
				<h2>
					<Sparkles size={20} />
					Optional online AI
				</h2>
				<span className="badge">INTERNET REQUIRED</span>
			</div>
			<p>
				Connect a trusted server endpoint for tutoring, doubt solving, summaries
				and generation. Provider secrets must stay on your server, never in the
				browser. No AI service is bundled or simulated.
			</p>
			<label>
				Your AI proxy URL
				<input
					type="url"
					placeholder="https://your-server.example/api/tutor"
					value={endpoint}
					onChange={(e) => setEndpoint(e.target.value)}
				/>
			</label>
			<button
				className="secondary"
				onClick={() => save("settings", { ...profile, aiEndpoint: endpoint })}
			>
				Save endpoint
			</button>
			<p className="source-note">
				Contract: POST JSON {"{message, mode, language}"} →{" "}
				{'{reply: "plain text"}'}. Your proxy must allow this app’s origin.
				Avoid sending personal DAF data. Treat model output as unverified.
			</p>
		</section>
	);
}
function AITutor({ profile, online, settings }) {
	const [msg, setMsg] = useState(""),
		[mode, setMode] = useState("Tutor / doubt solver"),
		[reply, setReply] = useState(""),
		[busy, setBusy] = useState(false),
		[consent, setConsent] = useState(false);
	async function send() {
		if (!consent || !msg.trim()) return;
		setBusy(true);
		setReply("");
		try {
			const r = await fetch(profile.aiEndpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					message: msg,
					mode,
					language: "English and Hindi",
				}),
				signal: AbortSignal.timeout(45000),
			});
			if (!r.ok) throw Error("Service responded " + r.status);
			const result = await r.json();
			if (typeof result.reply !== "string")
				throw Error("Expected a text reply");
			setReply(result.reply);
		} catch (e) {
			setReply("Unable to connect: " + e.message);
		} finally {
			setBusy(false);
		}
	}
	return (
		<div className="form">
			<span className="eyebrow">A LITTLE HELP WITH THE HARD PARTS</span>
			<h2>Your AI study companion</h2>
			<div className="notice">
				<Sparkles size={19} />
				Online AI · outputs need independent verification.
			</div>
			{!profile.aiEndpoint ? (
				<>
					<p>
						An AI service isn’t connected yet. Your offline study tools are
						fully independent of it.
					</p>
					<button className="primary" onClick={settings}>
						Configure your AI service
						<ArrowRight size={16} />
					</button>
				</>
			) : (
				<>
					<label>
						What would you like help with?
						<select value={mode} onChange={(e) => setMode(e.target.value)}>
							{[
								"Tutor / doubt solver",
								"Generate MCQs",
								"Generate flashcards",
								"Summarize notes",
								"Process dated current affairs",
								"Mains / essay feedback",
							].map((m) => (
								<option key={m}>{m}</option>
							))}
						</select>
					</label>
					<textarea
						rows="6"
						value={msg}
						onChange={(e) => setMsg(e.target.value)}
						placeholder="Ask a question or paste material you want to understand…"
					/>
					<label className="consent">
						<input
							type="checkbox"
							checked={consent}
							onChange={(e) => setConsent(e.target.checked)}
						/>
						I consent to sending this text to my configured online service.
					</label>
					<button
						disabled={!online || busy || !consent || !msg.trim()}
						className="primary"
						onClick={send}
					>
						{busy ? "Thinking…" : online ? "Send to AI" : "Internet required"}
						<Send size={16} />
					</button>
					{reply && <div className="revision-sheet prewrap">{reply}</div>}
					<p className="source-note">
						AI-generated feedback is not official UPSC evaluation. Check factual
						claims and dates against primary sources.
					</p>
				</>
			)}
		</div>
	);
}
createRoot(document.getElementById("root")).render(<App />);
