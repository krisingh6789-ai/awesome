import Dexie from "dexie";
export const db = new Dexie("abhyas-v1");
db.version(1).stores({
	settings: "id",
	topics: "id,subject,stage,status",
	questions: "id,subject,topic,year,kind,difficulty",
	attempts: "++id,questionId,date,subject",
	cards: "id,topic,due",
	notes: "++id,type,date",
	tasks: "++id,date,done",
	sessions: "++id,date,subject",
	bookmarks: "id,type",
	writing: "++id,type,date",
	resources: "++id,type,date",
	tests: "++id,date",
	mistakes: "questionId,reason",
	affairs: "id,date",
	plans: "++id,date",
});
const make = (id, subject, title, hindi, intro, facts) => ({
	id,
	subject,
	title,
	hindi,
	intro,
	facts,
	status: "Not started",
	stage: "Prelims",
	source: "Starter lesson · NCERT / Constitution of India",
	demo: true,
});
export const topics = [
	make(
		"rights",
		"Polity",
		"Fundamental Rights",
		"मौलिक अधिकार",
		"Fundamental Rights protect individual liberty and place limits on state power. Part III of the Constitution makes these rights enforceable through courts.",
		[
			"Articles 12–35 form Part III.",
			"Article 14 guarantees equality before law and equal protection of laws.",
			"Article 19 freedoms are subject to constitutionally permitted reasonable restrictions.",
			"Article 32 provides remedies for enforcement of Fundamental Rights.",
		],
	),
	make(
		"parliament",
		"Polity",
		"Parliament & its functions",
		"संसद और उसके कार्य",
		"Parliament consists of the President, the Council of States and the House of the People. It legislates, scrutinises the executive and controls public finances.",
		[
			"Article 79 defines Parliament.",
			"A Money Bill can be introduced only in the Lok Sabha.",
			"The Council of Ministers is collectively responsible to the Lok Sabha.",
		],
	),
	make(
		"inflation",
		"Economy",
		"Understanding inflation",
		"मुद्रास्फीति को समझना",
		"Inflation is a sustained rise in the general price level. It reduces the purchasing power of money, though its impact differs across households.",
		[
			"Demand-pull inflation follows excess aggregate demand.",
			"Cost-push inflation can follow rising input costs.",
			"CPI measures changes in prices faced by consumers.",
		],
	),
	make(
		"monsoon",
		"Geography",
		"The Indian monsoon",
		"भारतीय मानसून",
		"The monsoon is a seasonal reversal of winds. Differential heating, pressure patterns and the seasonal movement of the ITCZ shape rainfall in India.",
		[
			"The southwest monsoon supplies most annual rainfall in India.",
			"Orographic uplift produces heavy rain on windward slopes.",
			"El Niño can influence the monsoon but is not its only determinant.",
		],
	),
	make(
		"biodiversity",
		"Environment",
		"Biodiversity & conservation",
		"जैव विविधता और संरक्षण",
		"Biodiversity includes genetic, species and ecosystem diversity. Conservation protects ecological processes and the services that support human life.",
		[
			"In-situ conservation protects species in natural habitats.",
			"Ex-situ conservation includes seed banks and botanical gardens.",
			"Habitat fragmentation can isolate populations.",
		],
	),
	make(
		"movement",
		"History",
		"The Non-Cooperation Movement",
		"असहयोग आंदोलन",
		"Launched in 1920 under Gandhi, the movement mobilised people through non-violent non-cooperation with colonial institutions.",
		[
			"It included boycotts of government schools, courts and foreign cloth.",
			"Gandhi withdrew the movement after the Chauri Chaura incident in 1922.",
			"The Khilafat issue helped broaden mobilisation.",
		],
	),
	make(
		"ethics",
		"Ethics",
		"Integrity in public service",
		"लोक सेवा में सत्यनिष्ठा",
		"Integrity means consistency between values, decisions and actions. Public officials must put public interest before private advantage.",
		[
			"Accountability requires explaining and justifying decisions.",
			"Conflicts of interest should be disclosed and managed.",
			"Legality and ethical conduct overlap but are not identical.",
		],
	),
	make(
		"csat",
		"CSAT",
		"Ratios & proportions",
		"अनुपात और समानुपात",
		"A ratio compares two quantities. A proportion states that two ratios are equal. Keep units consistent before comparing.",
		[
			"For a:b = 2:3, the total is five equal parts.",
			"Cross multiplication helps solve a/b = c/d.",
			"Percentage change uses the original value as the denominator.",
		],
	),
];
export const questions = [
	[
		"rights",
		"Which Article provides the right to constitutional remedies?",
		["Article 14", "Article 19", "Article 32", "Article 44"],
		2,
		"Article 32 guarantees the right to move the Supreme Court for enforcement of Fundamental Rights. Article 14 concerns equality, Article 19 certain freedoms, and Article 44 a Directive Principle.",
	],
	[
		"rights",
		"Which of the following are included in Part III of the Constitution?",
		[
			"Fundamental Duties",
			"Fundamental Rights",
			"Directive Principles",
			"Emergency provisions",
		],
		1,
		"Part III covers Fundamental Rights. Duties are in Part IVA, Directive Principles in Part IV and emergency provisions in Part XVIII.",
	],
	[
		"parliament",
		"A Money Bill may be introduced in:",
		["Either House", "Rajya Sabha only", "Lok Sabha only", "A joint sitting"],
		2,
		"A Money Bill can only be introduced in Lok Sabha, on the recommendation of the President. Rajya Sabha may make recommendations.",
	],
	[
		"parliament",
		"Parliament of India consists of:",
		[
			"Lok Sabha alone",
			"Both Houses only",
			"President and both Houses",
			"Prime Minister and both Houses",
		],
		2,
		"Article 79 establishes Parliament consisting of the President and the two Houses. The Prime Minister is not a separate constituent of Parliament.",
	],
	[
		"inflation",
		"A sustained increase in input costs may cause:",
		[
			"Demand-pull inflation",
			"Cost-push inflation",
			"Deflation necessarily",
			"No price change necessarily",
		],
		1,
		"Higher input costs can shift aggregate supply and raise prices. Demand-pull inflation instead originates in demand pressures; the other outcomes are not necessary.",
	],
	[
		"inflation",
		"If prices rise while nominal income stays constant, purchasing power generally:",
		["Rises", "Falls", "Remains unchanged", "Doubles"],
		1,
		"With unchanged nominal income, higher prices reduce the goods and services a household can buy.",
	],
	[
		"monsoon",
		"Heavy rainfall on windward mountain slopes is associated with:",
		[
			"Orographic uplift",
			"Ocean salinity alone",
			"Earthquakes",
			"Tidal friction",
		],
		0,
		"Moist air rises over mountains, cools and condenses. The other processes do not explain orographic rainfall.",
	],
	[
		"monsoon",
		"Which is the most accurate statement about El Niño and the Indian monsoon?",
		[
			"It always causes drought",
			"It has no influence",
			"It can influence rainfall alongside other factors",
			"It always causes floods",
		],
		2,
		"El Niño can weaken monsoon rainfall, but the relationship is not deterministic. Other oceanic and atmospheric factors matter.",
	],
	[
		"biodiversity",
		"Which is an example of ex-situ conservation?",
		["National park", "Wildlife sanctuary", "Seed bank", "Biosphere reserve"],
		2,
		"A seed bank conserves genetic material outside its natural habitat. The other options conserve biodiversity in situ.",
	],
	[
		"biodiversity",
		"Biodiversity includes:",
		[
			"Only species diversity",
			"Only genetic diversity",
			"Genetic, species and ecosystem diversity",
			"Only forest cover",
		],
		2,
		"Biodiversity spans variation within species, among species and across ecosystems. Forest cover alone does not capture these dimensions.",
	],
	[
		"movement",
		"The Non-Cooperation Movement was withdrawn after:",
		["Jallianwala Bagh", "Chauri Chaura", "Dandi March", "Quit India"],
		1,
		"The violent incident at Chauri Chaura in February 1922 led Gandhi to withdraw the movement. The other events relate to different moments.",
	],
	[
		"movement",
		"Which was a feature of the Non-Cooperation Movement?",
		[
			"Boycott of foreign cloth",
			"Armed rebellion as official policy",
			"Support for colonial courts",
			"Participation in all colonial institutions",
		],
		0,
		"Boycott of foreign cloth and colonial institutions was central. Non-violence was the stated approach.",
	],
	[
		"ethics",
		"An official facing a conflict of interest should first:",
		[
			"Conceal it",
			"Disclose it through the appropriate process",
			"Ignore it",
			"Delegate secretly to a relative",
		],
		1,
		"Disclosure allows transparent management of a conflict. Concealment or private arrangements undermine integrity.",
	],
	[
		"csat",
		"A sum of ₹500 is divided in the ratio 2:3. The larger share is:",
		["₹100", "₹200", "₹250", "₹300"],
		3,
		"There are five parts. Each equals ₹100, so the larger share is 3 × ₹100 = ₹300.",
	],
	[
		"csat",
		"A value rises from 80 to 100. Its percentage increase is:",
		["20%", "25%", "80%", "125%"],
		1,
		"The increase is 20. Dividing by the original value of 80 gives 25%, not 20%.",
	],
].map((q, i) => ({
	id: `q${i}`,
	topic: q[0],
	subject: topics.find((t) => t.id === q[0]).subject,
	text: q[1],
	options: q[2],
	answer: q[3],
	explanation: q[4],
	difficulty: i % 3 === 0 ? "Moderate" : "Easy",
	kind: "Demo",
	source: "Original starter question · not an official PYQ",
	tags: ["Starter pack"],
	year: null,
}));
export const syllabus = {
	Prelims: [
		"History",
		"Art & Culture",
		"Geography",
		"Polity",
		"Governance",
		"Economy",
		"Environment",
		"Science & Technology",
		"Current Affairs",
		"CSAT",
	],
	Mains: [
		"GS I · Culture, history, geography & society",
		"GS II · Polity, governance, social justice & IR",
		"GS III · Economy, agriculture, security & environment",
		"GS IV · Ethics, integrity & aptitude",
		"Essay",
		"Optional subject",
		"Qualifying language papers",
	],
	Interview: [
		"DAF-based preparation",
		"Current affairs discussion",
		"Situational & ethical questions",
		"Mock interview reflections",
	],
};
export async function init() {
	if (!(await db.settings.get("profile"))) {
		await db.transaction("rw", db.tables, async () => {
			await db.settings.put({
				id: "profile",
				year: 2027,
				hours: 8,
				language: "Bilingual",
				optional: "Not selected",
				theme: "dark",
			});
			await db.topics.bulkPut(topics);
			await db.questions.bulkPut(questions);
			await db.cards.bulkPut(
				topics.map((t, i) => ({
					id: "f" + i,
					topic: t.id,
					front: t.title + " — recall the key facts",
					back: t.facts.join("\n"),
					due: Date.now(),
					step: 0,
				})),
			);
			await db.tasks.bulkAdd([
				{
					title: "Understand Fundamental Rights",
					subject: "Polity",
					minutes: 60,
					done: false,
					date: new Date().toLocaleDateString("en-CA"),
				},
				{
					title: "Practice 15 starter MCQs",
					subject: "Mixed practice",
					minutes: 30,
					done: false,
					date: new Date().toLocaleDateString("en-CA"),
				},
				{
					title: "Revise with flashcards",
					subject: "Spaced repetition",
					minutes: 20,
					done: false,
					date: new Date().toLocaleDateString("en-CA"),
				},
			]);
		});
	}
}
