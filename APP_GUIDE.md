# Abhyas — UPSC study companion

A functioning single-user, local-first study app tailored to CSE 2027, intermediate preparation, 8 study hours per day, and a dark academic appearance. This repository previously contained an Awesome list; its original documents are preserved.

**Delivery status:** working starter application, not a complete coaching-content product. The interface exposes all primary workspaces, but the full requested specification (particularly exhaustive content, OCR, advanced writing, large-scale search and an integrated live AI provider) is not yet implemented. See the precise limitations below.

## Run

Requires Node.js 22+ and npm.

```sh
npm ci
npm run dev
```

Vite binds to `0.0.0.0:5173` and accepts the Arena preview host. For a production-like, fully precached offline build:

```sh
npm run build
npm run preview -- --port 4173
```

Deploy the generated `dist/` directory at the **root** of an HTTPS origin. Do not deploy source files or `node_modules`. The app has no required server, cloud account, external font request, telemetry or login. External source links and explicitly configured AI calls are the only internet-dependent study features.

### Install on Android

1. Open the deployed HTTPS app in Chrome.
2. Wait for initial app loading and service-worker installation.
3. In **Settings & preferences**, select **Install Abhyas**, or use Chrome → **Install app / Add to Home screen**.
4. Open the installed app once, then test in airplane mode.

A web manifest includes 192px and 512px PNG icons, standalone display mode and theme colors. Browser installation prompts are controlled by the browser; an embedded preview may require opening the preview in a standalone tab. This is a **PWA, not a native APK**. No APK has been generated. iOS uses Safari’s Add to Home Screen.

## Implemented workflows

- **Dashboard:** today's tasks, real study time, question attempts, real accuracy, activity streak, due reviews, weakest attempted subject, quick learning actions.
- **Study:** eight introductory lessons, English/Hindi explanations and key facts, four presentation levels, revision summaries, status tracking, bookmarks, connected topic MCQs, flashcards and Mains prompts.
- **Practice:** 15 original English demo questions, four options, explanatory feedback, subject filtering, random practice, daily starter set and previous-mistake retesting. Authentic imported PYQs are separated by `kind: "PYQ"`.
- **Mocks:** available-bank timed test (72 seconds per question), absolute elapsed-time countdown, numbered palette, next/previous, review flags, response clearing, auto-submit, configurable negative marking, score and subject analysis. Correct response = 2 marks; default incorrect response = −2/3.
- **Revision:** create flashcards, reveal answers, grade recall, persist due dates; successful intervals 1/3/7/14/30/60/90 days; failed recall returns after 10 minutes. Incorrect questions automatically populate the mistake book with editable reasons.
- **Writing:** Mains, essay and interview-reflection drafts, timer, word count, editable question, Markdown structure insertion, save/reopen drafts.
- **Resources:** create/edit categorized notes with tags; import PDF, images, TXT and Markdown as offline blobs; TXT/Markdown also become notes; read/search local notes; open stored files in a browser tab. File rendering depends on the browser's viewer support.
- **Current affairs:** dated personal notes and structured imported records. No fabricated current headlines or undated rankings.
- **Planner:** create dated tasks with subject and time allocation, complete/delete/reschedule tasks, focus timer and explicitly saved subject study sessions.
- **Syllabus:** exam-stage/category framework and progress states for loaded topics; not claimed as a verbatim official syllabus. Includes link to UPSC notices.
- **Analytics:** attempts, correct answers, accuracy by subject, real weakest attempted subject, study time, loaded-topic completion, written drafts, revision advancement, mock-test history and PYQ counts. Small sample sizes are stated; no predictive exam claims.
- **Search:** local lessons, questions, notes, flashcards and file names, with content-type filtering and a 40-match display cap.
- **Preferences:** target year, hours, optional subject and dark/light/AMOLED themes.
- **Data:** IndexedDB persistence; JSON pack import with validation and transactional writes; full backup/restore including embedded binary resources; optional persistent-storage request.
- **AI:** real, consent-gated HTTP client for a configurable trusted endpoint. Explicitly disconnected until configured; no synthetic tutor answers. Modes cover tutor, MCQs, flashcards, summaries, current-affairs processing and writing feedback.

### Starter content

Eight lessons cover Fundamental Rights, Parliament, inflation, monsoons, biodiversity, Non-Cooperation Movement, public-service integrity and ratios. Eight associated flashcards and 15 original questions are seeded on first use. All are starter/demo material, **not official previous-year questions**.

Hindi explanations and key facts accompany these lessons. Most UI labels and all starter question options/explanations remain English. Imports may contain bilingual text. The EN/हिं control changes major workspace headings; it is not a complete interface localization switch.

Constitutional reference snippets link to the Legislative Department. The general lesson source labels are reference families, not page-specific citations. Import your verified source material for comprehensive exam coverage.

## Architecture and files

- `src/main.jsx`: React workspace, views, dialogs and functional components.
- `src/data.js`: Dexie schema, initialization, starter content and exam framework.
- `src/hindi.js`: starter lesson translations.
- `src/style.css`: responsive layout, mobile navigation, theme tokens, academic styling.
- `public/manifest.webmanifest`, `public/icon*`: installation metadata and icons.
- `public/sw.js`: app-shell/runtime cache with offline navigation fallback.
- `vite.config.js`: hashed build-specific service-worker cache and precached JS/CSS/fonts.
- `examples/content-pack.json`: editable import example.
- `tests/smoke.mjs`, `tests/flows.mjs`: real browser workflow checks.

### Database: `abhyas-v1`, version 1

| Store | Primary key / indexes | Relationship / use |
|---|---|---|
| settings | `id` | `profile` record; preferences and optional endpoint |
| topics | `id`; subject, stage, status | lesson content; extensible subject strings |
| questions | `id`; subject, topic, year, kind, difficulty | `topic` → topics.id; PYQs share this table |
| attempts | auto id; questionId, date, subject | `questionId` → questions.id; each checked answer |
| cards | `id`; topic, due | topic relationship; recall step and due timestamp |
| notes | auto id; type, date | categorized personal/imported text and tags |
| tasks | auto id; date, done | local calendar date, subject, minutes, completion |
| sessions | auto id; date, subject | explicitly saved study seconds |
| bookmarks | `id`; type | topic/question id plus default Must Revise folder |
| writing | auto id; type, date | Mains/essay/reflection drafts; `kind` distinguishes use |
| resources | auto id; type, date | filename, MIME type, size and Blob |
| tests | auto id; date | aggregate submitted mock results |
| mistakes | `questionId`; reason | latest recorded reason for an incorrect question |
| affairs | `id`; date | structured, dated user-imported material |
| plans | auto id; date | reserved for future long-range planning; not exposed yet |

Relationships are logical, not foreign-key enforced. IndexedDB has no SQLite-style foreign-key constraints. Boolean task status is filtered from loaded records rather than queried through its index. Profiles are one local record, not multi-user accounts.

### Offline storage details

Build assets and locally packaged fonts are cached on installation. Same-origin GET responses are cached as they are used; successful network requests refresh cache entries. On a network failure, cached content is returned. AI is POST-based and is not intercepted or cached. Cache names are derived from hashed build assets, and older Abhyas caches are removed on activation. IndexedDB progress is independent of asset caches and is not deleted by a service-worker update.

The browser may evict origin storage. Use the persistent-storage request where supported and keep external backups. Clearing browser site data deletes the local library. Storage is not encrypted at rest, and this app does not protect data from others using the same unlocked browser profile. Avoid sensitive DAF information in remote prompts.

## Content import

Use **Resources → Import → Download JSON template**, or copy `examples/content-pack.json`.

Supported top-level arrays: `topics`, `questions`, `cards`, `notes`, `affairs`; the top-level `version` must be `1`. IDs must be stable and unique in their store. Matching IDs are updated after confirmation; new IDs are inserted transactionally.

Question `answer` is a **zero-based index** (0–3). `options` must have exactly four entries. Include `explanation`, `subject`, a `topic` ID, `difficulty`, and a meaningful `source`. For official PYQs set `kind: "PYQ"`, supply the real `year`, and cite a verifiable examination source. The software does not independently verify authenticity. Use `Demo`, `User-imported` or `AI-generated` for other provenance.

Topic records require `id`, `title`, `subject`, `intro`, `facts[]`; optional fields include `hindi`, `stage`, `source`, `status`. Status defaults to `Not started`.

Flashcards require `id`, `front`, `back`; `topic` links to a lesson. A missing `due` defaults to now and `step` to 0. `due` is milliseconds since the Unix epoch.

Notes require `title`, `body`; missing type/date default to Imported/today. Structured current-affairs records require `id`, `title`, `date`; displayed optional fields are `background`, `whyItMatters`, `prelimsRelevance`, `mainsRelevance`, `source`. Use ISO-like local `YYYY-MM-DD` dates.

PDF upload does **not** automatically produce questions, extract text or perform OCR. There is no unsafe HTML rendering of imported text.

## Backup and restore

1. Open **Settings & preferences → Export backup**.
2. Save `abhyas-backup-YYYY-MM-DD.json` outside the browser/device.
3. To restore, select that file through **Restore**, and confirm replacement.

Format: `{ "format": "abhyas", "version": 1, "data": { ...allStores } }`. Files are embedded as base64 data URLs and rehydrated into Blobs before the transaction. Restore validates table presence and runs replacement transactionally. Backup files are not encrypted and may include personal content; treat them accordingly. Keep enough free space for both the file and the restored database. Base64 increases attachment size and very large libraries need a future streaming/ZIP backup implementation.

## Configure real online AI

In preferences supply a **trusted HTTPS server endpoint**. Keep provider API secrets on that server; never put them into the web bundle or use this field for a provider API key. The client sends:

```json
{ "message": "Explain a concept…", "mode": "Tutor / doubt solver", "language": "English and Hindi" }
```

The expected response is `{ "reply": "Plain-text answer" }`. The server must allow the app's HTTPS origin via CORS if hosted separately. Each request requires explicit user consent; a 45-second timeout and visible connection errors are implemented. No provider credentials, proxy backend or paid API access are included. The supplied endpoint should enforce authentication, usage limits and privacy rules before public deployment. Output is displayed as text, not evaluated as HTML. AI-generated MCQs/flashcards currently require manual validation/import; they are not auto-committed to the library. AI feedback is not official UPSC evaluation, and current facts need dated primary-source verification.

## Verification

With the production preview running on port 4173:

```sh
npm test
```

Two Chromium browser scripts passed:

- desktop navigation and lesson opening;
- question selection, answer checking, result analysis;
- note creation and persistent retrieval after reload;
- flashcard recall and advancing the revision queue;
- planner task creation;
- **offline reload with persistent notes**;
- **390px mobile layout without horizontal overflow**;
- timed mock navigation/review flags and correct 1/3-negative score;
- writing draft save/reopen listing;
- document and structured question import;
- global search;
- backup/restore round trip with binary file content;
- no browser page exceptions during these tests.

The Linux test helper uses a bundled serverless Chromium and its supporting NSS libraries; it does not require downloading Playwright's browser. Native Android installation, real external AI calls, browser storage eviction, automatic timer expiry at the end of a long test, and assistive-technology flows have **not** been tested on a physical device. Production build passes. The app's main bundle is roughly 425 KB before gzip; fonts are bundled offline.

## Known limitations / remaining specification

This is not a claim that every item in the original large specification is complete:

1. **Content coverage:** no full official PYQ bank, full official verbatim syllabus, complete optional courses, exhaustive reference databases, maps, or live current-affairs feed. The advanced explanation level is a study framework, not a comprehensive advanced chapter.
2. **Languages:** bilingual starter lessons, but no complete Hindi UI or Hindi MCQ translations.
3. **AI/OCR:** optional endpoint integration only; no included provider backend, on-device AI, OCR, scanned-document extraction or automatic PDF-to-learning-content pipeline.
4. **Writing/notes:** plain text and Markdown input; no rich-text rendering, inline image annotation, diagram canvas, handwriting recognition or integrated official-style scoring rubric.
5. **Scale:** appropriate for starter/personal collections, but tables are currently loaded into React memory; search scans loaded records. Indexed schemas exist, but paged Dexie queries, full-text inverted indexing, virtualization and 10,000+-record performance validation are **not yet implemented**.
6. **Tests/PYQs:** tests use the available filtered bank, not a guaranteed 100-question paper. No custom test authoring, exhaustive year/paper/difficulty filters, detailed historical-frequency charts, per-question timing or reload-resumable exam state. Only aggregate mock results and individual answer attempts persist. CSAT uses the general scoring setting; there is no separate qualifying-score engine.
7. **Planning:** manual dated tasks plus Pomodoro; no algorithmic annual/monthly plan generation or exam-date scheduling. Timer screens should remain open; unsaved elapsed study time and writing edits are not durable until explicitly saved. No background OS alarms.
8. **Bookmarks:** topics/questions and one default folder; no arbitrary object bookmarking or folder management.
9. **Data tooling:** structured content import supports five record types, not mock-test definitions; full backup exports everything. Restore trusts the user's local backup after structural checks, not a full untrusted-content schema audit. No encrypted backups, cross-device sync, accounts or migration UI.
10. **Accessibility/packaging:** basic semantic controls and keyboard focus styling exist; modal focus trapping and a full accessibility audit remain. PWA only; native APK signing/distribution is not included.

Next priorities: import your real study material, extend/verify content and translations, provide a secure AI backend, extract document text, and refactor data access into indexed paged repositories before large-bank deployment.

## Standalone offline viewer (no sandbox or server)

Open **Abhyas-Offline.html** directly from your device. This single file embeds the production React app, IndexedDB library, icons, English/Hindi fonts and starter content. It makes no initial HTTP requests, needs no service worker, and does not depend on the Arena sandbox. It is a downloadable HTML document, **not a publicly hosted URL or native APK**.

- Download the file, then choose **Open with → browser**. Desktop Chrome/Edge support the tested file workflow. Android file-manager/browser combinations differ; opening HTML in a restricted document preview may only show reading mode.
- With JavaScript and local-file IndexedDB permitted, the same interactive workspace is available, with saved notes, quizzes, revision and backup/restore.
- If IndexedDB is unavailable, the file displays a clear read-only mode with all eight starter lessons and 15 questions/explanations. If JavaScript is disabled entirely, equivalent static reading content is already in the document.
- Keep the filename/location and browser profile stable. File-origin storage rules vary by browser. Export regular backups; do not assume progress moves with the HTML file. The HTML contains the starter data, not your subsequently saved personal progress.
- Home-screen PWA installation requires the separate HTTPS-hosted edition. AI and external source links still require internet. AI servers may reject requests from local-file (`null`) origins; use a trusted hosted origin rather than broadly allowing null origins on a public AI proxy.

Rebuild and test the downloadable deliverable:

```sh
npm run build:offline
npm run test:offline
```

`tests/offline-file.mjs` tests direct `file://` navigation with networking disabled and standard browser web-security enabled: quiz checking, saved-note reload, backup download, mobile overflow, zero HTTP requests, blocked-storage fallback and script-disabled reading fallback. Physical Android file opening has not been verified.

## GitHub Pages publication

The publishable app is generated under `docs/`, with the project base path `/awesome/`. The manifest uses relative icons/start URL, service-worker registration follows the build base, and caches are scoped to the deployment directory.

```sh
npm run build:offline
# Refresh the ZIP if offline HTML has changed.
npm run build:pages
node tests/pages.mjs
```

The connected integration can push code but received **403 Resource not accessible by integration** when attempting to enable GitHub Pages. A repository administrator must enable it once:

1. Open `https://github.com/krisingh6789-ai/awesome/settings/pages`.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Select branch **arena/01a0b9cb-awesome**, folder **/docs**, and Save.
4. Wait for GitHub's Pages deployment to succeed; use the URL GitHub displays.

Expected site address after successful activation: `https://krisingh6789-ai.github.io/awesome/`. Do not assume this URL is live before Pages has been enabled. No switch or push to main/gh-pages is needed. Only the app build and starter offline download are served; personal data remains in the user's browser.

`npm run build` still produces a root-path local preview by default. `npm run build:pages` changes `dist/` to a project-path build; rerun the normal build before testing the root preview.

## Polity–Economy release: user-supplied contents map (19 September 2026)

Open **Study → Open Polity & Economy**, or **Syllabus tracker**. This release adds the user's visible book contents, not a claim to have acquired the underlying textbook chapters or the full official UPSC syllabus.

### Scope delivered

- **80 Polity chapters**, organised in the **11 printed parts**.
- **515 printed Polity subheadings/reference lines**, preserving chapter-relative page labels and cross-page continuations.
- **19 Economy entries** with printed page ranges. The 18th entry is the book's practice-set resource and the 19th its answer resource; those actual pages were not supplied.
- **26 supplementary records**: seven front-matter entries, ten appendices and nine additional-reading entries.
- **97 original AI-generated core lessons** (80 Polity + 17 Economy including an original glossary), with concept explanations, facts, exam traps, original Mains prompts and reference routes. These contain approximately 13,779 English words before the expanded guides.
- **Eight expanded guides**: Fundamental Rights, Centre–State Relations, Parliament, Supreme Court, National Income Accounting, Money and Banking, Government Budgeting, International Economics. They add worked reasoning, comparison tables, case applications and linked chapters.
- **60 new original AI-generated MCQs**, correctly distinguished from official PYQs, plus **97 new recall cards**. With the original starter set, the default library has 105 lessons, 75 questions and 105 cards.
- Paginated chapter navigation, chapter/subtopic search, source checklists, per-item learning statuses, linked personal notes, chapter bookmarks, chapter-specific practice, Mains prompts, flashcards, revision-sheet export, content export and a full coverage-register export.

### Important coverage boundaries

All visible numbered units have been mapped, but **mapping is not detailed teaching completion**. The entire text of each book chapter was not supplied. Every printed subheading is retained even where detailed standalone treatment remains pending. Core lessons are concise original study material; they are not substituted textbook chapters or a declaration of comprehensive advanced mastery. Primary-source review is pending and shown prominently. Portal links are verification routes, not fabricated page-level citations.

The new pack has Hindi chapter titles and English explanations. **Complete Hindi translations of all new chapters remain pending.** The eight pre-existing starter lessons retain their bilingual explanations. No authentic source PYQ, textbook practice-set question or answer key is invented to fill absent pages.

The book indicates an older sixth edition and includes PYQ appendices through 2019. Time-sensitive law, case law, institutional composition, government programmes, monetary-policy settings, national-accounts series, budget figures and rankings must be checked against current primary materials. No current rank, policy rate or officeholder list is fabricated.

The cropped chapter-end range for Subordinate Courts is explicitly flagged; the visible Notes and References line at 36.10 is retained without guessing the cropped range. The Economy page gap between Agriculture and Industry is retained. Handwritten reading ticks/counts, article annotations and marginal notes are not treated as verified facts or app activity. Original photograph files, personal handwriting and image backgrounds are not published.

### Data, maintenance and tests

`src/content/polity-outline.txt` and `economy-outline.txt` hold the transcribed scope. `polity-lessons.txt` and `economy-lessons.txt` hold original core explanations. `supplementary.json` retains reference-only entries. `scripts/compile-curriculum.mjs` validates counts and compiles `curriculum.json` plus **CONTENT_COVERAGE.md**. `questions-pack.js` and `deep-dives.js` contain original practice and expanded explanations; `pack.js` performs the additive transactional installation.

No schema reset is performed. The pack revision marker is `settings['pack:polity-economy']`; source-checklist progress is stored as `settings['coverage:<chapterId>']` with independent `marks`. Existing topic learning statuses, card steps/due dates and notes survive a pack reinstall. Book reference entries are not marked as finished merely because they exist. A user-marked chapter completion is separate from editorial coverage/review state. Old backups receive missing pack content after restoration, while existing local data remains preserved under the normal restore semantics.

`tests/curriculum.mjs` verifies all numbered units, source-line counts, reference entries, lesson and question integrity, pagination, checklist persistence, linked notes and Mains prompts, budget question checking, upgrade preservation of progress/review scheduling, offline reload and mobile overflow. Root-app workflows, binary-file backup/restore, single-file offline reading fallback and `/awesome/` deployment-path tests are also rerun for this release.

The portable HTML embeds the new lessons and includes them in the script-disabled reading library. It remains an HTML file, not an Android APK. Local-file execution/storage restrictions and the GitHub Pages enablement requirement still apply.

## Textbook reading revision (19 September 2026, pack revision 2)

The **default** Polity–Economy screen is now a quiet reading desk, not the earlier dashboard/card grid. Choose **Subject → Part → Chapter**, or **Read this entire part**. All 80 Polity chapters remain in their 11 photographed parts; the 19 Economy entries remain in photographed order within six clearly labelled editorial groups. The source register and previous detailed tracking interface remain under **Coverage & resources**.

Reading includes adjustable text size, a collapsible chapter contents list, previous/next chapters, full-text search (including the new explanations), and a saved last-opened chapter per subject. `settings['reader:Polity']` and `settings['reader:Economy']` store chapter IDs, not precise scroll positions. Text-size selection lasts for the current reading-desk session. Practice, notes, flashcards, bookmarks and writing remain accessible through **Practice & notes**; they do not interrupt the reading text. Marking a chapter studied remains a learner action, not editorial certification.

### Newly researched teaching

`src/content/researched-lessons.js` contains **59 original explanatory sections across 10 chapters**, approximately **7,852 new English words** in the explanatory paragraphs, plus Hindi recaps and section-level source-basis labels. The additions cover Fundamental Rights, Directive Principles, Federal System, Centre–State Relations, Parliament, Parliamentary Committees, National Income Accounting, Money and Banking, Government Budgeting and International Economics. Seven consulted publications from NCERT, RBI, the Union Budget, WTO and IMF are recorded with URLs, editions/dates and scope in **RESEARCH_NOTES.md** and the readers.

This is **source-informed AI-written teaching**, not independent expert verification. Older core lessons and eight earlier advanced guides retain their review-pending labels. Not every printed subheading has exhaustive standalone treatment, and full Hindi translation is not complete. The 2026–27 budget example explicitly uses Budget Estimates; the cited RBI inflation-target period is dated. Current policy rates, index rankings and GDP base-year claims are not invented. Some pedagogical sources simplify constitutional law or retain historical examples: legal qualifications require the actual applicable provisions/judgments, and the old Planning Commission account is identified as historical.

### Reading files and reproducible packaging

`npm run build:offline` creates:

- **Abhyas-Offline.html** — interactive portable app, with the expansions also present in storage-failure and JavaScript-disabled fallbacks.
- **Abhyas-Polity-Reading-Book.html** — continuous, read-only subject book including all 80 chapters and available teaching.
- **Abhyas-Economy-Reading-Book.html** — all 19 entries, with the two missing source resources explicitly labelled.

The app's **Download reading book** buttons generate these subject books without a network request. The books need no JavaScript, use device fonts, have linked contents and print styling, and can be converted through the browser's **Print → Save as PDF**. No page cap is imposed; layout, type size and paper size determine the page count. Word totals count available teaching, examples and recall material, not a claim of coverage completeness. The books are not copies of the photographed textbooks and do not include personal notes/progress. External references require internet.

To update the release archive (requires Python 3 in addition to Node):

```sh
npm run build:offline
python3 - <<'PY'
from zipfile import ZipFile, ZIP_DEFLATED
files = ['Abhyas-Offline.html', 'Abhyas-Polity-Reading-Book.html',
         'Abhyas-Economy-Reading-Book.html', 'CONTENT_COVERAGE.md',
         'RESEARCH_NOTES.md', 'START-HERE.txt']
with ZipFile('Abhyas-Offline-Android.zip', 'w', ZIP_DEFLATED) as archive:
    for file in files:
        archive.write(file)
PY
npm run build:pages
node tests/pages.mjs
npm run build
npm test
npm run test:offline
npm run test:curriculum
npm run test:textbook
```

The new textbook test verifies hierarchy/order, all 59 section IDs and source references, search inside explanations, whole-part reading, font sizing, persisted status and chapter resume, study-tool access, HTML export, service-worker offline reload, no-JavaScript reading and mobile/print layout. Existing workflow and preservation tests remain in place. These are desktop Chromium tests at phone-sized viewports, **not physical Android verification**. Export a backup before replacing the old app file; changing file location/browser/origin can change access to existing device storage.
