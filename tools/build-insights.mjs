// Generates the static /insights/ pages (landing + one article per episode).
// Run from repo root:  node tools/build-insights.mjs
// Content lives in INSIGHTS below; add an entry when a new episode drops, re-run, commit.
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const SITE = "https://www.theteslapod.com";
const IMG_HOST = "https://teslapod.vercel.app"; // resolvable today; canonical domain flips later

const INSIGHTS = [
  {
    slug: "ai-secondhand-clothing-supply-chain-fleek",
    ep: 9, id: "AR18l-xBY6Q", date: "2026-07-26", dateHuman: "Jul 26, 2026", duration: "59:24",
    guest: "Sanket Agarwal", role: "Cofounder @ Fleek (YC W22)", company: "Fleek",
    title: "The $25M Bet on What Happens to Your <em>Old Clothes</em>",
    seoTitle: "How Fleek's AI Is Rebuilding the Secondhand Clothing Trade — Sanket Agarwal | The Tesla Pod",
    seoDesc: "Fleek raised $25M to fix what happens to donated clothes. Sanket Agarwal on the offline global secondhand supply chain, and teaching a vision model to grade used garments from one photo. Insights from The Tesla Pod, the Tesla podcast.",
    keywords: "secondhand clothing supply chain, Fleek, Sanket Agarwal, AI clothing grading, vision language model resale, B2B secondhand marketplace, textile waste AI, circular fashion technology, Fleek Series B",
    hook: "A donated t-shirt crosses continents by hand. Fleek is teaching AI to grade it.",
    sub: "Most people have no idea where their donated clothes actually go. Sanket Agarwal spent his early career at Google before co-founding Fleek — the AI infrastructure behind the global secondhand clothing trade. This ride follows a single t-shirt from a London donation bin to a vintage rack in New York, and asks what happens when you point modern AI at one of the world's largest offline supply chains.",
    bigIdea: [
      "The journey is the revelation: a shirt dropped in a London donation bin can travel thousands of miles, get sorted by hand in a warehouse in Karachi or Dubai, and — if it's lucky — end up on a rack in a New York vintage store. Billions of garments a year move through this system, and almost all of it runs on human judgment, phone calls, and paper. It's one of the largest physical supply chains on earth with almost no software in it.",
      "Fleek's insight is that the marketplace isn't the hard part — the grading is. Deciding what a used garment is, what condition it's in, and what it's worth has always required a trained human eye. Fleek Sort, their custom vision-language model, does it from a single photo. Own the grading layer and you own the primitive the entire trade depends on."
    ],
    takeaways: [
      "<b>The world's biggest offline markets are the real AI opportunity.</b> Secondhand clothing moves billions of items a year on human judgment alone — a bigger prize than another SaaS category.",
      "<b>Grading beats the marketplace.</b> Marketplaces get commoditized; the hard, defensible layer is the model that can identify, grade, and price a garment from one photo.",
      "<b>Teaching AI expert taste is the core technical problem.</b> Fleek Sort has to replicate what a veteran sorter knows by feel — brand, era, condition, resale value — from pixels.",
      "<b>Liquidity is the product for both sides.</b> 2,000+ suppliers matched to 50,000+ buyers across 100+ countries turns a fragmented trade into something that clears.",
      "<b>Efficiency and sustainability aren't the same thing.</b> The episode presses on whether better routing genuinely reduces textile waste — or just moves it faster.",
      "<b>Google-scale engineering, applied to warehouses.</b> Sanket's bet is that the leverage is no longer in more digital infrastructure, but in bringing it to industries that never had any."
    ],
    themes: [
      { h: "Where your donated clothes actually go", p: "The ride traces the real path — donation bin, baler, container ship, hand-sorting floor in Karachi or Dubai, wholesaler, vintage store — and explains why so much value evaporates at each undocumented handoff." },
      { h: "Teaching a model to grade like a 20-year veteran", p: "What it takes to build Fleek Sort: capturing expert judgment as training signal, handling infinite long-tail brands and defects, and earning enough trust that wholesalers will price real inventory on a model's word." },
      { h: "Does technology fix waste, or just accelerate it?", p: "The most uncomfortable question in the episode. Better matching means fewer garments landfilled for want of a buyer — but a more efficient resale engine also sustains the volume that created the problem. Sanket doesn't dodge it." },
      { h: "A $25M Series B in an unglamorous market", p: "Burda led, with eBay, FJ Labs, Andreessen Horowitz and Y Combinator behind it, taking Fleek to $45M total. The conversation covers why investors who normally chase software got interested in bales of used clothing." }
    ],
    about: "Fleek is the AI infrastructure powering the global secondhand clothing trade: a B2B marketplace connecting used-clothing wholesalers and graders with vintage stores and resellers, plus Fleek Sort — a custom vision-language model that identifies, grades, and prices a used garment from a single photo. Co-founded by Sanket Agarwal (ex-Google), Fleek raised a $25M Series B led by Burda with eBay, FJ Labs, Andreessen Horowitz and Y Combinator participating, bringing total funding to $45M. It connects over 2,000 suppliers with more than 50,000 buyers across 100-plus countries.",
    whyNow: "Vision-language models only recently got good enough to judge messy physical goods from a single photo — which is exactly what a used-garment grader does. At the same time, resale is the fastest-growing part of fashion and regulators are tightening textile-waste rules. The capability and the demand arrived in the same window, and whoever builds the grading standard now sets it for the whole trade.",
    numbers: [
      { n: "$25M", l: "Series B, led by Burda" },
      { n: "$45M", l: "total funding to date" },
      { n: "2,000+", l: "suppliers on the marketplace" },
      { n: "50,000+", l: "buyers across the trade" },
      { n: "100+", l: "countries connected" },
      { n: "1", l: "photo to grade a garment" }
    ],
    autonomyLens: "Strip away the fashion and Fleek is solving the same problem as the car this conversation was recorded in. Grading a used garment from a photo is perception → judgment → action: read a messy real-world scene, classify it against expert priors, commit to a decision with money on the line. FSD had to replicate a driver's trained intuition from pixels; Fleek Sort has to replicate a veteran sorter's. And like autonomy, the moat isn't the model — it's the years of expert-labeled edge cases nobody else has.",
    counter: {
      claim: "Secondhand clothing is a low-margin, hopelessly fragmented physical trade. Software companies have died in markets like this — you can't code your way around bales, customs, and hand-sorting warehouses.",
      response: "The episode's answer is that Fleek isn't trying to digitize the logistics — it's digitizing the judgment. Grading is the one step where value concentrates: it decides what every garment is worth before it moves. Own that layer with a model, and the fragmented physical trade organizes itself around your standard, the way shipping organized around the container. The $25M Series B, from investors who normally avoid physical trades, is a bet that the grading layer has software margins even if the garments never do."
    },
    faq: [
      { q: "What happens to clothes after you donate them?", a: "Most donated clothing doesn't stay local. It's baled and shipped abroad — often to hand-sorting warehouses in places like Karachi or Dubai — where workers grade it by quality. The best pieces are resold to vintage stores and resellers worldwide; the rest is downcycled into rags or landfilled." },
      { q: "What is Fleek?", a: "Fleek is the AI infrastructure behind the global secondhand clothing trade. It runs a B2B marketplace connecting used-clothing wholesalers and graders with vintage stores and resellers, and built Fleek Sort, a vision-language model that grades and prices used garments from a photo. Co-founded by Sanket Agarwal, it raised a $25M Series B in 2026." },
      { q: "How does AI grade used clothing?", a: "A vision-language model trained on expert human grading learns to read a garment from a single image — identifying brand and era, spotting wear and defects, assigning a condition grade, and estimating resale price. It replaces judgment that previously existed only in experienced sorters' heads." },
      { q: "Who invested in Fleek's $25M Series B?", a: "Fleek's $25M Series B was led by Burda, with participation from eBay, FJ Labs, Andreessen Horowitz, and Y Combinator. It brought the company's total funding to $45M." }
    ]
  },
  {
    slug: "ai-agent-swarms-security-jason-jin",
    ep: 8, id: "4FtPxcSjpF8", date: "2026-07-06", dateHuman: "Jul 6, 2026", duration: "45:24",
    guest: "Jason Jin", role: "Founder @ Funky (ex-Google)", company: "Funky",
    title: "Agent Swarms, Sandboxes, and the Coming Security War for <em>AI agents</em>",
    seoTitle: "AI Agent Swarms & Agent Security — Insights from Jason Jin (ex-Google) | The Tesla Pod",
    seoDesc: "Why the next platform shift is hundreds of sandboxed AI agents per API call — and why agent-vs-agent security becomes the defining problem. Insights from Jason Jin of Funky on The Tesla Pod, the Tesla podcast.",
    keywords: "AI agent swarms, sandboxed AI agents, AI agent security, Funky API, Jason Jin, ex-Google founder, multi-agent systems, prompt injection defense",
    hook: "Hundreds of agents from one API call — and attacker agents already probing them.",
    sub: "Jason Jin spent six years at Google building a logs system that processed over an exabyte of data a day. Then he left to build Funky — one API call that spins up hundreds of AI agents, each in its own sandbox. This ride covers what changes when agents stop being a demo and start being infrastructure.",
    bigIdea: [
      "The conversation lands on a simple inversion: today developers think of an AI agent as a feature you add to an app. Jason's bet is that agents become the workload itself — spun up in swarms, isolated in sandboxes, and orchestrated the way we orchestrate containers today. The unit of compute shifts from \"a model call\" to \"an agent with a job.\"",
      "The most striking part of the episode is the live demo: attacker agents trying to socially engineer a guarded agent into wiring money out of an account. It's a preview of a world where both sides of a fraud attempt are automated — and where defense has to be designed into the agent runtime, not bolted on."
    ],
    takeaways: [
      "<b>Swarms beat single agents for real work.</b> One agent hits context and reliability walls; hundreds of narrow agents, each sandboxed with a small job, compose into something dependable.",
      "<b>Isolation is the primitive that matters.</b> Giving every agent its own sandbox does for agents what containers did for services — it makes failure, abuse, and blast radius manageable.",
      "<b>Agent-vs-agent security is already here.</b> The wire-transfer demo shows adversarial agents probing a guarded agent in real time. Guardrails have to survive automated, persistent social engineering.",
      "<b>Big-company scale teaches small-company speed.</b> An exabyte-a-day logs pipeline at Google taught Jason where infrastructure actually breaks — knowledge he now compresses into a single API.",
      "<b>The leap isn't reckless if the foundation is boring.</b> Leaving Google works when what you're building is the plumbing everyone will need, not a feature someone will copy."
    ],
    themes: [
      { h: "From model calls to agent fleets", p: "The episode frames the shift the way early cloud people framed VMs → containers: the interesting question stops being \"how smart is the model\" and becomes \"how do you launch, watch, and kill ten thousand of them safely.\" Funky's one-call swarm API is a bet that developers want that abstraction, not another chat wrapper." },
      { h: "Security as the defining constraint", p: "If agents can move money, file tickets, and touch production systems, then tricking an agent becomes the new phishing. The ride digs into why deception-resistance — not benchmark scores — will decide which agent platforms enterprises trust." },
      { h: "The ex-Google founder playbook", p: "Six years inside Google's infrastructure taught a specific lesson: the hard problems are operational, not algorithmic. The conversation is a case study in taking scale scars from big tech and turning them into a startup's unfair advantage." }
    ],
    about: "Funky lets developers spin up hundreds of sandboxed AI agents with a single API call. Jason Jin founded it after six years at Google, where he built logging infrastructure processing over an exabyte of data per day.",
    whyNow: "Every major lab shipped agent frameworks this year, and enterprises are moving from pilots to production fleets. The winners of that shift won't be decided by model quality — every team has the same models — but by who solves orchestration, isolation, and deception-resistance first. That's exactly the layer this conversation maps.",
    numbers: [
      { n: "1", l: "API call to launch a swarm" },
      { n: "100s", l: "of sandboxed agents per call" },
      { n: "6", l: "years inside Google infrastructure" },
      { n: "1EB+", l: "of logs processed daily on his last system" }
    ],
    autonomyLens: "One self-driving car is a demo; a fleet is a business — and everything hard about autonomy shows up at fleet scale: monitoring thousands of independent actors, containing the one that misbehaves, learning from every disengagement. Jason's argument lands the same way for agents. A single agent in a chat window is the demo. Funky is building for the fleet era: launch hundreds, watch them all, and treat every sandbox breach attempt the way an AV company treats an intervention — as the signal that improves the whole system.",
    counter: {
      claim: "Swarms are a workaround for weak models. Once frontier models get smart and reliable enough, one capable agent will replace a hundred narrow ones, and the orchestration layer becomes plumbing nobody needs.",
      response: "The ride's rebuttal is that isolation is an operational requirement, not an intelligence gap. Even a superhuman agent needs a blast radius when it's compromised — and the wire-transfer demo shows compromise is an adversarial inevitability, not a capability problem. Companies didn't stop using containers when servers got faster. The smarter agents get, the more they're allowed to touch, and the more the sandbox — not the model — becomes the thing you trust."
    },
    faq: [
      { q: "What is an AI agent swarm?", a: "An AI agent swarm is many narrow, single-purpose AI agents running in parallel on a shared task — instead of one large agent trying to do everything. Each agent gets a small job and its own sandbox, so failures stay contained and the work composes reliably." },
      { q: "Why do AI agents need sandboxes?", a: "Agents take real actions — calling APIs, writing files, moving data. A sandbox limits what each agent can touch, so a compromised or malfunctioning agent has a small blast radius. It's the same reason cloud workloads moved to containers." },
      { q: "What is Funky?", a: "Funky is a developer platform founded by ex-Google engineer Jason Jin: one API call spins up hundreds of AI agents, each in its own sandbox. It treats agents as a scalable workload — like serverless functions, but for autonomous AI work." }
    ]
  },
  {
    slug: "automating-consulting-with-ai-ontora",
    ep: 7, id: "UkzjHmqDMiY", date: "2026-06-14", dateHuman: "Jun 14, 2026", duration: "28:30",
    guest: "David Korn & Leon Iwanowitsch", role: "Cofounders @ Ontora (YC P26)", company: "Ontora",
    title: "Automating the $1 Trillion <em>Consulting</em> Industry in 24 Hours",
    seoTitle: "Automating the $1 Trillion Consulting Industry with AI — Ontora (YC P26) | The Tesla Pod",
    seoDesc: "Fortune 500s pay McKinsey millions and wait months for a deck. Ontora's AI interviews every employee and maps how work actually gets done in 24 hours. Insights from The Tesla Pod, the Tesla podcast.",
    keywords: "AI consulting, automating consulting, Ontora, YC P26, organizational mapping AI, McKinsey alternative, AI employee interviews, enterprise AI",
    hook: "McKinsey takes months and millions. Their AI interviews every employee and delivers in a day.",
    sub: "When a Fortune 500 wants to understand how it actually works, it pays consultants millions and waits months for a slide deck. David, Leon and their cofounder Max built Ontora — an AI agent that interviews every employee, maps how work really gets done, and delivers the answer in 24 hours.",
    bigIdea: [
      "The core insight of this ride: the expensive part of consulting was never the recommendations — it was the data collection. Armies of associates interviewing staff, shadowing workflows, and stitching together how an org actually functions. That's precisely the part an AI agent can do at full coverage instead of a sample, in parallel instead of sequentially.",
      "Interviewing *every* employee changes the product category. A consultant samples twenty people and extrapolates; Ontora talks to everyone and aggregates. The deliverable stops being an opinion and starts being a measurement — an X-ray of the org chart as it really operates, not as it's drawn."
    ],
    takeaways: [
      "<b>Attack the labor, not the logo.</b> Ontora doesn't out-brand McKinsey — it deletes the associate-hours that make consulting cost millions and take months.",
      "<b>Full coverage beats sampling.</b> AI interviews scale to the whole company, converting anecdote-driven org analysis into something closer to instrumentation.",
      "<b>Speed changes what customers ask.</b> A 24-hour turnaround means org mapping becomes a repeatable health check, not a once-a-decade crisis purchase.",
      "<b>Employees tell an AI things they won't tell a consultant.</b> The conversation touches on candor: a neutral interviewer at scale surfaces friction that never reaches a partner's slide deck.",
      "<b>$1T markets hide in unglamorous workflows.</b> The founders found their wedge not in strategy advice but in the grunt work everyone assumed had to be human."
    ],
    themes: [
      { h: "The anatomy of a disruption wedge", p: "The ride walks through why they started with organizational discovery rather than recommendations: it's the highest-cost, lowest-judgment slice of consulting — exactly where AI's parallelism is unbeatable and a brand name matters least." },
      { h: "Trust and candor at machine scale", p: "What happens when the interviewer is an AI? The founders argue coverage plus consistency produces a more honest picture of a company than prestige interviews ever did — and that the map of \"how work actually flows\" is a product every executive quietly wants." },
      { h: "Three founders, one YC batch, no playbook", p: "As a YC P26 company selling into Fortune 500s, Ontora is a live experiment in whether a tiny team with an agent can win deals against firms with fifty-year-old client relationships." }
    ],
    about: "Ontora (YC P26) deploys AI agents that interview every employee in a company and deliver a map of how work actually gets done — in days, not months. Founded by David Korn, Leon Iwanowitsch, and Max.",
    whyNow: "Consulting is a trillion-dollar industry whose core deliverable — understanding how an organization actually works — just became automatable. Meanwhile every Fortune 500 is under pressure to restructure around AI, which means demand for org clarity is spiking at the exact moment the cost of producing it is collapsing.",
    numbers: [
      { n: "$1T", l: "consulting market being attacked" },
      { n: "24h", l: "to map an organization" },
      { n: "100%", l: "of employees interviewed, in parallel" },
      { n: "~20", l: "interviews a traditional engagement samples" }
    ],
    autonomyLens: "A consultant mapping a company works like a car with two cameras and a guess: sparse observations, heavy extrapolation. Ontora's approach is full-sensor coverage — interview every employee and build the map from complete data, the way an AV fuses lidar, radar, and vision instead of trusting one glimpse. And like the maps under FSD, an org map decays: teams reorganize, workflows drift. A 24-hour, repeatable scan turns org understanding from a one-time survey into a live map that stays current.",
    counter: {
      claim: "Fortune 500s don't pay McKinsey for data — they pay for political cover and a brand the board trusts. An AI's org map, however accurate, doesn't give an executive anyone to blame.",
      response: "The founders concede the cover business survives — and argue it's not the business they're taking. The months of associate labor that produce the deck's underlying picture are what's automatable, and firms themselves would rather buy that substrate than staff it. Better: full-coverage candor changes the product. Twenty interviews collected under a partner's letterhead get you the org chart people perform; every employee talking to a neutral AI gets you the org that actually exists. Eventually the cover needs Ontora's map to be credible."
    },
    faq: [
      { q: "Can AI replace management consultants?", a: "AI is replacing the data-collection layer of consulting first: interviewing employees, mapping workflows, and assembling the picture of how a company operates. Judgment and change management stay human for now — but the months of associate work behind a McKinsey deck are already automatable." },
      { q: "What is Ontora?", a: "Ontora (YC P26) is an AI agent that interviews every employee in a company and delivers a map of how work actually gets done — in about 24 hours, versus the months a consulting engagement takes. It was founded by David Korn, Leon Iwanowitsch, and Max." },
      { q: "How does an AI map how a company works?", a: "Instead of sampling twenty employees like a consultant, the AI interviews everyone in parallel, then aggregates the answers into a picture of real workflows, bottlenecks, and dependencies — a measurement of the org as it operates, not as the org chart draws it." }
    ]
  },
  {
    slug: "proactive-ai-copilots-phd-to-yc-logical",
    ep: 6, id: "7_k8UR_5aDc", date: "2026-06-08", dateHuman: "Jun 8, 2026", duration: "31:50",
    guest: "Anushka Idamekorala", role: "Cofounder @ Logical (YC F25)", company: "Logical",
    title: "Dropping a PhD for YC — and Building a Copilot That Helps <em>Before You Ask</em>",
    seoTitle: "Proactive AI Desktop Copilots & Leaving a PhD for YC — Logical (YC F25) | The Tesla Pod",
    seoDesc: "Anushka Idamekorala dropped out of his PhD when a childhood friend called with an idea. Now Logical (YC F25) builds a proactive desktop copilot that learns your patterns and helps before you ask. The Tesla Pod insights.",
    keywords: "proactive AI copilot, desktop AI assistant, Logical YC F25, PhD dropout startup, Anushka Idamekorala, AI that anticipates, Clippy but good",
    hook: "Reactive chatbots wait for prompts. The next copilots watch, learn, and act first.",
    sub: "Anushka Idamekorala walked away from his PhD when his childhood friend Sam called with an idea. Now they're building Logical — a proactive desktop copilot that watches how you work, learns your patterns, and helps before you ask.",
    bigIdea: [
      "Every mainstream AI assistant today is reactive: it does nothing until you type a prompt. This episode makes the case that the real interface unlock is proactivity — software that observes your workflow long enough to predict the next fifteen minutes and quietly does the prep work. \"Clippy, but actually good\" is the joke; ambient competence is the product.",
      "The other thread is a life decision: what makes it rational to abandon a PhD mid-stream? Anushka's answer is about timing and people — the window for desktop-level AI assistance is open now, and the cofounder who calls you is a childhood friend you already trust. Credentials can wait; windows don't."
    ],
    takeaways: [
      "<b>Proactive beats reactive.</b> The prompt box is a bottleneck — a copilot that sees your screen context can act on intent you never had to articulate.",
      "<b>Patterns are the product.</b> Logical's moat is longitudinal: the longer it watches how you work, the better its anticipation — a data flywheel no fresh chatbot session can match.",
      "<b>Trust is the hard part of ambient AI.</b> Watching a user's desktop demands radical clarity about what's observed, stored, and acted on. The founders treat that as a design problem, not a legal footnote.",
      "<b>Leave when the window opens, not when the thesis ends.</b> A PhD restarts; a platform shift doesn't. Anushka framed dropping out as choosing the education you can't defer.",
      "<b>Found with someone you've known forever.</b> A childhood-friend cofounder means conflict resolution is pre-built — the rarest startup asset."
    ],
    themes: [
      { h: "The post-prompt interface", p: "The ride explores what UI even means when the assistant initiates: suggestions that appear mid-task, drafts that exist before you open the doc, context switches it smooths over. The bet is that the winning copilot will feel less like chat and more like a great chief of staff." },
      { h: "Risk, credentials, and the dropout calculus", p: "A candid look at trading a doctorate for YC F25 — how the decision actually got made, what the advisor said, and why \"you can always go back\" is both true and beside the point." },
      { h: "Building on the desktop, not in the browser tab", p: "Owning the OS-level view of a user's day is technically harder and strategically stronger than another web app — the conversation digs into that trade-off." }
    ],
    about: "Logical (YC F25) is a proactive desktop copilot — it watches how you work, learns your patterns, and helps before you ask. Founded by Anushka Idamekorala and his childhood friend Sam.",
    whyNow: "Chat-based AI has hit an interface ceiling: the model is capable, but it only acts when prompted, and most of your context never makes it into the prompt box. Desktop-level, always-on assistance is the obvious next layer — and the race to own it is happening now, before the platforms lock it down themselves.",
    numbers: [
      { n: "0", l: "prompts needed before it helps" },
      { n: "2", l: "childhood friends, one company" },
      { n: "1", l: "PhD walked away from" },
      { n: "F25", l: "Y Combinator batch" }
    ],
    autonomyLens: "The prompt box is a steering wheel: the AI does nothing until you turn it. Logical's bet is the same one Tesla made about driving — that the machine watching continuously can act better than the human commanding intermittently. And the trust model transfers too. FSD earned autonomy in stages: first it watched, then it assisted, then it drove with supervision. A desktop copilot has to climb the identical ladder — observe your patterns, suggest, then act — with every good intervention buying permission for the next level.",
    counter: {
      claim: "Nobody wants software watching their screen all day. The privacy objection killed ambient assistants before, and 'Clippy but good' still means an interruption engine.",
      response: "Anushka's response is that the objection is about trust architecture, not observation itself — people already let keyboards, browsers, and IDEs watch everything they type in exchange for autocomplete. The bar is that watching must produce obvious, immediate value, and that what's observed stays legible and controllable. As for interruption: Clippy failed because it guessed from nothing. A copilot that has genuinely learned your patterns interrupts the way a great chief of staff does — rarely, and about the thing you were about to need."
    },
    faq: [
      { q: "What is a proactive AI copilot?", a: "A proactive AI copilot acts before you ask. Instead of waiting for a prompt, it observes your work context — the apps, documents, and patterns of your day — and prepares drafts, suggestions, and next steps at the moment you need them." },
      { q: "Is it worth dropping out of a PhD for a startup?", a: "Anushka Idamekorala's framing on the episode: a PhD can be resumed; a platform shift can't be deferred. When a rare market window opens and you have a cofounder you trust completely, the risk calculus favors the startup — especially early in life, when downside is smallest." },
      { q: "What is Logical (YC F25)?", a: "Logical is a Y Combinator F25 startup building a proactive desktop copilot that watches how you work, learns your patterns, and helps before you ask — 'Clippy, but actually good.' It was founded by Anushka Idamekorala and his childhood friend Sam." }
    ]
  },
  {
    slug: "agentic-browsing-self-driving-browser-retriever-ai",
    ep: 5, id: "ChwI4UyEGqM", date: "2026-05-31", dateHuman: "May 31, 2026", duration: "41:55",
    guest: "Arjun Chintapalli & Bhavani Kalisetty", role: "Cofounders @ Retriever AI", company: "Retriever AI",
    title: "Your Browser Is About to <em>Drive Itself</em>",
    seoTitle: "Agentic Browsing: Why Your Browser Is About to Drive Itself — Retriever AI | The Tesla Pod",
    seoDesc: "Arjun Chintapalli and Bhavani Kalisetty of Retriever AI (rtrvr.ai) on agentic browsing — an AI that navigates and acts on the web for you. Recorded in a self-driving Tesla. The Tesla Pod insights.",
    keywords: "agentic browsing, AI browser agent, Retriever AI, rtrvr.ai, web automation AI, browser that drives itself, autonomous web agents",
    hook: "The perfect metaphor: an AI browsing the web for you, discussed inside a car driving itself.",
    sub: "Arjun Chintapalli and Bhavani Kalisetty, co-founders of Retriever AI (rtrvr.ai), on agentic browsing — an AI that navigates and acts on the web for you. Discussed, fittingly, while a Tesla navigated San Francisco for them.",
    bigIdea: [
      "The episode's central symmetry writes itself: FSD works because driving is a constrained task with observable state and clear feedback — and browsing has the same shape. Pages are the road, links are turns, forms are intersections. An agent that can perceive the page and plan actions can \"drive\" the web the way FSD drives Lombard Street.",
      "The deeper point is about who browsing is for. Most of what we do online — comparing, booking, filling, checking — is chore traffic, not exploration. Agentic browsing splits the web into experiences you want to have and errands you want done, and quietly automates the second category."
    ],
    takeaways: [
      "<b>Browsing has a self-driving equivalent.</b> Perception (reading the page), planning (choosing actions), execution (clicks and forms) — the FSD loop maps one-to-one onto web tasks.",
      "<b>Errands are the wedge.</b> Nobody wants an AI to read their favorite blog; everyone wants one to handle the seventeen-tab comparison shop. Retriever targets the web's chore layer.",
      "<b>The hard part is the long tail.</b> Like driving, the demo is easy and the edge cases are brutal — broken layouts, logins, CAPTCHAs, ambiguous UI. Reliability, not intelligence, is the product bar.",
      "<b>Supervision is a feature, not a failure.</b> Early FSD keeps a human in the loop; early browsing agents should too. Trust is earned in stages, per task type.",
      "<b>Two technical cofounders, one interface bet.</b> A CEO/CTO pair betting that the browser — not a new app — is where agents meet everyday life."
    ],
    themes: [
      { h: "The FSD-to-browser analogy, stress-tested", p: "The ride pushes the metaphor hard: what's the browsing equivalent of an intervention? Of a disengagement report? The founders' answers sketch how agentic browsing will actually be measured and trusted." },
      { h: "What the web looks like when agents are users", p: "If a meaningful share of traffic becomes agents acting for humans, sites face a choice: fight them or serve them. The conversation explores a near future of agent-readable interfaces and machine-negotiated errands." },
      { h: "Building rtrvr.ai", p: "From naming a company after a dog that fetches, to deciding which verticals' errands to automate first — a look inside the earliest product decisions of an agentic-web startup." }
    ],
    about: "Retriever AI (rtrvr.ai) builds agentic browsing — an AI that navigates and acts on the web for you. Founded by Arjun Chintapalli (CEO) and Bhavani Kalisetty (CTO).",
    whyNow: "Browsers are the most contested territory in AI right now — every major lab and browser vendor is racing to put an agent behind the address bar. The web's chore layer (booking, comparing, form-filling) is enormous, measurable, and monetizable, which makes agentic browsing one of the clearest land-grabs of the platform shift.",
    numbers: [
      { n: "1", l: "stated goal — the agent does the rest" },
      { n: "2", l: "technical cofounders, CEO + CTO" },
      { n: "0", l: "hands on the wheel — in the car or the browser" }
    ],
    autonomyLens: "This is the episode where the show's premise stops being a metaphor and becomes the agenda: an agent that drives the web, discussed inside a car that drives the road. The founders push the mapping all the way down. Perception is reading the DOM; planning is choosing the next click; a CAPTCHA is a construction zone; a broken checkout flow is black ice. Even the safety economics rhyme — an AV is judged by interventions per mile, and a browsing agent will be judged by how many errands finish without a human grabbing the wheel.",
    counter: {
      claim: "The web will fight back. Sites monetize human attention — ads, upsells, dark patterns — and an agent that skips all of it breaks their business model. They'll block agents the way they block bots.",
      response: "The ride's answer is that the same standoff had a precedent: sites once fought search crawlers too, until being crawlable became existential. When a meaningful share of purchasing flows through agents, being agent-hostile means being invisible at the moment of transaction. The founders expect a split web — experience pages built for humans, structured interfaces negotiated with agents — and note that merchants don't actually sell attention. They sell things. Agents arrive with intent and a payment method, which is the traffic sites fight for."
    },
    faq: [
      { q: "What is agentic browsing?", a: "Agentic browsing is an AI operating your web browser for you: reading pages, clicking, filling forms, and completing multi-step tasks like comparisons or bookings. You state the goal; the agent drives the web — the way FSD drives the car while you supervise." },
      { q: "What is Retriever AI?", a: "Retriever AI (rtrvr.ai) is a startup building agentic browsing — an AI that navigates and acts on the web on your behalf. It was founded by Arjun Chintapalli (CEO) and Bhavani Kalisetty (CTO)." },
      { q: "Will AI agents replace manual web browsing?", a: "For errands, largely yes: research-and-book, compare-and-buy, and fill-and-submit tasks are exactly what agents automate first. Browsing you enjoy — reading, watching, exploring — stays human. The episode frames it as splitting the web into experiences and errands." }
    ]
  },
  {
    slug: "ai-customer-success-peazy-labs",
    ep: 4, id: "p7eUWZtrq-0", date: "2026-05-23", dateHuman: "May 23, 2026", duration: "39:14",
    guest: "Komala Chenna & Kushal Murthy", role: "Cofounders @ Peazy Labs", company: "Peazy Labs",
    title: "AI Just Ate <em>Customer Success</em> — What Replaces It",
    seoTitle: "How AI Is Eating Customer Success — Peazy Labs on In-App AI Concierges | The Tesla Pod",
    seoDesc: "Komala Chenna and Kushal Murthy of Peazy Labs on why customer success is being rebuilt as an in-app AI concierge that guides users through complex enterprise software. The Tesla Pod insights.",
    keywords: "AI customer success, in-app AI concierge, Peazy Labs, enterprise software onboarding, AI user guidance, customer success automation, SaaS adoption AI",
    hook: "The CSM role gets unbundled: an AI concierge inside the product, guiding every user.",
    sub: "Komala Chenna and Kushal Murthy, co-founders of Peazy Labs, on how AI is transforming customer success — from a human-driven, ticket-and-call model to an AI concierge that lives inside the product and guides users through complex enterprise software in the moment.",
    bigIdea: [
      "Customer success as we know it is a workaround: enterprise software got so complicated that vendors hired humans to apologize for it, one onboarding call at a time. This ride's thesis is that the CSM function gets unbundled — the repetitive guidance moves into the product itself as an AI concierge that meets users at the exact moment of confusion.",
      "The economics are the quiet star of the conversation. A human CSM covers dozens of accounts and reaches users only after they're stuck enough to complain. An in-app concierge covers every user, in every account, before the ticket exists. Retention work shifts from reactive rescue to ambient guidance."
    ],
    takeaways: [
      "<b>The best support ticket is the one never filed.</b> In-the-moment guidance inside the app removes the confusion → ticket → call loop entirely.",
      "<b>CS doesn't disappear — it gets a promotion.</b> When AI absorbs the how-do-I clicks, human CS moves up-stack to strategy, expansion, and relationships.",
      "<b>Context is everything.</b> A concierge that sees where the user is in the product answers in one step what a call center resolves in twenty minutes.",
      "<b>Complex software stops being a moat for incumbents.</b> If AI can guide anyone through anything, \"we have an army of implementation consultants\" stops being a selling point.",
      "<b>Sell to the metric, not the org chart.</b> Peazy pitches adoption and retention outcomes — numbers a VP already owns — rather than a new tool category."
    ],
    themes: [
      { h: "Unbundling the CSM", p: "The episode maps which parts of customer success are pattern-matched guidance (automatable now), which are judgment (later), and which are genuinely human (relationships, expansion) — a useful blueprint for any services function facing AI." },
      { h: "The concierge pattern for enterprise UX", p: "Instead of redesigning bloated enterprise UI, Peazy overlays intelligence on top of it. The conversation explores why 'AI layer over legacy complexity' may be the fastest route into big companies." },
      { h: "Two-founder dynamics in a hot category", p: "CEO and CTO on how they split conviction: one sells the future of CS, the other builds an agent reliable enough to be allowed inside a Fortune 500's software stack." }
    ],
    about: "Peazy Labs builds an AI concierge that guides users through complex enterprise software from right inside the app. Founded by Komala Chenna (CEO) and Kushal Murthy (CTO).",
    whyNow: "SaaS vendors are under margin pressure and customer success is usually their largest post-sales cost. At the same time, churn is decided in the first weeks of product adoption — exactly where human CS coverage is thinnest. An AI layer that guides every user in-app attacks both problems at once, which is why the category is moving so fast.",
    numbers: [
      { n: "100%", l: "of users covered, not just the big accounts" },
      { n: "0", l: "the target number of support tickets" },
      { n: "1", l: "concierge living inside the app" },
      { n: "2", l: "cofounders — CEO + CTO" }
    ],
    autonomyLens: "Enterprise software today is a manual-transmission truck with no signage: powerful, and hostile to anyone who hasn't driven it for years. Peazy's concierge is driver-assist for that truck. It doesn't redesign the vehicle — it watches the road (where you are in the app), anticipates the turn (what you're trying to do), and nudges before you stall. Escalations to human CS become the disengagement reports: each one marks a moment the assist wasn't enough, and each one trains the system to need fewer.",
    counter: {
      claim: "Support chatbots already exist and users despise them. An 'AI concierge' is a chatbot with better marketing — it will deflect users who need help and infuriate the rest.",
      response: "The distinction the episode draws is context and timing. A support chatbot sits outside the product, answering FAQs after frustration has already peaked. Peazy's concierge sees the screen state — which page, which half-completed workflow — and intervenes at the moment of confusion with the specific next step, not a help-center link. Deflection bots exist to absorb complaints; an in-app guide exists to prevent them. The proof metric is the difference: not tickets closed faster, but tickets that never got filed."
    },
    faq: [
      { q: "Will AI replace customer success?", a: "AI is absorbing the repetitive layer of customer success — onboarding walkthroughs, how-do-I questions, in-app guidance. Human CS shifts up-stack to strategy, relationships, and expansion. The function doesn't disappear; it gets unbundled." },
      { q: "What is an in-app AI concierge?", a: "An in-app AI concierge lives inside a software product and guides users at the moment of confusion — it sees where you are in the app and walks you through the task, replacing the confusion → support ticket → call loop with instant, contextual help." },
      { q: "What is Peazy Labs?", a: "Peazy Labs builds an AI concierge for complex enterprise software: it guides users from right inside the app, improving adoption and retention. It was founded by Komala Chenna (CEO) and Kushal Murthy (CTO)." }
    ]
  },
  {
    slug: "5-trillion-small-business-succession-silver-surf",
    ep: 3, id: "VVFp6FDn5KM", date: "2026-05-17", dateHuman: "May 17, 2026", duration: "27:51",
    guest: "Laila Gamaleldin", role: "Founder @ Silver Surf", company: "Silver Surf",
    title: "The $5 Trillion Problem <em>Nobody in Tech</em> Is Working On",
    seoTitle: "The $5 Trillion Small Business Succession Problem — Silver Surf | The Tesla Pod",
    seoDesc: "Millions of baby-boomer business owners are retiring with no succession plan. Laila Gamaleldin's Silver Surf turns owner know-how into SOPs and AI so businesses outlive their founders — and exit for more. The Tesla Pod insights.",
    keywords: "small business succession, silver tsunami, baby boomer business exits, Silver Surf, Laila Gamaleldin, SOP automation AI, business exit value, SMB acquisition",
    hook: "Boomer owners are retiring in waves — and their businesses' know-how retires with them.",
    sub: "Laila Gamaleldin, founder of Silver Surf, on the silver tsunami: millions of profitable small businesses whose owners are aging out, whose operating knowledge lives in one person's head, and whose exits — or quiet shutdowns — add up to a $5 trillion problem tech has ignored.",
    bigIdea: [
      "While tech chases the same ten SaaS categories, the largest wealth transfer in history is happening in HVAC companies, machine shops, and family distributors. The bottleneck isn't buyers or money — it's that the business *is* the owner. Pricing instincts, vendor relationships, the Tuesday-morning routine: none of it is written down, so none of it survives a sale.",
      "Silver Surf's move is to treat owner knowledge as an extractable asset: interview it out, turn it into SOPs and AI-assisted operations, and make the business runnable by someone who isn't its founder. Do that, and you don't just save a company — you raise its price, because buyers pay for systems, not heroics."
    ],
    takeaways: [
      "<b>The silver tsunami is a market, not a headline.</b> Millions of boomer-owned businesses need to change hands this decade — a $5T flow with almost no modern tooling.",
      "<b>Key-person risk is the valuation killer.</b> Businesses that depend on the owner's head sell at a discount or don't sell at all; documented, systematized ones command multiples.",
      "<b>AI makes knowledge extraction scalable.</b> What a consultant would bill months for — interviewing the owner and writing the ops manual — an AI-assisted process does continuously.",
      "<b>Unsexy compounds.</b> The episode is a reminder that the biggest opportunities are in markets tech ignores because the customers don't look like tech customers.",
      "<b>Save the business, then sell it better.</b> Systematization serves both outcomes: the owner exits richer, and the business survives its founder."
    ],
    themes: [
      { h: "Why tech missed a $5T market", p: "Fragmented customers, offline workflows, and zero glamour — the ride unpacks why the biggest problem list in the economy has the shortest startup list, and why that's precisely the opportunity." },
      { h: "From founder-brain to operating system", p: "The mechanics of extracting what's in an owner's head: what questions to ask, what to document versus automate, and how AI turns a retiring owner's experience into an asset a buyer can operate." },
      { h: "Exits as a product", p: "A business that runs without its owner exits for more. The conversation reframes succession prep not as estate planning but as value engineering — with a bigger check as the proof." }
    ],
    about: "Silver Surf turns a retiring owner's know-how into SOPs and AI-assisted operations so the business runs — and sells — without them. Founded by Laila Gamaleldin.",
    whyNow: "Baby boomers own millions of American small businesses, and the retirement wave is cresting this decade — with most owners having no succession plan. Every year of delay means more profitable businesses quietly shutting down instead of changing hands. AI finally makes knowledge extraction cheap enough to work at small-business prices.",
    numbers: [
      { n: "$5T", l: "in businesses that must change hands" },
      { n: "Millions", l: "of boomer-owned companies" },
      { n: "1", l: "head where the operating knowledge lives" }
    ],
    autonomyLens: "A business that only runs when its owner is present is a car that only its owner can drive. Silver Surf is building the autonomy retrofit: record how the expert drives (interview the owner), turn instinct into policy (SOPs and AI-assisted operations), then hand over control with supervision. Succession stops being a cliff and becomes a handoff — and the exit check is the safety report. Buyers pay a premium for a business that demonstrably drives itself, exactly the way trust in autonomy is priced on evidence, not promises.",
    counter: {
      claim: "SMB owners are the hardest customers in software — skeptical, busy, and cheap. A retiring 68-year-old HVAC owner is not going to sit through AI interviews about how he prices jobs.",
      response: "Laila's answer is to sell the check, not the software. Owners won't buy 'knowledge management,' but every one of them cares about what their life's work sells for — and the difference between a key-person-dependent business and a systematized one is often the difference between no sale and a real exit. Framed as exit-value engineering, extraction isn't homework; it's the highest-leverage hours of the owner's final years. And AI drops the cost of capturing it from consultant-months to conversations."
    },
    faq: [
      { q: "What is the silver tsunami in small business?", a: "The 'silver tsunami' is the wave of baby-boomer business owners hitting retirement age — millions of profitable small businesses that must be sold, passed down, or shut within the decade, representing trillions in value with no modern tooling to handle the transition." },
      { q: "Why do small businesses fail to sell?", a: "Because the business is the owner: pricing instincts, vendor relationships, and daily operations live in one person's head. Buyers discount or walk away from key-person risk. Businesses with documented systems and processes sell more often and at higher multiples." },
      { q: "What is Silver Surf?", a: "Silver Surf, founded by Laila Gamaleldin, turns a retiring owner's know-how into SOPs and AI-assisted operations — so the business can run without its founder, survive the transition, and command a better exit price." }
    ]
  },
  {
    slug: "raising-yc-at-18-manicule",
    ep: 2, id: "EMmH7ECJ-IQ", date: "2026-05-11", dateHuman: "May 11, 2026", duration: "46:30",
    guest: "Shreyans Jain & Naman Bansal", role: "Cofounders @ Manicule (YC P26)", company: "Manicule",
    title: "They Raised $500K from YC <em>at 18</em>",
    seoTitle: "Raising $500K from Y Combinator at 18 — Manicule on Betting on Yourself Early | The Tesla Pod",
    seoDesc: "Shreyans Jain and Naman Bansal raised $500K from Y Combinator at 18 and are building Manicule — AI-native technical documentation, 'DevRel for agents.' Insights on betting on yourself early, from The Tesla Pod.",
    keywords: "YC at 18, youngest YC founders, Manicule YC P26, raising from Y Combinator, AI-native documentation, DevRel for agents, teenage startup founders, developer tools docs",
    hook: "Skip the résumé decade: two 18-year-olds on conviction, YC, and docs written for AI agents.",
    sub: "Shreyans Jain and Naman Bansal raised $500K from Y Combinator at 18. On this ride: what it actually takes to bet on yourself before the world says you're ready — and why they're building Manicule, AI-native technical documentation they describe as \"DevRel for agents.\"",
    bigIdea: [
      "The traditional sequence — degree, big-tech job, then maybe a startup at 28 — assumes credentials are the scarce asset. This episode argues the opposite: in a field moving this fast, the scarce asset is uncommitted years. At 18, the downside of a failed startup rounds to zero and the learning rate is the highest it will ever be. YC writing the check just formalizes that math.",
      "Their product thesis is just as contrarian: documentation has always been written for human developers, but increasingly the reader is an AI agent integrating your API. Docs become a machine interface — 'DevRel for agents' — and the tools for writing them need rebuilding from scratch."
    ],
    takeaways: [
      "<b>Youth is asymmetric upside.</b> No mortgage, no reputation to protect, maximum plasticity — the conversation makes the case that 18 is rationally the best age to take startup risk.",
      "<b>YC funds slope, not pedigree.</b> $500K at 18 is Y Combinator pricing trajectory over track record — proof that demonstrated building beats credentials earlier than most people think.",
      "<b>Your next reader is an agent.</b> When AI does the integrating, docs stop being prose and start being an interface spec for machines. Manicule is building for that reader.",
      "<b>DevRel is becoming machine-to-machine.</b> The developer-relations function — examples, guides, advocacy — gets a parallel track aimed at agents choosing which API to call.",
      "<b>Betting on yourself is a skill.</b> The founders describe conviction as trainable: ship, get signal, raise the stakes, repeat."
    ],
    themes: [
      { h: "The case for starting at 18", p: "A frank accounting of what they gave up (college normalcy) versus what they got (a decade head start), and why the 'wait until you're ready' advice mostly protects the advisor." },
      { h: "Docs for a post-human-reader world", p: "If agents read your documentation more often than people do, what changes? Structure, determinism, testability — the ride sketches what AI-native docs actually look like." },
      { h: "Surviving YC as teenagers", p: "Batch dynamics, being the youngest in every room, and turning 'aren't you too young?' from an objection into the reason people remember you." }
    ],
    about: "Manicule (YC P26) builds AI-native technical documentation for developer tools — \"DevRel for agents.\" Founded by Shreyans Jain and Naman Bansal, who raised $500K from Y Combinator at 18.",
    whyNow: "Two curves are crossing: AI agents are becoming the primary readers of technical documentation, and the age of credible founders keeps dropping as building gets cheaper. This episode sits at the intersection — teenagers funded by YC to rebuild docs for machine readers, both trends compounding each other.",
    numbers: [
      { n: "$500K", l: "raised from Y Combinator" },
      { n: "18", l: "years old when they raised it" },
      { n: "2", l: "founders betting on themselves" },
      { n: "P26", l: "YC batch" }
    ],
    autonomyLens: "Self-driving cars don't read street signs the way tourists do — they run on HD maps built for machines, precise to the centimeter. Manicule's thesis is that APIs need the same split. Human docs are street signs: prose, screenshots, vibes. An agent integrating your API at 2 a.m. needs the HD map — deterministic structure, testable examples, no ambiguity about which lane the endpoint is in. 'DevRel for agents' is the mapping company for that world, and the docs that agents can navigate are the roads that get the traffic.",
    counter: {
      claim: "Frontier models read human documentation just fine — they were trained on all of it. By the time 'AI-native docs' matter, agents will parse messy prose better than junior developers do.",
      response: "The founders' rebuttal is about reliability, not ability. An agent can usually infer the right call from prose — and 'usually' is exactly the problem when the integration runs unattended in production. Deterministic, testable docs turn inference into lookup, which is the difference between a demo that works and an integration you never think about again. The road analogy holds: a capable driver can navigate from landmarks, but nobody ships autonomy on landmarks. When agents choose which API to build on, they'll route toward the one with the map."
    },
    faq: [
      { q: "Can you get into Y Combinator at 18?", a: "Yes — Shreyans Jain and Naman Bansal did it, raising $500K from YC at 18 with Manicule. YC funds trajectory over credentials: shipped products and demonstrated learning speed matter more than degrees or work history." },
      { q: "What is Manicule?", a: "Manicule (YC P26) builds AI-native technical documentation for developer tools — docs structured for AI agents that integrate APIs, not just human readers. The founders describe it as 'DevRel for agents.'" },
      { q: "What is DevRel for agents?", a: "Developer relations has always meant helping human developers adopt your tool — docs, examples, advocacy. As AI agents start choosing and integrating APIs autonomously, a parallel discipline emerges: making your documentation legible, deterministic, and testable for machine readers." }
    ]
  },
  {
    slug: "self-driving-software-marketrix-yasith",
    ep: 1, id: "kl8JXv2KIfc", date: "2026-05-03", dateHuman: "May 3, 2026", duration: "6:56",
    guest: "Yasith Jayawardana", role: "Cofounder & CTO @ Marketrix AI", company: "Marketrix AI",
    title: "Self-Driving Cars and <em>Self-Driving Software</em>",
    seoTitle: "Self-Driving Cars and Self-Driving Software — Marketrix AI's Simulation Thesis | The Tesla Pod",
    seoDesc: "The ride that started The Tesla Pod: Yasith Jayawardana on why software should be tested the way autonomy is — with simulated users, at scale, before launch. Insights from the Tesla podcast's first episode.",
    keywords: "AI simulated users, software testing simulation, Marketrix AI, Yasith Jayawardana, user simulation platform, self-driving software, product validation AI, Tesla podcast first episode",
    hook: "The founding ride: why software should earn trust the way FSD does — in simulation first.",
    sub: "The episode that started it all. Driving along the coast, Marketrix co-founder and CTO Yasith Jayawardana connects the two ideas that became this show: cars that drive themselves, and software that should test itself the same way — with simulated users, at scale, before a real one ever touches it.",
    bigIdea: [
      "Autonomy earned public trust through simulation: billions of virtual miles driven before and alongside every real one. This first ride asks the obvious-in-hindsight question — why doesn't software work that way? Products still launch on the strength of a QA checklist and a prayer, then discover their failure modes on live users.",
      "Marketrix's answer is the user-simulation platform: AI-simulated users that click, wander, misunderstand, and rage-tap through your product the way real ones will — so the thousandth user's experience is validated before the first user arrives. It's the FSD development loop, ported to product engineering."
    ],
    takeaways: [
      "<b>Simulation is how autonomy got safe — and software skipped it.</b> Virtual miles preceded real ones; virtual users should precede real ones too.",
      "<b>Real users are your most expensive test suite.</b> Every bug discovered in production was paid for with someone's trust. Simulated users move that cost to before launch.",
      "<b>Simulated users find what scripts can't.</b> Scripted tests check the paths you thought of; AI users behave like humans — distracted, confused, creative — and surface the paths you didn't.",
      "<b>Demo throughput is a growth lever.</b> When validation is simulated, showing and shipping product stops being gated on human QA cycles.",
      "<b>The show's thesis in one ride.</b> Autonomy as a lens on every kind of building — that's the premise this six-minute episode set for everything after it."
    ],
    themes: [
      { h: "The FSD development loop, applied to product", p: "Perception, simulation, deployment, telemetry, repeat — the episode maps each stage of the autonomy playbook onto how software teams could validate products before and after launch." },
      { h: "What an AI-simulated user actually is", p: "Not a script and not a monkey test: an agent with goals, patience limits, and human-like misunderstanding. The conversation explores what it takes to make synthetic users behave real enough to matter." },
      { h: "Origin story of the pod", p: "Recorded along the coast with the show's own CTO in the passenger seat — the ride where 'conversations from the autonomous future' stopped being a tagline and became a format." }
    ],
    about: "Marketrix AI is the user-simulation platform — AI-simulated users that test and validate your product before real ones ever do. Yasith Jayawardana is co-founder & CTO.",
    whyNow: "Product teams are shipping faster than QA can keep up — AI code generation has made building cheap while validation stayed expensive. Simulation closes that gap: the same approach that let autonomy teams iterate safely at speed is now available to every software team, and the teams that adopt it first ship with fewer surprises.",
    numbers: [
      { n: "6:56", l: "the ride that started the show" },
      { n: "1,000s", l: "of simulated users before user #1" },
      { n: "Billions", l: "of simulated miles behind autonomy's trust" }
    ],
    autonomyLens: "Every later episode borrows this one's lens, so here it runs at full strength. Yasith maps the entire autonomy development loop onto product engineering: simulation before deployment (synthetic users before launch), telemetry after it (watching how real users diverge from the sim), and a disengagement report for products — every rage-click and abandoned flow logged as an intervention that feeds the next simulation run. The claim isn't that software is like driving. It's that autonomy discovered the correct way to earn trust in any complex system, and software just hasn't adopted it yet.",
    counter: {
      claim: "Simulated users aren't real users. Real people are irrational in ways no model captures — the sim-to-real gap means simulation gives you confidence in exactly the wrong places.",
      response: "The episode's answer is that autonomy faced the identical objection and resolved it: simulation never replaced real roads — it moved failure discovery earlier and made every real mile more informative. Same here. Simulated users don't need to be perfectly human to be useful; they need to be human enough to trip over the confusing label, the dead-end flow, the button nobody finds. Catch those thousand cheap failures pre-launch, and your real users spend their scarce, expensive attention revealing the failures only humans can."
    },
    faq: [
      { q: "What are AI-simulated users?", a: "AI-simulated users are agents that behave like real people inside your product — they click, wander, misread labels, lose patience, and pursue goals — surfacing usability problems and bugs before launch, at a scale scripted tests can't reach." },
      { q: "What is Marketrix AI?", a: "Marketrix AI is the user-simulation platform: AI-simulated users test and validate your product before real ones ever do. Co-founded by Yasith Jayawardana (CTO), it applies the autonomy industry's simulation-first playbook to software products." },
      { q: "How is software testing like self-driving cars?", a: "Autonomy earned trust through billions of simulated miles before real ones. The episode's thesis: software should work the same way — validate against thousands of simulated users before the first real user arrives, instead of discovering failure modes in production." }
    ]
  }
];

const GA = `
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-FM2TFSZ32V"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-FM2TFSZ32V');
  </script>`;

const HEAD_COMMON = `
  <meta name="author" content="Irosha de Silva" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
  <meta name="theme-color" content="#fbfaf8" media="(prefers-color-scheme: light)" />
  <meta name="theme-color" content="#101012" media="(prefers-color-scheme: dark)" />
  <link rel="icon" type="image/svg+xml" href="/assets/brand/favicon.svg" />
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/brand/favicon-32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/brand/favicon-16.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/brand/apple-touch-icon.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700&family=Inter:wght@400;500;600&family=Instrument+Serif:ital@1&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/styles.css" />`;

const NAV = `
  <header class="nav" id="nav">
    <a class="nav-logo" href="/" aria-label="The Tesla Pod — home">
      <span class="nav-word"><em>The</em> Tesla Pod</span>
    </a>
    <nav class="nav-links" aria-label="Primary">
      <a href="/#episodes">Episodes</a>
      <a href="/insights">Insights</a>
      <a href="/#passengers">Passengers</a>
      <a href="/#apply" class="nav-cta">Be a Guest</a>
    </nav>
    <div class="nav-actions">
      <a class="nav-yt" href="https://www.youtube.com/@TeslaPod" target="_blank" rel="noopener" aria-label="The Tesla Pod on YouTube">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z"/></svg>
      </a>
      <button class="theme-toggle" id="themeToggle" aria-label="Toggle light / dark theme">
        <span class="theme-icon" aria-hidden="true"></span>
      </button>
      <button class="nav-burger" id="navBurger" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
  <div class="mobile-menu" id="mobileMenu">
    <a href="/#episodes">Episodes</a>
    <a href="/insights">Insights</a>
    <a href="/#passengers">Passengers</a>
    <a href="/#apply">Be a Guest</a>
    <a href="https://www.youtube.com/@TeslaPod" target="_blank" rel="noopener">YouTube ↗</a>
  </div>`;

const FOOTER = `
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <a class="nav-logo" href="/" aria-label="The Tesla Pod — home">
          <span class="nav-word"><em>The</em> Tesla Pod</span>
        </a>
        <p>The Tesla podcast — conversations from the autonomous future.<br />Recorded on the move, somewhere in the Bay Area.</p>
      </div>
      <div class="footer-col">
        <h4>Ride along</h4>
        <a href="/#episodes">Episodes</a>
        <a href="/insights">Insights</a>
        <a href="/#passengers">Passengers</a>
        <a href="/#apply">Be a guest</a>
      </div>
      <div class="footer-col">
        <h4>Elsewhere</h4>
        <a href="https://www.youtube.com/@TeslaPod" target="_blank" rel="noopener">YouTube ↗</a>
        <a href="mailto:irosha@marketrix.ai?subject=Tesla%20Pod%20Sponsorship">Sponsorships</a>
        <a href="mailto:irosha@marketrix.ai">Contact</a>
      </div>
      <div class="footer-col">
        <h4>On the road</h4>
        <span class="footer-road">San Francisco → Bay Area</span>
        <span class="footer-road">37.7749° N · 122.4194° W</span>
      </div>
    </div>
    <div class="footer-bar">
      <span>© <span id="year"></span> The Tesla Pod. All rides supervised.</span>
      <span class="footer-made">Made with <span class="footer-heart">❤️</span> by <a href="https://www.irosha.com" target="_blank" rel="noopener">Irosha de Silva</a> in San Francisco</span>
      <span class="footer-tel">Not affiliated with Tesla, Inc. (Yet)</span>
    </div>
  </footer>`;

const PAGE_JS = `
  <script>
  (function () {
    var root = document.documentElement, saved = null;
    try { saved = localStorage.getItem("tp-theme"); } catch (e) {}
    if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
    document.getElementById("themeToggle").addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("tp-theme", next); } catch (e) {}
    });
    var burger = document.getElementById("navBurger"), menu = document.getElementById("mobileMenu");
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.getElementById("year").textContent = new Date().getFullYear();
    // scrollspy for the article table of contents
    var tocLinks = document.querySelectorAll(".in-toc a[href^='#']");
    if (tocLinks.length && "IntersectionObserver" in window) {
      var map = {};
      tocLinks.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
      var current = null;
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && map[en.target.id]) {
            if (current) current.classList.remove("on");
            current = map[en.target.id];
            current.classList.add("on");
          }
        });
      }, { rootMargin: "-15% 0px -70% 0px" });
      document.querySelectorAll(".in-article h2[id]").forEach(function (h) { obs.observe(h); });
    }
  })();
  </script>`;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const plain = (s) => String(s).replace(/<[^>]+>/g, "");

function articlePage(it, i) {
  const prev = INSIGHTS[i + 1]; // older
  const next = INSIGHTS[i - 1]; // newer
  const url = `${SITE}/insights/${it.slug}`;
  const img = `${IMG_HOST}/assets/thumbs/${it.id}.jpg`;
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: plain(it.title),
    description: it.seoDesc,
    image: img,
    datePublished: it.date,
    dateModified: "2026-07-30",
    author: { "@type": "Person", name: "Irosha de Silva", jobTitle: "Host, The Tesla Pod" },
    publisher: { "@type": "Organization", name: "The Tesla Pod", url: `${SITE}/` },
    mainEntityOfPage: url,
    keywords: it.keywords,
    about: {
      "@type": "PodcastEpisode",
      episodeNumber: it.ep,
      name: plain(it.title),
      url: `https://www.youtube.com/watch?v=${it.id}`,
      partOfSeries: { "@type": "PodcastSeries", name: "The Tesla Pod", url: `${SITE}/` }
    }
  };
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "The Tesla Pod", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Insights", item: `${SITE}/insights` },
      { "@type": "ListItem", position: 3, name: plain(it.title), item: url }
    ]
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: it.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a }
    }))
  };
  const related = INSIGHTS.filter((x) => x.slug !== it.slug).slice(0, 3);
  return `<!doctype html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
${GA}
  <title>${esc(it.seoTitle)}</title>
  <meta name="description" content="${esc(it.seoDesc)}" />
  <meta name="keywords" content="${esc(it.keywords)}" />
  <link rel="canonical" href="${url}" />
${HEAD_COMMON}
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="The Tesla Pod" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${esc(plain(it.title))} — The Tesla Pod Insights" />
  <meta property="og:description" content="${esc(it.hook)}" />
  <meta property="og:image" content="${img}" />
  <meta property="og:image:alt" content="Episode ${String(it.ep).padStart(2, "0")} of The Tesla Pod — ${esc(plain(it.title))}" />
  <meta property="article:published_time" content="${it.date}" />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:title" content="${esc(plain(it.title))} — The Tesla Pod Insights" />
  <meta property="twitter:description" content="${esc(it.hook)}" />
  <meta property="twitter:image" content="${img}" />
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
  <script type="application/ld+json">${JSON.stringify(crumbs)}</script>
  <script type="application/ld+json">${JSON.stringify(faqLd)}</script>
</head>
<body>
${NAV}
  <main class="in-main">
    <nav class="in-crumbs" aria-label="Breadcrumb"><a href="/">The Tesla Pod</a><span>/</span><a href="/insights">Insights</a><span>/</span><span>EP ${String(it.ep).padStart(2, "0")}</span></nav>
    <div class="in-hero">
      <h1>${it.title}</h1>
      <p class="in-sub">${it.sub}</p>
      <div class="in-meta">
        <span>EPISODE <b>${String(it.ep).padStart(2, "0")}</b></span>
        <span>WITH <b>${esc(it.guest)}</b></span>
        <span><b>${esc(it.company)}</b></span>
        <span>${esc(it.dateHuman).toUpperCase()}</span>
        <span>${esc(it.duration)}</span>
      </div>
    </div>
    <div class="in-layout">
    <article class="in-article">
      <h2 id="big-idea">The big idea</h2>
      ${it.bigIdea.map((p) => `<p>${p}</p>`).join("\n      ")}
      <h2 id="why-now">Why this matters now</h2>
      <p>${it.whyNow}</p>
      <h2 id="numbers">By the numbers</h2>
      <div class="in-numbers">
        ${it.numbers.map((s) => `<div class="in-num"><b>${esc(s.n)}</b><span>${esc(s.l)}</span></div>`).join("\n        ")}
      </div>
      <h2 id="takeaways">Key takeaways</h2>
      <ul class="in-takeaways">
        ${it.takeaways.map((t) => `<li>${t}</li>`).join("\n        ")}
      </ul>
      <h2 id="conversation">Inside the conversation</h2>
      ${it.themes.map((t) => `<h3>${esc(t.h)}</h3>\n      <p>${t.p}</p>`).join("\n      ")}
      <h2 id="autonomy-lens">Through the autonomy lens</h2>
      <p>${it.autonomyLens}</p>
      <h2 id="counterargument">The counterargument</h2>
      <div class="in-counter">“${it.counter.claim}”</div>
      <p>${it.counter.response}</p>
      <h2 id="about">About ${esc(it.company)}</h2>
      <p>${esc(it.about)}</p>
      <h2 id="faq">Questions this episode answers</h2>
      ${it.faq.map((f) => `<h3>${esc(f.q)}</h3>\n      <p>${esc(f.a)}</p>`).join("\n      ")}
      <div class="in-watch">
        <span>Watch the full ride — Episode ${String(it.ep).padStart(2, "0")} of The Tesla Pod, the Tesla podcast recorded in a self-driving Tesla.</span>
        <a class="btn btn-primary" href="https://www.youtube.com/watch?v=${it.id}" target="_blank" rel="noopener">▶ Watch on YouTube</a>
      </div>
      <nav class="in-prevnext" aria-label="More insights">
        ${prev ? `<a href="/insights/${prev.slug}">← EP ${String(prev.ep).padStart(2, "0")} · ${esc(plain(prev.title))}</a>` : "<span></span>"}
        ${next ? `<a href="/insights/${next.slug}" style="text-align:right">EP ${String(next.ep).padStart(2, "0")} · ${esc(plain(next.title))} →</a>` : "<span></span>"}
      </nav>
    </article>
    <aside class="in-toc" aria-label="On this page">
      <span class="in-toc-label">On this page</span>
      <a href="#big-idea">The big idea</a>
      <a href="#why-now">Why this matters now</a>
      <a href="#numbers">By the numbers</a>
      <a href="#takeaways">Key takeaways</a>
      <a href="#conversation">Inside the conversation</a>
      <a href="#autonomy-lens">Through the autonomy lens</a>
      <a href="#counterargument">The counterargument</a>
      <a href="#about">About ${esc(it.company)}</a>
      <a href="#faq">Q&amp;A</a>
      <a class="in-toc-watch" href="https://www.youtube.com/watch?v=${it.id}" target="_blank" rel="noopener">▶ Watch the episode</a>
    </aside>
    </div>
    <section class="in-related">
      <h2>More insights from the pod</h2>
      <div class="insights-grid">
        ${related.map((r) => `<a class="in-card" href="/insights/${r.slug}">
        <div class="in-card-thumb"><img loading="lazy" src="/assets/thumbs/${r.id}.jpg" alt="${esc(plain(r.title))} — The Tesla Pod episode ${String(r.ep).padStart(2, "0")}" onerror="this.src='https://img.youtube.com/vi/${r.id}/hqdefault.jpg'" /></div>
        <div class="in-card-body">
          <span class="in-card-kicker">EP ${String(r.ep).padStart(2, "0")} · ${esc(r.company)}</span>
          <h3>${r.title.replace(/<\/?em>/g, "")}</h3>
          <span class="in-card-go">Read the insights →</span>
        </div>
      </a>`).join("\n        ")}
      </div>
    </section>
  </main>
${FOOTER}
${PAGE_JS}
</body>
</html>
`;
}

function landingPage() {
  const url = `${SITE}/insights`;
  const ld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Insights — The Tesla Pod",
    description: "Key takeaways, themes, and findings from every episode of The Tesla Pod — the Tesla podcast recorded with startup founders inside a self-driving Tesla in San Francisco.",
    url,
    isPartOf: { "@type": "WebSite", name: "The Tesla Pod", url: `${SITE}/` },
    hasPart: INSIGHTS.map((it) => ({ "@type": "Article", headline: plain(it.title), url: `${SITE}/insights/${it.slug}` }))
  };
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "The Tesla Pod", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Insights", item: url }
    ]
  };
  return `<!doctype html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
${GA}
  <title>Insights from The Tesla Pod — Findings from the Tesla Podcast's Founder Rides</title>
  <meta name="description" content="Every finding and discussion from The Tesla Pod, the Tesla podcast recorded in a self-driving Tesla: AI agents, automating consulting, proactive copilots, agentic browsing, AI customer success, small-business succession, and more." />
  <meta name="keywords" content="Tesla podcast insights, The Tesla Pod insights, startup podcast takeaways, AI agents insights, founder interviews takeaways, self-driving Tesla podcast" />
  <link rel="canonical" href="${url}" />
${HEAD_COMMON}
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="The Tesla Pod" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="Insights — The Tesla Pod" />
  <meta property="og:description" content="Key takeaways and findings from every ride: AI agents, agentic browsing, automating consulting, and more — from the Tesla podcast recorded in a self-driving Tesla." />
  <meta property="og:image" content="${IMG_HOST}/assets/brand/og.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Insights from The Tesla Pod — the Tesla podcast" />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:title" content="Insights — The Tesla Pod" />
  <meta property="twitter:description" content="Key takeaways and findings from every ride of the Tesla podcast recorded in a self-driving Tesla." />
  <meta property="twitter:image" content="${IMG_HOST}/assets/brand/og.jpg" />
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
  <script type="application/ld+json">${JSON.stringify(crumbs)}</script>
</head>
<body>
${NAV}
  <main class="in-main">
    <nav class="in-crumbs" aria-label="Breadcrumb"><a href="/">The Tesla Pod</a><span>/</span><span>Insights</span></nav>
    <div class="in-hero">
      <h1>Every ride, <em>distilled.</em></h1>
      <p class="in-sub">The findings and discussions from each episode of The Tesla Pod — the Tesla podcast where founders talk AI agents, autonomy, and company-building while a self-driving Tesla handles San Francisco. Big ideas, key takeaways, and what happened inside the conversation.</p>
    </div>
    <div class="insights-grid">
      ${INSIGHTS.map((it) => `<a class="in-card" href="/insights/${it.slug}">
        <div class="in-card-thumb"><img loading="lazy" src="/assets/thumbs/${it.id}.jpg" alt="${esc(plain(it.title))} — The Tesla Pod episode ${String(it.ep).padStart(2, "0")}" onerror="this.src='https://img.youtube.com/vi/${it.id}/hqdefault.jpg'" /></div>
        <div class="in-card-body">
          <span class="in-card-kicker">EP ${String(it.ep).padStart(2, "0")} · ${esc(it.company)} · ${esc(it.dateHuman)}</span>
          <h2>${it.title.replace(/<\/?em>/g, "")}</h2>
          <p>${esc(it.hook)}</p>
          <span class="in-card-go">Read the insights →</span>
        </div>
      </a>`).join("\n      ")}
    </div>
  </main>
${FOOTER}
${PAGE_JS}
</body>
</html>
`;
}

const outDir = join(root, "insights");
await mkdir(outDir, { recursive: true });
await writeFile(join(outDir, "index.html"), landingPage());
for (let i = 0; i < INSIGHTS.length; i++) {
  await writeFile(join(outDir, `${INSIGHTS[i].slug}.html`), articlePage(INSIGHTS[i], i));
}
console.log(`built insights/index.html + ${INSIGHTS.length} articles`);
console.log(INSIGHTS.map((x) => x.slug).join("\n"));
