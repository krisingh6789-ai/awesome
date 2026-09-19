// Original teaching notes, not reproductions of the linked publications.
// Sources were consulted on 19 September 2026; independent editorial review is pending.
export const researchSources = {
	rights: {
		name: "NCERT · Rights in the Indian Constitution",
		url: "https://ncert.nic.in/textbook/pdf/keps202.pdf",
		edition: "Indian Constitution at Work, chapter 2, reprint 2026–27",
		scope:
			"Rights, constitutional remedies, Directive Principles and the rights–duties relationship. Historical examples and simplified legal descriptions are not treated as current consolidated law.",
	},
	legislature: {
		name: "NCERT · Legislature",
		url: "https://ncert.nic.in/textbook/pdf/keps205.pdf",
		edition: "Indian Constitution at Work, chapter 5, reprint 2026–27",
		scope:
			"Bicameralism, legislative process, executive accountability and committees. Exact procedural thresholds require current constitutional text and House rules.",
	},
	federalism: {
		name: "NCERT · Federalism",
		url: "https://ncert.nic.in/textbook/pdf/keps207.pdf",
		edition: "Indian Constitution at Work, chapter 7, reprint 2026–27",
		scope:
			"Federal design, division of powers and demands for autonomy. Its historical Planning Commission discussion is not a description of today's institutions.",
	},
	rbi: {
		name: "RBI · Monetary Policy overview",
		url: "https://www.rbi.org.in/scripts/FS_Overview.aspx?fn=2752",
		edition: "Live overview consulted 19 September 2026",
		scope:
			"Policy objective, MPC, inflation-targeting framework, liquidity instruments and operating target. No current policy-rate quotation is embedded.",
	},
	budget: {
		name: "Union Budget · Budget at a Glance 2026–27",
		url: "https://www.indiabudget.gov.in/doc/Budget_at_Glance/budget_at_a_glance.pdf",
		edition:
			"2026–27 Budget Estimates; overview and opening receipts/expenditure table",
		scope:
			"Deficit definitions, effective capital expenditure and the dated worked budget example. These are estimates, not final accounts. The URL may later serve a newer budget.",
	},
	wto: {
		name: "WTO · Principles of the trading system",
		url: "https://www.wto.org/english/thewto_e/whatis_e/tif_e/fact2_e.htm",
		edition: "Understanding the WTO; consulted 19 September 2026",
		scope:
			"MFN, national treatment, bindings, predictability, liberalisation and development flexibilities. Agreement-specific disputes need the actual legal texts.",
	},
	gdp: {
		name: "IMF · Gross Domestic Product: An Economy’s All",
		url: "https://www.imf.org/en/Publications/fandd/issues/Series/Back-to-Basics/gross-domestic-product-GDP",
		edition:
			"Tim Callen, Finance & Development, Back to Basics; consulted 19 September 2026",
		scope:
			"GDP, value added, production/income/expenditure approaches and nominal versus real output. Used for concepts, not India's current base year or statistical methodology.",
	},
};
export const researchedLessons = {};
function chapter(id, sources, sections) {
	researchedLessons[id] = {
		sources,
		consulted: "2026-09-19",
		status: "Source-informed original expansion · independent review pending",
		sections: sections.map(([title, hindi, basis, ...paragraphs], i) => ({
			id: `${id}-reading-${i + 1}`,
			title,
			hindi,
			basis,
			paragraphs,
		})),
	};
}
chapter(
	"pe-p07",
	["rights"],
	[
		[
			"1. Start with the purpose of a right",
			"मौलिक अधिकार: सत्ता पर सीमा और व्यक्ति की सुरक्षा।",
			"NCERT: The importance of rights; Bill of Rights",
			"A right is not simply a benefit that a government may withdraw whenever it becomes inconvenient. A Fundamental Right has constitutional protection. It places limits on public power and gives the individual a route to challenge a violation. This is why a government elected by a large majority must still respect constitutional rights: winning an election gives authority to govern, not unlimited authority over people.",
			"Think of two separate questions. First, what may the State do to a person? Second, what must the State do to protect people from exploitation or exclusion? Rights matter in both situations. A discriminatory government order is one problem; authorities ignoring forced labour is another. Good constitutional analysis examines the source of the injury and the duty of the public authority instead of assuming that every violation has the same legal form.",
			"An original example: a district office refuses to accept an application solely because the applicant belongs to an unpopular community. The issue is not merely rude service. Ask which equality guarantee is involved, whether the office is a public authority, what evidence establishes discrimination and which remedy can stop it. A right becomes useful when its holder can identify a duty and seek an effective remedy.",
		],
		[
			"2. A four-question method for any rights problem",
			"किसका अधिकार, किसकी जिम्मेदारी, कौन-सी सीमा, क्या उपचार?",
			"NCERT: Fundamental Rights in the Indian Constitution; Right to Constitutional Remedies",
			"First identify the right-holder. Some guarantees protect persons generally, whereas specified freedoms protect citizens. Second identify the respondent and duty: government action, a legally recognised public duty, or a private act covered by a particular protection. Third identify the restriction. Do not assume that a restriction is lawful merely because an official says it serves the public interest. Fourth identify the remedy and the court or statutory authority able to grant it.",
			"The word fundamental does not mean every right is absolute. Different provisions contain different conditions, and those conditions cannot be exchanged at will. A restriction on a religious practice and a restriction on a business activity must be tested against their respective constitutional rules. Equally, the existence of restrictions does not make rights meaningless: government still has to act within law and remains subject to judicial scrutiny.",
			"Use this method before learning long lists of cases. It prevents a common Mains weakness: naming an Article without showing how the facts fit it. The detailed meaning of State under Article 12 and invalidity under Article 13 needs provision-by-provision and case-law study; this source-informed introductory method does not claim to exhaust either subject.",
		],
		[
			"3. Equality does not always mean identical treatment",
			"समानता का अर्थ हर परिस्थिति में बिल्कुल एक जैसा व्यवहार नहीं है।",
			"NCERT: Right to Equality",
			"Formal equality asks whether the same rule applies to everyone. Substantive equality asks whether social disadvantage prevents people from using the opportunity in practice. A building may announce that everyone can enter, but a staircase-only entrance still excludes some persons with disabilities. Removing that barrier is not an attack on equality; it can be a way to make equal access real.",
			"Distinguish the equality ideas rather than treating Articles 14 to 18 as a single slogan. Equality before law and equal protection address legal treatment. Non-discrimination and access provisions address specified forms of exclusion. Equality in public employment concerns access to government service. Abolition of untouchability confronts a particular system of social exclusion. Abolition of titles serves the rejection of artificial civic hierarchy, subject to the constitutional treatment of military and academic distinctions.",
			"Reservations and other special measures must be studied within the specific constitutional provisions that permit them. They are not proof that equality has been abandoned, nor does every policy called affirmative action automatically satisfy all legal requirements. In an answer, explain the disadvantage being addressed, the legal basis, the design of the measure and the need for review. Avoid inventing a universal quota rule that applies to every institution and category.",
		],
		[
			"4. Freedom: read the guarantee and its limits together",
			"स्वतंत्रता के साथ उसकी संवैधानिक सीमाएँ भी पढ़ें।",
			"NCERT: Right to Freedom; Other freedoms",
			"Freedom enables people to speak, organise, move, choose livelihoods and participate in public life. Article 19 protects specified freedoms of citizens. For revision, connect each freedom to a real activity: speaking at a public meeting, forming an association, moving to another state, settling there or running a lawful business. This makes it easier to recognise questions in which several freedoms are affected by the same order.",
			"A restriction is not justified simply because somebody dislikes a speech or protest. Conversely, calling an activity an exercise of freedom does not immunise it from every lawful restriction. The correct sequence is to identify the exact freedom, the legal basis for the restriction, the constitutionally relevant ground and whether the measure is defensible under the applicable standard. Read exact grounds from the Article rather than treating all restrictions as a general public-interest clause.",
			"Original application: a peaceful procession is rerouted because a bridge is structurally unsafe. Compare a short, evidence-based rerouting with an indefinite ban on all meetings across a district. Both restrict an activity, but their reasons, geographical reach, duration and available alternatives are different. In Mains, this comparison is more useful than writing either 'all bans are unconstitutional' or 'public order permits every ban'.",
		],
		[
			"5. Life, liberty and the position of an accused person",
			"आरोप लगना दोष सिद्ध होना नहीं है।",
			"NCERT: Right to life and personal liberty; Rights of accused",
			"Life and personal liberty concern more than mere biological survival. NCERT explains the judicial expansion of the right towards dignity and conditions necessary for meaningful life. This does not mean every desirable public service is automatically available as an unconditional individual entitlement. The wording of the guarantee, the relevant judgment, the governing law and the relief sought still matter.",
			"An accusation must not be treated as a conviction. Procedural safeguards are especially important when a person faces the coercive power of the State. The protections concerning retrospective criminal punishment, repeated prosecution and punishment for the same offence, and compelled self-incrimination address different risks. Do not turn the first into a claim that every retrospective civil or tax law is prohibited; do not turn the last into a claim that every form of evidence collection is forbidden.",
			"For ordinary arrest, learn the information, legal-representation and production-before-a-magistrate safeguards, including their constitutional qualifications. The 24-hour rule excludes necessary journey time. Preventive detention is a distinct constitutional category with its own safeguards and exceptions. A concise textbook summary is not enough to resolve its exact time limits in every statutory situation. For an exam statement, return to the applicable Article and current detention law rather than generalising from an ordinary criminal arrest.",
		],
		[
			"6. Exploitation: constitutional protection also matters outside government offices",
			"शोषण के विरुद्ध अधिकार निजी व्यक्तियों के आचरण से भी जुड़ते हैं।",
			"NCERT: Right against Exploitation; The importance of rights",
			"Exploitation can involve trafficking, forced labour and prohibited child employment. The central idea is that poverty or social dependence must not become a licence to treat a human being as an instrument. A worker may appear to agree to a condition while having little meaningful choice because of debt, threats or extreme vulnerability. Constitutional analysis therefore cannot stop at the claim that a contract was signed.",
			"Articles 23 and 24 should be distinguished. One addresses trafficking and forced labour; the other addresses employment of children below fourteen in factories, mines and other hazardous employment. Statutory child-labour protections go beyond a short constitutional heading and must be read separately. Do not infer that every activity outside the exact words of Article 24 is therefore lawful.",
			"Original application: a brick-kiln worker is told that an old debt prevents the family from leaving employment. Identify the coercion, the vulnerable persons, the public authority responsible for enforcement and the evidence required. In a Mains answer, legal prohibition is only the beginning: inspections, rescue, rehabilitation, schooling and access to alternative livelihoods determine whether the protection works.",
		],
		[
			"7. Religion: conscience, practice and equal citizenship",
			"धर्म की स्वतंत्रता में किसी धर्म को न मानने की स्वतंत्रता भी शामिल है।",
			"NCERT: Right to Freedom of Religion; Freedom of faith and worship; Equality of all religions",
			"Freedom of conscience protects personal belief, including the choice not to follow a religion. Profession, practice and propagation are related but distinct activities. A person may state a belief, perform a religious practice or explain it to others. None of these expressions should be confused with a constitutional permission to force another person to accept a faith.",
			"Religious freedom is subject to the relevant constitutional limitations, including public order, morality and health, and to other applicable provisions. A useful distinction is between protecting belief and examining the legal regulation of an activity associated with religion. A practice does not escape every law merely because it has a religious label. At the same time, administrative dislike of a community is not a legitimate substitute for a lawful justification.",
			"Articles 25 to 28 cover more than individual worship: they also concern religious affairs, particular taxation issues and religious instruction or worship in specified educational institutions. The constitutional categories of institutions matter. Do not replace them with the sweeping statement that all religious teaching in every school is prohibited. For Mains, connect secularism to equal citizenship and freedom of conscience rather than reducing it to hostility towards religion.",
		],
		[
			"8. Culture and education: preserving diversity without abandoning equality",
			"भाषा और संस्कृति का संरक्षण लोकतांत्रिक विविधता को मजबूत करता है।",
			"NCERT: Cultural and Educational Rights",
			"A democracy can use majority decision-making without requiring minorities to erase their identity. Cultural and educational protections make that distinction meaningful. They protect spaces in which language, script, culture and institutions can continue across generations, while the wider constitutional order continues to apply.",
			"Read Articles 29 and 30 separately. Article 29's protection of distinct language, script or culture is not expressed as a right only for minorities; its admission-related provision also has its own wording. Article 30 specifically addresses religious and linguistic minorities establishing and administering educational institutions. The phrase cultural and educational rights is a convenient chapter label, not a reason to merge the holders and conditions of the two Articles.",
			"Original application: when discussing a linguistic minority's school, separate the right to establish and administer the institution from questions about recognition, educational standards, aid and admissions. The actual legal outcome depends on the institution and applicable law. A good answer recognises both preservation of identity and legitimate regulation, instead of assuming either complete government control or complete immunity from standards.",
		],
		[
			"9. Remedies: a written promise needs an enforcement route",
			"उपचार के बिना अधिकार का व्यावहारिक मूल्य कम हो जाता है।",
			"NCERT: Right to Constitutional Remedies",
			"Constitutional remedies connect a guarantee to a court capable of enforcing it. Article 32 concerns moving the Supreme Court for enforcement of Fundamental Rights. Article 226 empowers High Courts to issue writs for Fundamental Rights and for other legal purposes. The High Court's subject-matter reach is therefore broader, although jurisdiction and procedural considerations continue to apply.",
			"Choose relief by asking what has gone wrong. Is a person unlawfully detained? Is a public authority failing to perform a duty? Has a tribunal acted outside its jurisdiction? Is somebody occupying a public office without the legal qualification? The same factual story may involve more than one legal issue, but a writ is not a magic word that bypasses all requirements.",
			"An institutional remedy is different from social effectiveness. Filing costs, language, delay, lack of documents, fear of retaliation and weak compliance can prevent people from benefiting from a formal right. This is why legal aid, accessible administration and monitoring of compliance belong in a Mains discussion. Explain the constitutional route first, then explain what makes it work for a vulnerable claimant.",
		],
		[
			"10. Understand the five writs by the problem they address",
			"बंदी प्रत्यक्षीकरण, परमादेश, प्रतिषेध, उत्प्रेषण और अधिकार-पृच्छा।",
			"NCERT: Right to Constitutional Remedies; writ descriptions (introductory basis, with legal distinctions requiring case-law study)",
			"Habeas corpus addresses unlawful detention. Its purpose is not to decide every aspect of the underlying criminal allegation; it tests the lawfulness of custody. Mandamus concerns performance of a public or legal duty in appropriate circumstances. The applicant must identify an actual duty, not merely a desirable action they would like the authority to take.",
			"Prohibition restrains a lower court or tribunal from proceeding beyond lawful jurisdiction. Certiorari can quash a decision affected by the relevant jurisdictional or legal defect. For a first comparison, think prevention versus correction, but do not assume that this memory aid captures every procedural qualification. The exact grounds and availability depend on the governing law and judicial doctrine.",
			"Quo warranto questions the lawful authority by which a person holds a public office. It is not a general device for challenging every private employment appointment. In a practice question, identify the nature of the office and the legal requirement allegedly breached. The common trap across all writs is memorising a translation while ignoring the claimant, respondent, legal defect and relief.",
		],
		[
			"11. Property, duties and rights outside Part III",
			"भाग III के बाहर का संवैधानिक अधिकार भी महत्वहीन नहीं होता।",
			"NCERT: Right to Property; Fundamental Duties of citizens",
			"The right to property is no longer a Fundamental Right in Part III; Article 300A provides constitutional protection against deprivation except by authority of law. 'Not fundamental' does not mean 'not protected'. Its present status changes the constitutional route of analysis and remedy, but does not give officials an unrestricted power to take property.",
			"Keep three categories distinct: a Fundamental Right, another constitutional right, and a right created by ordinary legislation. Their source, amendment requirements and enforcement routes differ. It is misleading to call every important legal entitlement a Fundamental Right, just as it is misleading to dismiss a statutory entitlement as optional.",
			"Fundamental Duties encourage civic conduct, but enjoyment of Fundamental Rights is not generally a reward available only after an official certifies that duties have been performed. Laws may give effect to particular duties within constitutional limits. In an answer, show how rights, duties and public welfare can support one another without inventing a rule that automatically cancels an individual's rights for being an imperfect citizen.",
		],
		[
			"12. Evaluate the system, not just the list",
			"अधिकारों की सफलता उनका वास्तविक उपयोग कर पाने में है।",
			"NCERT: The importance of rights; Conclusion",
			"The achievement of a bill of rights is that it places some basic claims beyond ordinary political convenience. It protects dissent, legal equality, personal autonomy, diversity and access to remedies. Its weaknesses in practice may include delay, uneven awareness, social pressure and the difficulty of securing compliance. These are reasons to strengthen institutions, not evidence that constitutional guarantees have no value.",
			"For a 150-word answer, use four moves: explain the constitutional purpose, identify the relevant guarantee, demonstrate an implementation difficulty and propose a specific institutional improvement. A proposal such as accessible legal aid is stronger when you identify who needs it and what barrier it removes. Avoid ending every answer with an unexplained demand for awareness or strict implementation.",
			"Scope boundary: these twelve sections develop the main rights groups and their use. They do not exhaust the source photograph's separate headings on Articles 12–13, Articles 31A–31C, armed forces, martial law, legislative competence or emergency effects. Those headings remain visible in the coverage register and require further provision-level research. The original book's Notes and References pages have not been supplied.",
		],
	],
);
chapter(
	"pe-p08",
	["rights"],
	[
		[
			"1. Why a Constitution contains policy directions",
			"नीति निदेशक तत्व शासन को सामाजिक न्याय की दिशा देते हैं।",
			"NCERT: Directive Principles of State Policy",
			"Political democracy is incomplete if many people cannot obtain education, basic nutrition, health care or a reasonable livelihood. Directive Principles express a constitutional direction towards social and economic transformation. They help answer not only who may govern, but what public purposes governance should pursue. They are not simply a list of programmes announced by one political party.",
			"Their non-justiciability means that they are not, by themselves, enforceable in court in the same manner as Fundamental Rights. It does not mean that they are irrelevant, unconstitutional or optional decorations. They inform legislation, political accountability and constitutional interpretation. A law implementing a directive may create specific enforceable statutory entitlements; the enforceability then needs to be examined through that law and the wider constitutional framework.",
		],
		[
			"2. Read goals, policy directions and implementation separately",
			"लक्ष्य, नीति और परिणाम तीन अलग प्रश्न हैं।",
			"NCERT: What do the Directive Principles contain?",
			"Some directives concern broad goals such as welfare, justice and reduced inequality. Others indicate policy directions, such as village self-government or particular social reforms. A third way to read them is through people's material needs, including livelihood, education and humane working conditions. These categories help understanding; familiar coaching labels such as socialist, Gandhian and liberal-intellectual are analytical groupings, not headings written into the Constitution.",
			"Original example: to evaluate a nutrition programme, distinguish the constitutional goal of improved well-being, the statutory or administrative scheme chosen, the budget allocated and the actual service delivered. A budget announcement is not proof that nutrition improved. Likewise, a disappointing outcome does not alone establish that the constitutional goal was legally enforceable in the exact form demanded. Connect law, finance, administration and evidence.",
		],
		[
			"3. Rights and directives: avoid a false either-or",
			"व्यक्तिगत स्वतंत्रता और सामाजिक न्याय को साथ पढ़ें।",
			"NCERT: Relationship between Fundamental Rights and Directive Principles",
			"Rights protect individuals against certain exercises of power, while directives guide the State towards a more just social order. This is a useful starting contrast, not an absolute division: some rights require positive State action and social policy can help people use their freedoms. A child who receives an education gains more meaningful opportunity to participate in public life.",
			"Tension arises when a redistributive or regulatory measure affects protected interests. The answer is not that every welfare objective automatically overrides every right. Nor is it that rights prevent all social reform. Constitutional amendments, legislation and judicial interpretation shape the relationship, subject to constitutional limits. The exact scope of Article 31C and the relevant basic-structure decisions needs separate case-law verification; an introductory NCERT discussion does not replace those judgments.",
		],
		[
			"4. Build an evaluative Mains answer",
			"घोषणा से आगे बढ़कर संस्थाएँ, संसाधन और जवाबदेही देखें।",
			"NCERT: Directive Principles; original application",
			"A strong answer can connect a directive to an implementation chain: constitutional objective, law or scheme, funding, responsible institution, accessible delivery and measurable outcome. For decentralisation, for example, creating an elected body is only one step; functions, finances and staff determine whether it can act. For labour welfare, a rule without inspection or an accessible complaint mechanism may leave workers unprotected.",
			"An original answer plan for 'Are non-justiciable directives still important?' is: explain their status; show how they guide legislation and evaluation of government; acknowledge resource constraints and the absence of a direct remedy based solely on a directive; conclude that constitutional significance is broader than immediate enforceability. Do not substitute a long list of Article numbers for that reasoning.",
		],
	],
);
chapter(
	"pe-p13",
	["federalism"],
	[
		[
			"1. Federalism shares power, not merely administrative work",
			"संघवाद में क्षेत्रीय सरकार की शक्ति का संवैधानिक आधार होता है।",
			"NCERT: What is Federalism?",
			"A large organisation may delegate work to a local office and later withdraw it. Federalism is different: the regional government's authority has a constitutional basis rather than depending entirely on the convenience of a superior administrator. Both national and state governments have defined spheres, and disputes about their powers need a constitutional method of settlement.",
			"India combines common national membership with strong regional identities. Being attached to a language or a state need not conflict with belonging to the Union. Federal institutions allow different communities to participate in shared rule while exercising self-government in designated areas. The value of federalism therefore lies not only in administrative efficiency but also in recognition, representation and the accommodation of diversity.",
		],
		[
			"2. The lists are a map of responsibility",
			"संघ सूची, राज्य सूची और समवर्ती सूची को उदाहरणों से समझें।",
			"NCERT: Federalism in the Indian Constitution; Division of Powers",
			"Defence and currency call for national coordination. Police, agriculture and many local services involve substantial state responsibility. Subjects such as education and forests appear in the Concurrent List, where both levels can legislate within the constitutional scheme. These examples help explain the lists, but the full legal entry must be read when a dispute concerns overlapping subject matter.",
			"The label of a ministry or the political popularity of an issue does not decide legislative competence. A question may require examining the real nature of a law and its relation to several entries. Residuary authority addresses matters not assigned in the lists; it is not a licence to ignore a subject already covered by a specific entry. Learn the structure before attempting difficult competence and repugnancy problems.",
		],
		[
			"3. A strong Union and meaningful states can coexist",
			"मजबूत केंद्र का अर्थ राज्यों का संवैधानिक अस्तित्व समाप्त होना नहीं है।",
			"NCERT: Federalism with a Strong Central Government",
			"The constitutional design responded to integration, national security, development and the risk of fragmentation. It therefore gives the Union important advantages, including significant fiscal capacity and powers in specified exceptional situations. These features explain the description of a federal system with a centralising tendency; they do not erase elected state governments or all limits on Union action.",
			"Distinguish a normal division of powers from an exceptional constitutional route. A special parliamentary power over a state subject has a trigger, procedure and scope. Simply listing emergency provisions without explaining those conditions produces the mistaken impression that the Union can always do anything. Equally, describing India as federal does not mean every state has an absolute veto over every national decision.",
		],
		[
			"4. Trust is part of how institutions work",
			"सहयोग केवल एक शब्द नहीं, नियमित परामर्श और भरोसे की प्रक्रिया है।",
			"NCERT: What is Federalism?; Conflicts in India's Federal System",
			"A written division of powers cannot anticipate every policy problem. Floods, epidemics, migration, transport networks and environmental damage cross state borders. Effective federalism requires shared information, predictable finance, consultation and a willingness to resolve disagreements without treating every dispute as disloyalty.",
			"For Mains, evaluate both cooperation and legitimate disagreement. A state can question a funding formula while still participating in a common programme. Competition can encourage better delivery, but it may also disadvantage states with weak starting capacity unless supported by fair transfers. Avoid writing that competitive and cooperative federalism are necessarily opposites; ask what institutional design makes each productive.",
		],
	],
);
chapter(
	"pe-p14",
	["federalism"],
	[
		[
			"1. Separate legislative, administrative and financial relations",
			"कानून बनाने, लागू करने और खर्च उठाने की समस्याएँ अलग हो सकती हैं।",
			"NCERT: Division of Powers; Demands for Autonomy",
			"A Centre–State dispute is easier to understand once it is classified. Legislative relations concern the authority to make a law. Administrative relations concern implementation, coordination and lawful directions. Financial relations concern the assignment of revenue, transfers, expenditure and borrowing. A dispute may involve more than one category, but the categories require different evidence and remedies.",
			"Original example: a state wants to improve district hospitals. The authority to administer the service, eligibility for a centrally supported grant, recruitment of staff and the terms of borrowing are not one question. An answer that merely demands more autonomy misses the mechanism. Identify the particular constraint, then assess a proposal to change it.",
		],
		[
			"2. Financial autonomy gives practical meaning to responsibility",
			"जिम्मेदारी के साथ पर्याप्त और पूर्वानुमेय संसाधन भी चाहिए।",
			"NCERT: Division of Powers; Federalism with a Strong Central Government; Demands for Autonomy",
			"States deliver many visible public services while important revenue sources are concentrated at the Union level. Transfers can help bridge this mismatch and address differences in states' fiscal capacity and needs. Their design matters: an unpredictable transfer makes planning difficult, while a very tightly conditioned transfer may leave little room for local priorities.",
			"Separate a state's own revenue from its share of common taxes, grants and borrowing. Borrowing is financing that creates future obligations; it is not the same as a permanent increase in revenue. Similarly, do not assume every transfer is an identical discretionary grant. For contemporary answers, verify the applicable Finance Commission period, budget documents and legal arrangements rather than reproducing an old formula from memory.",
		],
		[
			"3. Autonomy has several meanings",
			"स्वायत्तता राजनीतिक, वित्तीय, प्रशासनिक और सांस्कृतिक हो सकती है।",
			"NCERT: Centre-State Relations; Demands for Autonomy",
			"A demand for autonomy may seek a change in legislative responsibilities, greater control over funds, less interference in administration or protection for language and culture. These demands should not all be interpreted as demands for separation. Federal politics often concerns the terms of working together within the Union.",
			"Party competition affects how constitutional arrangements are used, but party labels are not constitutional arguments. Ask whether consultation took place, whether reasons were publicly explained and whether the same principle would be acceptable if the parties in office were reversed. That is a useful test of institutional fairness in questions about governors, grants and the administration of joint schemes.",
		],
		[
			"4. Use history without freezing the present",
			"पुराने संस्थागत उदाहरण को वर्तमान व्यवस्था न मानें।",
			"NCERT: historical discussion of Centre-State relations; source limitation",
			"The consulted NCERT chapter discusses the Planning Commission as part of the history of centralised development planning. That discussion must not be copied as a statement about the present institutional arrangement. Likewise, a textbook's account of a period of single-party dominance or coalition government illustrates political change; it is not a permanent rule about every future election.",
			"A balanced reform answer links each problem to a remedy: predictable transfers for planning uncertainty, consultation before common programme design, transparent reasons in contested decisions, better dispute-resolution forums and greater administrative capacity. Identify which proposal changes the Constitution, which changes a statute and which can be achieved through routine institutional practice.",
		],
	],
);
chapter(
	"pe-p22",
	["legislature"],
	[
		[
			"1. Parliament is more than a law factory",
			"संसद कानून, प्रतिनिधित्व, चर्चा और जवाबदेही का मंच है।",
			"NCERT: Why do we need a Parliament?; What does the Parliament do?",
			"A legislature represents competing interests, debates public choices, authorises spending, makes laws and holds the executive accountable. Counting laws passed therefore measures only one part of its work. A House that passes many bills without adequate scrutiny may be busy but not necessarily effective; a searching debate can improve policy even without immediately producing a new Act.",
			"The executive usually has advantages in information, staffing and control over the legislative agenda. Parliamentary control matters because a government should explain and defend how it uses those advantages. The issue is not whether ministers are capable people; it is whether power is exercised under public scrutiny and with the confidence required by the parliamentary system.",
		],
		[
			"2. Why two Houses?",
			"लोकसभा जनप्रतिनिधित्व और राज्यसभा संघीय प्रतिनिधित्व से जुड़ी है।",
			"NCERT: Why do we need two Houses of Parliament?; Rajya Sabha; Lok Sabha",
			"Bicameralism creates a second stage of deliberation and allows different bases of representation. The Lok Sabha is directly elected from territorial constituencies. The Rajya Sabha represents states through an indirect electoral arrangement for their elected representatives, alongside constitutionally provided nominated members. Its permanent character also provides continuity when the Lok Sabha is dissolved.",
			"Do not import the American rule of equal state representation into India: states do not all send the same number of members to the Rajya Sabha. Nor does indirect election make the Rajya Sabha irrelevant. It has important legislative and constitutional roles even though the Council of Ministers is collectively responsible to the Lok Sabha. The President is also a constituent part of Parliament; saying Parliament consists only of two Houses is incomplete.",
		],
		[
			"3. Follow an ordinary bill from proposal to law",
			"विधेयक प्रस्ताव है; अधिनियम बनने के लिए निर्धारित प्रक्रिया जरूरी है।",
			"NCERT: How does the Parliament make laws?",
			"A bill begins as a proposal, not an enforceable law merely because a minister announces it. Policy formulation, drafting and consultation precede introduction. Within Parliament, consideration may include general discussion, detailed examination, amendments and voting. A committee can support this process, but not every bill is automatically referred to a committee.",
			"For an ordinary bill, the two Houses must normally agree to the same legislative text before presidential assent. Disagreement may lead to further consideration or, under the relevant constitutional conditions, a joint sitting. Do not claim that a joint sitting is the universal solution to all legislative disagreement: Money Bills and Constitution Amendment Bills have different rules.",
			"A private member's bill is introduced by a member who is not a minister; it is not a bill about a private company or a secret legislative proposal. Government and private-member classification describes who introduces the bill. Ordinary, Money and Constitution Amendment classifications concern its subject and constitutional procedure. These are different axes and should not be mixed.",
		],
		[
			"4. Money Bills: unequal powers, not no role at all",
			"धन विधेयक में राज्यसभा की भूमिका सिफारिश की है।",
			"NCERT: How does the Parliament make laws?; Article 109 extract",
			"A Money Bill is introduced only in the Lok Sabha, with the constitutionally required recommendation. After passage it goes to the Rajya Sabha, which has fourteen days to return recommendations. The Lok Sabha may accept or reject those recommendations. If it is not returned within the stipulated period, the constitutional deemed-passage rule operates.",
			"The important trap is the word money. A bill is not a Money Bill merely because implementing it costs money or because it concerns an economic issue. Classification depends on the constitutional definition, including the conditions in Article 110. Other financial legislation can follow a different procedure. Learn the definition before learning a flowchart.",
			"Original application: a proposed law creates a new regulatory board with salaried staff. The expenditure implication alone does not establish that it is a Money Bill. Ask what provisions the bill contains and which constitutional category actually applies. An answer should analyse classification before stating what the Rajya Sabha may do.",
		],
		[
			"5. Control operates throughout the policy cycle",
			"जवाबदेही नीति बनाते समय, लागू करते समय और खर्च के बाद भी जरूरी है।",
			"NCERT: How does the Parliament control the executive?; Instruments of Parliamentary Control",
			"Before action, Parliament can examine proposals and refuse or amend legislative authority. During implementation, questions and debates can demand information and expose problems. After expenditure, scrutiny of accounts and audit findings can investigate whether public resources were used lawfully and effectively. These are complementary controls, not substitutes for one another.",
			"Question Hour seeks ministerial information and explanations through the relevant House procedures. Zero Hour provides a different opportunity for raising matters, and should not be treated as identical to Question Hour. A no-confidence motion in the Lok Sabha concerns the government's continuing political responsibility; criticism in the Rajya Sabha does not have the same effect of removing the Council of Ministers.",
			"A disciplined majority can make defeat of a government unlikely, but that does not make questions, debate or committees useless. Public explanation, a written record, evidence gathering and the possibility of policy revision remain important. Conversely, the existence of formal devices is not proof they work well: time, attendance, information and political incentives affect scrutiny.",
		],
		[
			"6. Financial control is also policy control",
			"बजट केवल लेखा नहीं, सार्वजनिक प्राथमिकताओं का चुनाव है।",
			"NCERT: Financial Function; Financial control",
			"Allocating money among health, transport, defence and other services expresses policy choices. Legislative control over taxation and expenditure therefore helps control the government's priorities, not merely its arithmetic. The budget process provides an opportunity to ask whether the claimed objective, financial allocation and administrative capacity fit one another.",
			"Differentiate authorisation from audit. Permission to spend is an earlier decision; examining what was actually spent and achieved is a later exercise. A project can be legally authorised and still be poorly implemented. Equally, an administrative saving is not automatically evidence of good performance if the intended service was never delivered. Connect Parliament's financial role to the Budgeting chapter in Economy.",
		],
		[
			"7. Privilege protects the institution's work",
			"विशेषाधिकार का उद्देश्य निर्भीक संसदीय काम है, सामान्य कानून से पूर्ण छूट नहीं।",
			"NCERT: How does the Parliament control the executive?; How does the Parliament regulate itself?",
			"Members need freedom to speak and participate in legislative work without intimidation. Parliamentary privileges support that institutional purpose. They should not be described as a blanket personal immunity from all law for everything a member does inside or outside Parliament. The relevant constitutional protection and its conditions must be identified.",
			"Order in the House matters because meaningful debate requires an opportunity to speak, hear and decide. At the same time, discipline should not be confused with eliminating dissent. A Mains answer can discuss the tension between orderly proceedings, opposition scrutiny and effective legislative time. Exact privilege questions and contemporary bribery-related doctrine require current judgments, not an old general textbook formula.",
		],
		[
			"8. Evaluate parliamentary performance with better questions",
			"कितने कानून बने के साथ यह भी पूछें कि उनकी जाँच कैसे हुई।",
			"NCERT: Legislature chapter; original synthesis",
			"Useful evaluation questions include: Was sufficient time available? Were the reasons for the proposal explained? Could members examine evidence? Were committees used appropriately? Were government responses to questions and reports meaningful? Did scrutiny produce changes? These questions distinguish quality from mere volume of activity.",
			"A reform answer should connect a proposal to a problem. Better research support can address information asymmetry; predictable sitting time can improve scrutiny; clearer follow-up on committee recommendations can improve accountability. None alone guarantees good legislation. The balance of party discipline, representative judgment and executive responsibility requires a reasoned institutional analysis rather than a slogan.",
		],
	],
);
chapter(
	"pe-p23",
	["legislature"],
	[
		[
			"1. Why detailed work moves into committees",
			"समिति छोटे समूह में गहन अध्ययन का अवसर देती है।",
			"NCERT: What do the Committees of Parliament do?",
			"The full House has limited time and many competing issues. A committee can examine documents, hear relevant perspectives and study technical detail more intensively. This is particularly useful for complicated legislation, demands for grants and review of expenditure. Calling committees miniature legislatures describes their deliberative contribution; it does not mean they replace Parliament's constitutional authority.",
			"Committee work can reduce the information advantage of the executive, but only when members receive useful evidence and have time to examine it. A report containing recommendations is not the same as an enacted law. The House, government and relevant institutions must take the subsequent steps within their respective powers.",
		],
		[
			"2. Distinguish the institution, the task and the result",
			"स्थायी या अस्थायी होना और रिपोर्ट का कानूनी प्रभाव अलग बातें हैं।",
			"NCERT: What do the Committees of Parliament do?",
			"Standing committees provide continuing arrangements for recurring work. Ad hoc committees are constituted for a specific purpose and cease according to their mandate. A joint committee draws members from both Houses; the word joint does not, by itself, tell you whether its task concerns a particular bill or an investigation.",
			"For any named committee, make a five-column note: how it is constituted, who may serve, what it examines, what powers or procedures support the examination and what happens after its report. Current membership numbers and exact rules should be checked from the House's official material. An introductory explanation should not invent these particulars merely to fill a table.",
		],
		[
			"3. A committee recommendation needs follow-through",
			"रिपोर्ट की उपयोगिता कार्रवाई और जवाबदेही से बढ़ती है।",
			"NCERT: committee system; original application",
			"Original application: a committee finds that a ministry spent its full allocation but repeatedly failed to complete projects. Useful scrutiny asks about contracting, staffing, delays, outcome measures and responsibility, not only whether the budget total was exhausted. The report can expose the problem; administrative and legislative follow-up determine whether the problem changes.",
			"For Mains, strengths include specialisation, sustained examination and scope for less theatrical discussion. Limitations include uneven referral, limited time or resources and weak follow-up. Avoid claiming that all committee recommendations are legally binding or that the committee itself can substitute for required House approval.",
		],
	],
);
chapter(
	"pe-e02",
	["gdp"],
	[
		[
			"1. GDP measures production during a period",
			"सकल घरेलू उत्पाद एक अवधि के उत्पादन का माप है, कुल संपत्ति का नहीं।",
			"IMF: Measuring GDP",
			"GDP is a flow: it measures the value of final goods and services produced within the domestic economy over a specified period. Wealth is a stock measured at a point in time. A country may have valuable land and buildings but low current output growth; another may increase current production while damaging natural assets. These are different dimensions of economic performance.",
			"The word domestic directs attention to the location of production, not the nationality printed on a company's ownership documents. The word final helps prevent double counting of inputs already embodied in later output. Final use depends on the transaction: a household buying flour to consume and a bakery buying flour to make bread are using the same product differently.",
		],
		[
			"2. Value added prevents the same output being counted repeatedly",
			"हर चरण पर केवल नया जोड़ा गया मूल्य जोड़ें।",
			"IMF: production approach; original worked example",
			"Imagine a deliberately simplified production chain with no other intermediate inputs. A farmer sells grain for ₹100, a mill sells flour for ₹160 and a bakery sells bread to households for ₹250. Adding every sale gives ₹510, but that counts the grain and flour again within the bread. Value added is ₹100 at the farm, ₹60 at the mill and ₹90 at the bakery: together ₹250.",
			"The example assumes all production belongs to the same accounting period and ignores taxes, subsidies, inventory changes and other complications. Its purpose is to explain why intermediate consumption is deducted, not to reproduce a full national-accounts worksheet. If the bakery holds unsold output in inventory, it does not follow that the production simply disappears from accounting; the relevant inventory treatment must be considered.",
		],
		[
			"3. Three approaches describe the same production process",
			"उत्पादन, आय और व्यय एक ही आर्थिक गतिविधि को अलग कोणों से देखते हैं।",
			"IMF: production, expenditure and income approaches",
			"The production approach adds value generated by producers. The income approach examines incomes generated in production, including compensation and operating surplus. The expenditure approach examines final purchases and relevant investment, government and external components. These are conceptually connected because production generates income and final output has a use.",
			"Do not interpret the expenditure approach as adding every cash payment in the economy. A transfer payment is not itself the purchase of newly produced output. Purchasing an existing financial asset is different from producing a new machine. Imports must be handled so that spending on foreign production is not counted as domestic production. Actual statistical estimates can show discrepancies because data sources and measurement are imperfect.",
		],
		[
			"4. Nominal growth and real growth answer different questions",
			"कीमत बढ़ना और उत्पादन बढ़ना अलग-अलग हैं।",
			"IMF: Real GDP; original worked example",
			"Nominal output is valued using current prices. Real measures attempt to separate changes in quantities from changes in prices. In a one-product example, output rises from 100 units at ₹10 to 110 units at ₹12. Nominal value rises from ₹1,000 to ₹1,320, or 32%. At the original price, the second period's output is ₹1,100, so real growth in this simplified example is 10%.",
			"This is why a large increase in nominal GDP does not automatically mean an equally large improvement in actual production. In a many-product economy, aggregation and price measurement require statistical methods rather than one simple multiplication. India's current series, base year and official estimates must be taken from the applicable MoSPI release; this conceptual IMF source is not used to claim a current Indian base year.",
		],
		[
			"5. Gross versus net, and output versus well-being",
			"घिसावट घटाने पर शुद्ध उत्पाद; जीवन की गुणवत्ता के लिए अतिरिक्त माप चाहिए।",
			"IMF: Measuring GDP; Real GDP; original analytical application",
			"Gross measures do not deduct consumption of fixed capital. Subtracting the relevant depreciation gives a net measure. Do not confuse this adjustment with subtracting imports, taxes or interest: each belongs to a different accounting question. A useful revision habit is to write beside every formula what conceptual boundary the adjustment changes.",
			"GDP is valuable for tracking production, but a production total is not a complete account of distribution, unpaid care, environmental damage or quality of life. Even real output growth can coexist with weak employment opportunities for particular groups. A responsible answer therefore uses GDP for the question it measures and supplements it with appropriate employment, distributional, health, educational or environmental evidence for broader development questions.",
		],
	],
);
chapter(
	"pe-e05",
	["rbi"],
	[
		[
			"1. Start with the policy problem, not a list of abbreviations",
			"मौद्रिक नीति का मुख्य उद्देश्य मूल्य स्थिरता है, वृद्धि को ध्यान में रखते हुए।",
			"RBI: Monetary Policy Framework",
			"Monetary policy influences financial conditions to support price stability while keeping growth in mind. Prices that rise rapidly and unpredictably make it harder for households to budget and businesses to plan. Yet suppressing demand too aggressively can also weaken output and employment. The policy problem involves uncertainty, lags and trade-offs rather than a mechanical promise to raise growth and reduce inflation immediately.",
			"In flexible inflation targeting, a numerical target and tolerance range provide an anchor for expectations and accountability. The RBI overview consulted on 19 September 2026 reports a 4% CPI inflation target with a 2–6% tolerance band for April 2026 to March 2031. Treat this as a dated framework statement, not an eternal constitutional number. A target concerns the rate of inflation; it does not mean every product must rise by exactly 4%.",
		],
		[
			"2. The MPC decides the policy rate; implementation follows",
			"नीतिगत दर का निर्णय और रोजमर्रा की तरलता व्यवस्था अलग चरण हैं।",
			"RBI: Monetary Policy Committee; Implementation of Monetary Policy",
			"The Monetary Policy Committee has six members under the statutory framework. The RBI overview describes at least four meetings each year, a quorum of four and a casting vote for the Governor in the event of a tie. These institutional rules help distinguish a committee decision from the idea that one official informally sets every interest rate in the economy.",
			"The operating framework seeks to keep the weighted average call rate close to the policy repo rate. Actual implementation uses liquidity-management operations and market facilities. Commercial lending rates and deposit rates do not all change by an identical amount on the same day: funding structures, competition, borrower risk and contract terms affect transmission.",
		],
		[
			"3. Repo, SDF and MSF: understand the corridor",
			"रेपो के आसपास अल्पकालिक दरों को दिशा देने वाली व्यवस्था समझें।",
			"RBI: Instruments of Monetary Policy",
			"Repo operations provide liquidity against eligible collateral under the relevant terms. The Standing Deposit Facility absorbs overnight liquidity without collateral and has served as the corridor floor since April 2022. The Marginal Standing Facility provides an overnight borrowing backstop and forms the upper side of the corridor. The policy repo rate sits between the floor and ceiling in the framework described by the RBI.",
			"The corridor gives banks alternatives for placing surplus funds or obtaining short-term liquidity. That helps shape the incentives governing overnight market rates. A common outdated statement says the fixed reverse repo rate is always the current corridor floor. The RBI overview makes clear why a student must distinguish an older diagram from the framework after introduction of the SDF. No live policy-rate quotation is embedded here because rates can change.",
		],
		[
			"4. CRR and SLR are different requirements",
			"नकद आरक्षित अनुपात और सांविधिक तरलता अनुपात को एक न समझें।",
			"RBI: Cash Reserve Ratio; Statutory Liquidity Ratio",
			"CRR concerns the prescribed cash balance that banks maintain with the RBI relative to the relevant demand and time liabilities. SLR concerns the prescribed holding of eligible liquid assets in India, such as the qualifying cash, gold and approved securities specified by the framework. The location, eligible assets and purpose of the requirements therefore differ.",
			"An increase in a reserve requirement can affect how a bank allocates its balance sheet, but avoid claiming an exact one-for-one change in economy-wide lending without assumptions. Bank credit also depends on capital, borrower demand, creditworthiness, funding and risk appetite. The textbook reserve multiplier is a simplified model, not a guarantee that every rupee of reserves mechanically produces a fixed amount of actual lending.",
		],
		[
			"5. Open-market operations are not the same as repo transactions",
			"सरकारी प्रतिभूतियों की सीधी खरीद-बिक्री और अस्थायी लेनदेन अलग हैं।",
			"RBI: Open Market Operations; Repo operations",
			"An outright RBI purchase of government securities injects liquidity into the banking system, while an outright sale absorbs it, other things equal. Repo arrangements involve a different transaction structure and are used for liquidity provision on the applicable terms. Do not identify instruments only by whether government securities appear in the transaction; the legal and financial structure matters.",
			"Original application: if banks face a temporary settlement-related liquidity shortage, a short-term operation addresses a different problem from a persistent system-wide liquidity deficit. Also distinguish banking-system liquidity from the solvency of an individual institution. Access to temporary funds cannot by itself repair losses that have eroded an institution's capital.",
		],
		[
			"6. Trace transmission before predicting the result",
			"दर बदलने से खर्च और कीमतों तक असर पहुँचने में समय लगता है।",
			"RBI: Monetary Policy Framework and implementation; original analytical application",
			"A simplified tightening chain runs from a higher policy rate to tighter financial conditions, more expensive or less accessible borrowing, moderation in interest-sensitive spending and eventually reduced pressure on prices. Several links may be weak or delayed. Existing fixed-rate loans, abundant liquidity, bank balance-sheet conditions and expectations can change the speed of transmission.",
			"A crop failure raises food prices through supply, not simply excessive borrowing. Monetary policy cannot directly create rainfall or new vegetables. It can still influence broader demand and the risk that a temporary shock feeds into persistent expectations and wider price increases. A Mains answer should distinguish the source of inflation and explain the role of supply-side and fiscal measures alongside monetary policy.",
		],
		[
			"7. Accountability is more than observing one monthly number",
			"एक महीने की महँगाई और औपचारिक लक्ष्य-विफलता एक बात नहीं हैं।",
			"RBI: inflation-target failure definition; transparency and communication",
			"Under the framework described on the RBI page, failure is assessed when average inflation lies outside the tolerance range for three consecutive quarters. The required report to government addresses reasons, proposed remedial action and the expected time to return inflation to target. A single monthly observation outside the band is therefore not identical to formal failure under that definition.",
			"Policy statements, minutes and the Monetary Policy Report support transparency. Communication helps people understand why a decision was made, what risks were considered and how policy might respond to incoming evidence. For Prelims, distinguish the policy objective, decision-making body, operating target, instruments and accountability mechanism. For Mains, connect credibility to consistent explanation and realistic recognition of uncertainty.",
		],
	],
);
chapter(
	"pe-e09",
	["budget"],
	[
		[
			"1. Read a budget as a financing plan",
			"बजट बताता है पैसा कहाँ से आएगा और कहाँ खर्च होगा।",
			"Budget at a Glance 2026–27: opening explanation and receipts/expenditure table",
			"A budget combines policy choices with accounting categories. Start with expenditure, then ask how it is financed through revenue receipts, non-debt capital receipts and borrowing. Borrowing is not ordinary income earned without a future obligation. Separating it from other receipts allows the fiscal deficit to show the financing gap rather than making the budget appear balanced simply because loans were counted as income.",
			"Revenue receipts include tax and non-tax flows that do not have the same balance-sheet effect as borrowing or disposal of an asset. Non-debt capital receipts include items such as recovery of loans and other non-debt receipts. A loan recovery brings back an existing financial asset; it should not be casually described as a new tax. Read the exact budget classification instead of classifying every receipt as revenue.",
		],
		[
			"2. Four deficits, four questions",
			"राजकोषीय, राजस्व, प्रभावी राजस्व और प्राथमिक घाटा अलग प्रश्न पूछते हैं।",
			"Budget at a Glance 2026–27: deficit definitions",
			"Fiscal deficit equals total expenditure minus receipts other than debt capital receipts. Revenue deficit equals revenue expenditure minus revenue receipts. Primary deficit equals fiscal deficit minus interest payments. Effective revenue deficit equals revenue deficit minus grants for creation of capital assets. Learn the reason for each subtraction, not just the abbreviation.",
			"Primary deficit helps separate current borrowing needs from the interest burden on past debt. Effective revenue deficit recognises that certain grants are booked as revenue expenditure even though the recipient uses them to create capital assets. It does not mean all revenue expenditure is wasteful: teachers' salaries, maintenance and health services can be essential even when they do not appear as direct capital expenditure.",
		],
		[
			"3. Worked example from the 2026–27 Budget Estimates",
			"ये 2026–27 के बजट अनुमान हैं, वास्तविक अंतिम खर्च नहीं।",
			"Budget at a Glance 2026–27: BE column; all amounts in ₹ crore",
			"The consulted table gives total expenditure of ₹53,47,315 crore, revenue receipts of ₹35,33,150 crore, recovery of loans of ₹38,397 crore and other non-debt receipts of ₹80,000 crore. Add the three non-debt receipt components: ₹35,33,150 + ₹38,397 + ₹80,000 = ₹36,51,547 crore. Subtract this from expenditure: ₹53,47,315 − ₹36,51,547 = ₹16,95,768 crore fiscal deficit.",
			"The same Budget Estimates column gives interest payments of ₹14,03,972 crore. Therefore primary deficit = ₹16,95,768 − ₹14,03,972 = ₹2,91,796 crore. The published ratios are 4.3% of GDP for fiscal deficit and 0.7% for primary deficit. Those percentages are dated budget estimates and are rounded; do not use them as a timeless definition or as evidence of final realised accounts.",
			"The arithmetic also reveals meaning. A substantial part of the financing gap is associated with interest on existing debt. Subtracting interest does not make that obligation disappear; it isolates a different analytical measure. Always write the unit and the estimate type when reproducing a budget figure.",
		],
		[
			"4. BE, RE and actuals must not be mixed",
			"बजट अनुमान, संशोधित अनुमान और वास्तविक आँकड़े अलग स्तंभ हैं।",
			"Budget at a Glance 2026–27: table column headings",
			"Budget Estimates are the government's initial plan for the relevant financial year. Revised Estimates update expectations during the year. Actuals record the realised outcomes for the completed period represented in the accounts. In the consulted table, actuals for 2024–25, BE and RE for 2025–26 and BE for 2026–27 appear side by side.",
			"A comparison can be meaningful only when its basis is stated. Growth from the previous year's BE can differ from growth over the previous year's RE, especially if spending fell short of the original allocation. Original application: if a programme had BE 100, RE 80 and next-year BE 100, the new allocation is unchanged relative to the old plan but 25% above the revised estimate. Neither percentage should be presented without its comparison base.",
		],
		[
			"5. Capital expenditure is important, but classification is not a verdict",
			"पूँजीगत वर्गीकरण और खर्च की गुणवत्ता एक ही बात नहीं हैं।",
			"Budget at a Glance 2026–27: effective capital expenditure definition; original application",
			"Effective capital expenditure adds capital expenditure and grants for creation of capital assets. This addresses the distinction between the Union's accounting classification and assets created by recipients of its grants. It helps explain why looking at a single expenditure line can miss part of the investment effort.",
			"Still, an asset can be badly chosen, delayed or poorly maintained. Meanwhile, some revenue spending makes existing assets useful: a hospital building needs staff, medicines, electricity and maintenance. A good answer evaluates project selection, completion, complementary services and outcomes. 'Capital good, revenue bad' is not an adequate public-finance analysis.",
		],
		[
			"6. Evaluate a deficit through context and sustainability",
			"घाटे का आकार, कारण, उपयोग और वित्तपोषण साथ देखें।",
			"Budget definitions; original economic application rather than a claim from the budget table",
			"A deficit is an accounting measure; its economic significance depends on circumstances. Borrowing for productive capacity during weak demand can have different consequences from persistent borrowing that finances ineffective expenditure when inflation pressures are already high. The financing cost, maturity structure, growth prospects and credibility of future policy also matter.",
			"Do not confuse a deficit, which is a flow over a period, with public debt, which is a stock at a point in time. Nor should a primary balance be interpreted as the disappearance of debt or interest. For Mains, separate the immediate stabilisation role of fiscal policy from the medium-term need to manage obligations and improve the quality of public spending.",
		],
	],
);
chapter(
	"pe-e12",
	["wto"],
	[
		[
			"1. MFN is a rule against arbitrary discrimination among partners",
			"सर्वाधिक अनुकूल राष्ट्र सामान्यतः समान व्यापारिक व्यवहार का नियम है।",
			"WTO: Trade without discrimination; Most-favoured-nation treatment",
			"Most-favoured-nation treatment generally requires that a trade advantage offered to one member be extended to other members in the relevant agreement's setting. The name can mislead: it is not simply a special friendship label reserved for a single favourite country. Its purpose is to limit discrimination among trading partners.",
			"The rule has conditional exceptions, including qualifying regional trade agreements and certain preferences for developing countries. Trade-remedy measures also operate under their own legal conditions. Therefore both 'MFN forbids every exception' and 'a government can discriminate whenever it wishes' are misleading. The actual agreement and exception must be identified.",
		],
		[
			"2. National treatment asks what happens after market entry",
			"राष्ट्रीय व्यवहार का प्रश्न घरेलू बाजार में आयातित और स्थानीय वस्तुओं के व्यवहार से जुड़ता है।",
			"WTO: National treatment",
			"National treatment concerns the comparison between foreign and domestic products or covered interests once the relevant market-entry stage has been crossed. For goods, the central idea is that internal taxes and regulation should not be manipulated to undermine the treatment required by the agreement. This is different from MFN, which compares treatment among foreign trading partners.",
			"An import duty at the border does not, by itself, violate national treatment merely because an identical duty is not imposed on domestic goods. The tariff must instead be assessed under the relevant tariff commitments and other rules. Original example: distinguish a customs tariff on imported shoes from an internal tax designed to burden imported shoes more heavily after import. The two measures raise different legal questions.",
		],
		[
			"3. Bound and applied tariffs are not synonyms",
			"बद्ध शुल्क सीमा और वास्तव में लगाया गया शुल्क अलग हो सकते हैं।",
			"WTO: Predictability through binding and transparency",
			"A bound tariff is a committed ceiling in the relevant schedule. An applied tariff is the rate actually used. A country may apply a rate below its bound level, leaving a difference between current policy and its ceiling. The existence of a binding therefore does not automatically mean the applied tariff is zero.",
			"Original numerical example: assume a product has a bound rate of 40% and an applied rate of 15%. Those figures describe different things. Whether and how a change is permitted requires considering the commitment and other applicable obligations, not merely declaring that all tariff increases breach WTO rules. Exceeding a binding raises a different problem from changing an applied rate within the binding.",
		],
		[
			"4. Predictability can matter as much as today's tariff",
			"व्यापार में स्थिर और पारदर्शी नियम निवेश के निर्णयों में मदद करते हैं।",
			"WTO: Predictability; transparency",
			"A producer deciding whether to invest in an export facility cares about the reliability of market access, not only the tariff today. Published rules, notification requirements and bindings can reduce uncertainty. Sudden opaque changes may discourage investment even when a market briefly offers a low tariff.",
			"This helps explain why WTO principles are not adequately described as simply 'free trade'. The system permits tariffs in many circumstances while seeking commitments, transparency, progressive liberalisation and rules against specified discriminatory or unfair practices. Predictability is a distinct institutional benefit, not proof that every trade barrier has been eliminated.",
		],
		[
			"5. Goods, services and intellectual property have different rules",
			"GATT, GATS और TRIPS को एक ही समझौता न मानें।",
			"WTO: principles discussion of GATT, GATS and TRIPS",
			"GATT concerns trade in goods, GATS concerns services and TRIPS concerns intellectual property. Familiar ideas such as non-discrimination appear across the system, but their legal operation and exceptions differ. A principle stated for goods should not automatically be transplanted into services without examining the agreement and commitments.",
			"For services, sectoral commitments and the relevant mode of supply matter. For intellectual property, the issue may concern protection and treatment rather than a tariff on a physical product. A strong Prelims approach first identifies the agreement and subject; a strong Mains approach explains why differing sectors require differing commitments instead of treating WTO law as one universal zero-barrier rule.",
		],
		[
			"6. Development flexibilities and domestic adjustment",
			"व्यापार खुलने के लाभ और समायोजन की लागत का वितरण देखें।",
			"WTO: encouraging development and economic reform; original analytical application",
			"The WTO overview recognises that developing economies may need flexibility and time in implementing commitments. These provisions must be read as specific legal arrangements, not as a blanket exemption from every obligation. Likewise, participation in a rules-based trading system does not guarantee that every region or worker gains equally from every change.",
			"For an original Mains application, evaluate a tariff reduction through several channels: consumer prices, imported input costs, competition for domestic firms, export opportunities and the capacity of workers and firms to adjust. Complementary skills, infrastructure and social protection can affect the outcome. Do not claim that protection always creates efficiency or that immediate liberalisation has no adjustment costs.",
		],
	],
);
