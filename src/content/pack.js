import curriculum from "./curriculum.json" with { type: "json" };
import { packQuestions } from "./questions-pack.js";
export { curriculum, packQuestions };
export const references = {
	constitution: {
		name: "Constitution of India · applicable Articles, Schedules and amendments",
		url: "https://legislative.gov.in/constitution-of-india/",
	},
	indiacode: {
		name: "India Code · search the named Act and its current consolidated provisions",
		url: "https://indiacode.gov.in/",
	},
	citizenship: {
		name: "Ministry of Home Affairs · citizenship law, rules and OCI guidance",
		url: "https://www.mha.gov.in/",
	},
	parliament: {
		name: "Parliament of India · House rules, committees and parliamentary institutions",
		url: "https://sansad.in/",
	},
	cabinet: {
		name: "Cabinet Secretariat · transaction of business and current committees",
		url: "https://cabsec.gov.in/",
	},
	supremecourt: {
		name: "Supreme Court of India · judgments and constitutional jurisdiction",
		url: "https://www.sci.gov.in/",
	},
	legalservices: {
		name: "NALSA · legal services and Lok Adalat guidance",
		url: "https://nalsa.gov.in/",
	},
	eci: {
		name: "Election Commission of India · laws, instructions and current electoral guidance",
		url: "https://www.eci.gov.in/",
	},
	gst: {
		name: "GST Council · Constitution, recommendations and notifications",
		url: "https://gstcouncil.gov.in/",
	},
	cag: {
		name: "Comptroller and Auditor General of India · mandate and reports",
		url: "https://cag.gov.in/",
	},
	humanrights: {
		name: "NHRC · Protection of Human Rights Act and guidance",
		url: "https://nhrc.nic.in/",
	},
	rti: {
		name: "RTI portal · Act, amendments and rules",
		url: "https://rti.gov.in/",
	},
	ndma: {
		name: "NDMA · disaster-management law, plans and guidelines",
		url: "https://ndma.gov.in/",
	},
	mea: {
		name: "Ministry of External Affairs · official policy statements",
		url: "https://www.mea.gov.in/",
	},
	niti: {
		name: "NITI Aayog · institutional mandate and development reports",
		url: "https://www.niti.gov.in/",
	},
	mospi: {
		name: "MoSPI · national accounts, PLFS, indices and release methodology",
		url: "https://www.mospi.gov.in/",
	},
	rbi: {
		name: "Reserve Bank of India · monetary policy, banking and external-sector statistics",
		url: "https://www.rbi.org.in/",
	},
	agriculture: {
		name: "Department of Agriculture · agricultural statistics and policies",
		url: "https://agriwelfare.gov.in/",
	},
	budget: {
		name: "Union Budget · receipts, expenditure, fiscal statements and Economic Survey",
		url: "https://www.indiabudget.gov.in/",
	},
	wto: {
		name: "WTO · legal texts and agreement explanations",
		url: "https://www.wto.org/",
	},
};
export const packTopics = curriculum.chapters
	.filter((c) => !c.resourceOnly)
	.map((c) => ({
		...c,
		packId: curriculum.id,
		stage:
			c.subject === "Polity"
				? "Prelims / Mains GS II"
				: "Prelims / Mains GS III",
		status: "Not started",
		source: `Original AI-generated core lesson; source outline: ${c.subject} contents ${c.toc}, pages ${c.pageRange}. Primary-source review pending.`,
		demo: false,
	}));
export const packCards = packTopics.map((t) => ({
	id: `pe-card-${t.id}`,
	topic: t.id,
	front: `${t.title} · ${t.hindi}\nRecall the central rules and one exam trap.`,
	back: t.facts.slice(0, 4).join("\n") + "\n\nAvoid: " + t.trap,
	step: 0,
	due: Date.now(),
	packId: curriculum.id,
}));
export async function installCurriculum(db) {
	const marker = await db.settings.get("pack:polity-economy");
	if (marker?.revision === curriculum.revision) return;
	await db.transaction(
		"rw",
		db.settings,
		db.topics,
		db.questions,
		db.cards,
		async () => {
			// Never reset progress, reschedule existing cards, or replace colliding user-imported records.
			for (const t of packTopics) {
				const old = await db.topics.get(t.id);
				if (!old) await db.topics.add(t);
				else if (old.packId === curriculum.id)
					await db.topics.put({ ...t, status: old.status });
			}
			for (const q of packQuestions) {
				const old = await db.questions.get(q.id);
				if (!old || old.packId === curriculum.id) await db.questions.put(q);
			}
			for (const c of packCards)
				if (!(await db.cards.get(c.id))) await db.cards.add(c);
			await db.settings.put({
				id: "pack:polity-economy",
				revision: curriculum.revision,
				installedAt: Date.now(),
			});
		},
	);
}
