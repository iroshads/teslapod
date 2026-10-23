// Builds every generated page and file of the site from data.js + the content below.
// Run from repo root:  node tools/build-site.mjs
//   /insights/            landing + one article per episode   (content: INSIGHTS below)
//   /episodes/            index + one page per episode        (content: tools/episodes-content.mjs)
//   index.html            pre-rendered episode/guest markup + series JSON-LD (between build markers)
//   sitemap.xml, feed.xml, llms.txt
// lastmod dates live in tools/lastmod.json and only move when a page's content changes.
import { writeFile, mkdir, readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import vm from "node:vm";
import { EPISODE_CONTENT } from "./episodes-content.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const SITE = "https://www.theteslapod.com";
const IMG_HOST = SITE; // absolute URLs for og:image / JSON-LD

// data.js is a browser script (const EPISODES / PEOPLE) — evaluate it in a sandbox
const dataCtx = {};
vm.createContext(dataCtx);
vm.runInContext(await readFile(join(root, "data.js"), "utf8") + "\n;this.EPISODES = EPISODES; this.PEOPLE = PEOPLE;", dataCtx);
const EPISODES = dataCtx.EPISODES, PEOPLE = dataCtx.PEOPLE;
// company blurbs + links are maintained once, in app.js (they power the "i" popovers)
const appSrc = await readFile(join(root, "app.js"), "utf8");
const COMPANIES = vm.runInNewContext("(" + appSrc.match(/var COMPANIES = (\{[\s\S]*?\n  \});/)[1] + ")");
const episodeById = (id) => EPISODES.find((e) => e.id === id);
const episodeUrl = (ep) => `${SITE}/episodes/${ep.slug}`;

const INSIGHTS = [
  {
    slug: "making-tech-media-entertaining-silicon-mania",
    ep: 11, id: "9Ejk8wq14ww", date: "2026-08-24", dateHuman: "Aug 24, 2026", duration: "1:09:54",
    guest: "Adil Mania", role: "Cofounder @ Silicon Mania", company: "Silicon Mania",
    title: "Tech Has Ten Thousand Podcasts and <em>Nothing Worth Watching</em>",
    seoTitle: "Why Tech Media Is Boring, and Silicon Mania's Fix | The Tesla Pod",
    seoDesc: "Adil Mania says tech has ten thousand podcasts and nothing worth watching. Silicon Mania's answer: MrBeast meets NBC. Takeaways from The Tesla Pod.",
    keywords: "tech media, Silicon Mania, Adil Mania, MrBeast for tech, entertaining tech content, tech podcasts criticism, media startup, Offline Ventures, Founders Inc, creator economy tech",
    hook: "Food has shows. Sports has shows. Tech has founders talking to founders in cars.",
    sub: "Adil Mania grew up in Rabat, studied engineering in France, built in Paris, and now runs Silicon Mania out of San Francisco on one claim: tech is the most exciting story on earth and nobody covers it in a way you'd choose on a Saturday night. Five formats in eight months. This ride is the one where the guest's whole thesis is an indictment of the format he's sitting in — and the host asks him about it directly.",
    bigIdea: [
      "Every other domain built entertainment around itself. Food has Chef's Table and MasterChef. Fashion has runway spectacle. Sports has an entire industrial complex of highlights, docuseries and personalities. Tech — arguably the most consequential story of the century — produced ten thousand podcasts of founders interviewing founders. Adil's argument is that this isn't a taste problem, it's a format problem: the industry only ever built media for itself, and never for the audience that would find it fascinating if someone bothered to make it fun.",
      "The uncomfortable turn is that this show is one of those podcasts. A founder interviewing a founder — in a car. The episode's best moment is the host putting that to him directly instead of editing around it, and the answer is more interesting than a dodge: the problem isn't the conversation, it's that the conversation is the <em>only</em> format anyone ships. Silicon Mania's response is range — a recap show, a print magazine, live events, original games — because a healthy media ecosystem for tech looks like five things, not one thing done ten thousand times."
    ],
    takeaways: [
      "<b>Tech media optimized for insiders, not audiences.</b> The genre defaults to founders talking to founders because that's who's making it — which caps its ceiling at the people already inside.",
      "<b>Format range beats format volume.</b> Five different shapes in eight months — recap, print, live, games — tests what tech entertainment can be, instead of adding podcast ten-thousand-and-one.",
      "<b>Print in 2026 is a signal, not nostalgia.</b> A physical magazine is the least scalable thing you can ship, which is exactly why it says the brand is real.",
      "<b>Meaning beat margin.</b> Adil walked away from a profitable AI agency because it felt meaningless — the episode is candid about what that trade actually costs.",
      "<b>Geography is a constraint founders still fight.</b> The Paris hackerspace that died because no European investor would lead is a concrete story about why builders keep landing in San Francisco.",
      "<b>\"Chief Vibes Officer\" is a strategy in a joke's clothing.</b> If your thesis is that tech should be fun, the title is a product decision — and a filter for who wants to work with you."
    ],
    themes: [
      { h: "The critique, aimed at the room he's in", p: "The host asks the obvious question — is a founder interviewing a founder in a Tesla exactly the problem you're describing? — and the episode doesn't cut away from the answer. What follows is the most useful part of the ride: a working distinction between formats that inform insiders and formats that recruit outsiders." },
      { h: "What 'MrBeast meets NBC' actually means", p: "Not stunts for their own sake. It's the pairing of creator-economy production instincts — pacing, stakes, spectacle, a reason to keep watching — with the editorial seriousness of a network. Adil unpacks what that hybrid looks like when the subject is software rather than a game show." },
      { h: "Rabat → Paris → San Francisco", p: "The route matters to the argument. Watching a Paris hackerspace shut down for want of a lead investor taught him where the energy concentrates, and why the story of technology is still told — and funded — from a few square miles." },
      { h: "Shipping five formats in eight months", p: "The operational half of the conversation: how a small team tests media formats fast, what they learned killing the ones that didn't land, and why sponsors like Rippling, ElevenLabs, PostHog and Convex bought into a media bet this early." }
    ],
    about: "Silicon Mania is a tech media company built on the claim that tech is the most exciting story on earth and nobody is covering it in a way worth watching on a Saturday night. In eight months it has shipped five formats — a recap show, a print magazine, live events, original games and more. Backed by Offline Ventures and Founders Inc, with angels including Guillermo Rauch and Dan Shipper, and sponsored by Rippling, ElevenLabs, PostHog and Convex. Co-founded by Adil Mania, who grew up in Rabat, studied engineering in France, and built in Paris before moving to San Francisco.",
    whyNow: "AI made producing video, audio and graphics nearly free, which collapsed the cost of <em>making</em> media — and simultaneously flooded every feed, which raised the cost of being <em>worth watching</em>. In that squeeze, production quality stops being the moat and taste becomes it. Meanwhile tech is generating the decade's biggest stories with the smallest entertainment footprint. The gap between how important the subject is and how boring its coverage is has never been wider, which is exactly when someone walks in and fixes it.",
    numbers: [
      { n: "5", l: "formats shipped" },
      { n: "8", l: "months to ship them" },
      { n: "10,000", l: "tech podcasts he's competing against" },
      { n: "3", l: "cities: Rabat, Paris, San Francisco" },
      { n: "4", l: "sponsors backing the bet" }
    ],
    autonomyLens: "Autonomy earned mainstream attention the moment it stopped being a spec sheet and became something you could watch — a car handling Lombard Street with nobody's hands on the wheel. The engineering was extraordinary for years before that; what changed was the format. Adil's argument is the same one, generalized: technology doesn't have an interest problem, it has a demonstration problem. And this show is a small proof of his own thesis — the reason these conversations work isn't the questions, it's that a self-driving car is doing something visibly remarkable in the background while two people talk. Put the interesting thing on screen and the audience arrives.",
    counter: {
      claim: "Making tech 'entertaining' is how you get hype cycles. Serious technology coverage should be dry, technical and skeptical — the moment you optimize for Saturday-night watchability, you start selling founders' mythology back to them with better lighting.",
      response: "The episode takes this seriously rather than waving it off, and the answer separates entertainment from flattery. Sports journalism is wildly entertaining and still breaks doping scandals; food media is beautiful and still eviscerates restaurants. Production value isn't what makes coverage credulous — access-dependence is, and that's a failure mode tech's founder-interview format already has in abundance. Adil's bet is that a bigger, non-insider audience is actually harder to flatter, because people outside the bubble have no stake in the mythology. Whether Silicon Mania holds that line as sponsors and access accumulate is the open question, and the ride doesn't pretend it's settled."
    },
    faq: [
      { q: "What is Silicon Mania?", a: "Silicon Mania is a San Francisco tech media company co-founded by Adil Mania, built on the premise that tech is the most exciting story on earth but is covered boringly. In eight months it has shipped five formats — a recap show, a print magazine, live events, original games and more. It's backed by Offline Ventures and Founders Inc." },
      { q: "Why is tech media considered boring?", a: "Adil Mania's argument on the episode: tech media was built by insiders for insiders, so it defaults to one format — founders interviewing founders. Food, fashion and sports each developed entertainment formats aimed at general audiences; tech mostly produced podcasts aimed at people already in the industry." },
      { q: "What does 'MrBeast meets NBC' mean for tech?", a: "It's the pairing of creator-economy production instincts — pacing, stakes, spectacle, a reason to keep watching — with the editorial seriousness of a broadcast network, applied to technology as the subject rather than games or entertainment." },
      { q: "Who is Adil Mania?", a: "Adil Mania is the co-founder of Silicon Mania. He grew up in Rabat, studied engineering in France, and built in Paris — including a hackerspace that shut down when no European investor would lead — before moving to San Francisco. He left a profitable AI agency because the work felt meaningless." }
    ]
  },
  {
    slug: "free-mentorship-at-scale-adplist-felix-lee",
    ep: 10, id: "g57WpguhxXA", date: "2026-08-11", dateHuman: "Aug 11, 2026", duration: "1:08:34",
    guest: "Felix Lee", role: "Cofounder & CEO @ ADPList", company: "ADPList",
    title: "Sequoia Said Yes. A Million Users Later, It's Still <em>Free</em>",
    seoTitle: "Why ADPList Keeps Mentorship Free at Scale | The Tesla Pod",
    seoDesc: "39,000 mentors, 600M minutes, backed by Sequoia's Surge, and still free. Felix Lee on why ADPList won't charge for sessions. Takeaways from The Tesla Pod.",
    keywords: "ADPList, Felix Lee, free mentorship platform, Sequoia Surge, mentorship at scale, AI interview practice, design mentorship, career mentorship, marketplace monetization, founder without degree",
    hook: "39,000 mentors, 600 million minutes, 140 countries — and five years of refusing to charge.",
    sub: "Felix Lee never finished a university degree, sold his first company while still in high school, and went through an IPO before taking two deliberate years off. Then he built ADPList — the largest free mentorship community in the world, backed by Sequoia India's Surge. This ride is about the decision investors keep asking him to justify: a million users later, every session still costs nothing.",
    bigIdea: [
      "A marketplace with 39,000 supply-side experts and a million users would normally have monetized years ago — and most boards would have demanded it. The episode circles the decision Felix has defended for five years: keeping every mentorship session free. His argument is that the free network <em>is</em> the asset. Charge for sessions and you don't get a smaller business — you get a different, worse network, because the mentors who matter came to give back, not to bill by the half hour.",
      "The second thread is Felix's own path: no degree, a company sold in high school, an IPO, then a two-year gap taken on purpose. In a conversation about mentorship, the host's chair is occupied by someone the credential system never certified — which is precisely the point. ADPList exists to route the advice that credentials gatekeep to the people the system skips."
    ],
    takeaways: [
      "<b>The free network is the moat.</b> Payment would filter out exactly the mentors who make ADPList valuable — generosity-driven experts — and replace them with consultants. The price isn't a missing feature; it's the product's DNA.",
      "<b>Monetize around the network, not through it.</b> The conversation explores products like AI Interview Practice as the model: keep human sessions free, build paid value on the data and trust the free layer generates.",
      "<b>Credentials are a proxy — mentorship is the real transfer.</b> A founder with no degree built the world's largest advice network. What universities bundle badly, 1:1 mentorship unbundles precisely.",
      "<b>The gap year is a strategy, not a pause.</b> Two years between the IPO and ADPList gave Felix the question worth a decade — most founders never stop long enough to find theirs.",
      "<b>AI scales mentorship's floor, humans hold its ceiling.</b> Practice and preparation automate well; belief, taste, and 'you can do this' still travel human-to-human.",
      "<b>Not everything needs to be usable to be valuable.</b> Felix's contrarian design take: some experiences should demand effort — friction can be the point, not the failure."
    ],
    themes: [
      { h: "The cost of staying free", p: "What five years of 'no' to monetization actually costs — in board meetings, in runway pressure, in options foreclosed — and why Felix believes the compounding trust of a million users is the better trade. The episode gets specific about what would break the moment a price tag appears." },
      { h: "Selling a company before finishing school", p: "Felix's origin story runs backwards: exit first, credentials never. The ride digs into what a teenage acquisition teaches about negotiation, worth, and why he's spent his career building the advice network he didn't have." },
      { h: "AI Interview Practice and the automation line", p: "ADPList's bet on AI isn't replacing mentors — it's absorbing the rehearsal layer. Interview practice is repetitive, judgment-light, and endlessly demanded: perfect for AI. The mentor's role concentrates into what only humans do — context, conviction, and care." },
      { h: "Usability isn't the only value", p: "From the man whose backers include usability pioneer Jakob Nielsen, a heresy: not everything needs to be usable to be valuable. Some of the best products make you work — the conversation unpacks when friction teaches and when it just loses users." }
    ],
    about: "ADPList is the world's largest free mentorship community: 1:1 sessions with ~39,000 verified mentors across design, product, engineering, AI and marketing — 600 million minutes of advice, 140 countries, over a million users. Backed by Sequoia India's Surge in 2021, with angels from Airbnb, Gojek and Zendesk, and usability pioneer Jakob Nielsen. Felix Lee is co-founder and CEO.",
    whyNow: "AI is commoditizing information — anyone can get a competent answer about their career in seconds. What can't be generated is a person who's done it, looking at your specific situation, telling you what they'd do. That makes human mentorship scarcer and more valuable exactly as advice-as-content collapses to zero — and it makes the network that already organized 39,000 willing experts the right asset at the right moment.",
    numbers: [
      { n: "~39,000", l: "verified mentors" },
      { n: "600M", l: "minutes of advice given" },
      { n: "140", l: "countries reached" },
      { n: "1M+", l: "users" },
      { n: "$0", l: "cost of every session, five years running" },
      { n: "2021", l: "Sequoia India's Surge said yes" }
    ],
    autonomyLens: "Tesla's bet was that the fleet learns fastest when nothing meters the miles — every free mile driven feeds the system that improves every car. ADPList runs the same physics on advice: unmetered sessions maximize the volume of mentorship flowing through the network, and that volume — 600 million minutes of it — is what trains both the community's reputation graph and products like AI Interview Practice. Put a toll on the road and the fleet drives less; charge for sessions and the learning flywheel slows. Felix's refusal to monetize isn't idealism wearing a business costume — it's the same architecture decision the autonomy industry made about data.",
    counter: {
      claim: "Free isn't a business model. A Sequoia-backed marketplace that won't charge after five years and a million users isn't patient — it's a charity with a cap table, and eventually the investors' patience becomes the product.",
      response: "The episode's answer distinguishes the network from the revenue. Marketplaces die when they monetize the wrong side too early — tax the supply of goodwill and the 39,000 mentors who came to give back quietly leave. ADPList's model keeps the trust layer free forever and builds revenue beside it: AI products trained on the network's patterns, enterprise offerings, career tooling — things the free network makes uniquely possible and uniquely credible. Whether that's discipline or delay is the tension the ride leans into; Felix's case is that every year of free compounds an asset no funded competitor can copy, because you can't buy your way to 600 million minutes of generosity."
    },
    faq: [
      { q: "Is ADPList really free?", a: "Yes — every 1:1 mentorship session on ADPList is free, and has been since launch. The platform connects learners with ~39,000 verified mentors across design, product, engineering, AI and marketing at no cost. Revenue comes from products built around the network, not from charging for sessions." },
      { q: "Who backs ADPList?", a: "ADPList was backed by Sequoia India's Surge in 2021, alongside angel investors from Airbnb, Gojek and Zendesk, and usability pioneer Jakob Nielsen. Despite venture backing, the core mentorship product has stayed free." },
      { q: "Will AI replace human mentorship?", a: "Felix Lee's view on the episode: AI absorbs the rehearsal layer — interview practice, preparation, repetitive Q&A — while human mentors concentrate on what machines can't provide: lived experience applied to your specific situation, conviction, and belief. ADPList builds both: free human sessions and AI Interview Practice." },
      { q: "Who is Felix Lee?", a: "Felix Lee is the co-founder and CEO of ADPList, the world's largest free mentorship community. He never finished a university degree, sold his first company while still in high school, went through Passpod's IPO, and took a deliberate two-year gap before starting ADPList." }
    ]
  },
  {
    slug: "ai-secondhand-clothing-supply-chain-fleek",
    ep: 9, id: "AR18l-xBY6Q", date: "2026-07-26", dateHuman: "Jul 26, 2026", duration: "59:24",
    guest: "Sanket Agarwal", role: "Cofounder @ Fleek (YC W22)", company: "Fleek",
    title: "The $25M Bet on What Happens to Your <em>Old Clothes</em>",
    seoTitle: "How AI Is Rebuilding the Secondhand Clothing Trade | The Tesla Pod",
    seoDesc: "Fleek raised $25M to fix what happens to donated clothes. Sanket Agarwal on the offline resale supply chain and AI that grades garments from one photo.",
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
    seoTitle: "AI Agent Swarms and the Coming Agent Security War | The Tesla Pod",
    seoDesc: "Hundreds of sandboxed AI agents from one API call. Jason Jin (ex-Google) of Funky on agent swarms, cost control and agent-vs-agent security.",
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
    seoTitle: "Automating the $1 Trillion Consulting Industry | The Tesla Pod",
    seoDesc: "Fortune 500s pay consultants millions and wait months. Ontora (YC P26) has AI interview every employee and maps how work gets done in 24 hours.",
    keywords: "AI consulting, automating consulting, Ontora, YC P26, organizational mapping AI, McKinsey alternative, AI employee interviews, enterprise AI",
    hook: "McKinsey takes months and millions. Their AI interviews every employee and delivers in a day.",
    sub: "When a Fortune 500 wants to understand how it actually works, it pays consultants millions and waits months for a slide deck. David, Leon and their cofounder Max built Ontora — an AI agent that interviews every employee, maps how work really gets done, and delivers the answer in 24 hours.",
    bigIdea: [
      "The core insight of this ride: the expensive part of consulting was never the recommendations — it was the data collection. Armies of associates interviewing staff, shadowing workflows, and stitching together how an org actually functions. That's precisely the part an AI agent can do at full coverage instead of a sample, in parallel instead of sequentially.",
      "Interviewing <em>every</em> employee changes the product category. A consultant samples twenty people and extrapolates; Ontora talks to everyone and aggregates. The deliverable stops being an opinion and starts being a measurement — an X-ray of the org chart as it really operates, not as it's drawn."
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
    about: "Ontora (YC P26) deploys AI agents that interview every employee in a company and deliver a map of how work actually gets done — in about 24 hours, not months. Founded by David Korn, Leon Iwanowitsch, and Max.",
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
    seoTitle: "Proactive AI Copilots, and Leaving a PhD for YC | The Tesla Pod",
    seoDesc: "Anushka Idamekorala left his PhD to build Logical (YC F25), a desktop copilot that learns how you work and helps before you ask. From The Tesla Pod.",
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
    seoTitle: "Agentic Browsing: Your Browser Will Drive Itself | The Tesla Pod",
    seoDesc: "rtrvr.ai cofounders Arjun Chintapalli and Bhavani Kalisetty on DOM-native AI agents that click, fill forms and finish tasks on the web for you.",
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
    seoTitle: "How AI Is Replacing Customer Success Teams | The Tesla Pod",
    seoDesc: "Peazy Labs on why customer success is being rebuilt as an AI concierge inside the product, guiding every user in real time. Takeaways from The Tesla Pod.",
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
    seoTitle: "The $5 Trillion Small-Business Succession Problem | The Tesla Pod",
    seoDesc: "10,000 Boomers retire every day and 80% of small businesses fail to sell. Laila Gamaleldin of Silver Surf on exits, ESOPs and leaving big tech.",
    keywords: "small business succession, silver tsunami, baby boomer business exits, Silver Surf, Laila Gamaleldin, ESOP, employee ownership, selling a small business, business exit value, leaving big tech",
    hook: "10,000 Boomers retire every day — and 80% of their businesses never sell.",
    sub: "Laila Gamaleldin left Google, then TikTok, to build software for people who own dry cleaners in Michigan. Silver Surf helps small-business owners sell faster, at a better valuation and with a higher success rate — because when most small businesses never find a buyer, a generation of plumbers, mechanics and restaurant owners watches its life's work disappear on retirement day.",
    bigIdea: [
      "While tech chases the same ten SaaS categories, one of the largest wealth transfers in American history is happening on Main Street — in dry cleaners, plumbing outfits, restaurants and repair shops. Ten thousand Baby Boomers retire every day, and roughly 80% of small businesses never sell. The problem usually isn't that these are bad businesses. It's that selling one is a slow, opaque, broker-driven process built for people who have never needed a data room.",
      "Silver Surf's move is to make the exit itself the product: software that helps an owner sell faster, at a better valuation, with a higher chance the deal actually closes. The episode's sharpest thread is ESOPs — selling the company to the people who already run it. Employee ownership is a buyer that already exists inside most of these businesses, and almost nobody on Main Street knows how to use it."
    ],
    takeaways: [
      "<b>The silver tsunami is a market, not a headline.</b> 10,000 Boomers retire every day and most small businesses never sell — a multi-trillion-dollar handoff with almost no modern tooling.",
      "<b>The buyer might already be on payroll.</b> An ESOP turns employees into owners — a succession path that pays the founder and keeps the business local, yet is rarely explained to the owners it fits best.",
      "<b>Build for people who've never opened a Notion doc.</b> Silver Surf is building five tools at once for owners who don't live in software, so every screen has to earn its place in a busy day.",
      "<b>Unsexy compounds.</b> The biggest opportunities hide in markets tech ignores because the customers don't look like tech customers.",
      "<b>Leaving big tech is a decision about time.</b> Laila's case against big tech isn't about pay. It's about what your hours are spent on, and whose life's work they protect."
    ],
    themes: [
      { h: "Why tech missed a $5T market", p: "Fragmented customers, offline workflows and zero glamour — the ride unpacks why the biggest problem on Main Street has the shortest startup list, and why that's exactly the opportunity." },
      { h: "ESOPs: the exit hiding in plain sight", p: "Employee ownership lets an owner sell to the team that already runs the place. The conversation gets into why it's so rarely used on Main Street and why it might be the answer everyone is missing." },
      { h: "From Google and TikTok to dry cleaners in Michigan", p: "Why Laila walked away from big tech, what she thinks it gets fundamentally wrong about how time should be spent, and the night she told her Egyptian parents she was quitting." }
    ],
    about: "Silver Surf builds software that helps small-business owners sell their business faster, at a better valuation and with a higher success rate — including exits to employees through ESOPs. Founded by Laila Gamaleldin, who left Google and TikTok to build it. Since the episode was recorded, silversurf.co has shifted its focus to occupancy optimization for skilled-nursing facilities.",
    whyNow: "Ten thousand Baby Boomers retire every day, and they own a large share of America's profitable small businesses — most with no succession plan. Every year of delay means more of those businesses closing instead of changing hands. Software finally makes it cheap to do the preparation, valuation and buyer-matching work that used to take brokers, lawyers and months of back-and-forth.",
    numbers: [
      { n: "10,000", l: "Baby Boomers retiring every day" },
      { n: "80%", l: "of small businesses fail to sell" },
      { n: "$5T", l: "in Main Street value facing a handoff" }
    ],
    autonomyLens: "A small business that only runs when its owner is behind the wheel is a car only one person can drive — and when that driver retires, most of these cars simply park for good. Silver Surf works on the handover: get the business ready for someone else to take the wheel, then find that someone — sometimes the crew that's been riding along all along, through an ESOP. Autonomy earns trust on evidence, not promises, and a business sells the same way: the owner who can show clean numbers, working systems and a ready successor gets the better check.",
    counter: {
      claim: "Small-business owners are the hardest customers in software — skeptical, busy and wary of new tools. A 68-year-old dry-cleaner owner in Michigan is not going to adopt a startup's platform to plan an exit.",
      response: "Laila's answer is to sell the outcome, not the software. Owners won't buy 'succession tooling', but every one of them cares about what their life's work sells for — and whether it sells at all. That's also why the team builds for people who have never opened a Notion doc: the product has to feel like help, not homework. And when most listed businesses never sell, the alternative to trying something new isn't the status quo. It's closing the doors."
    },
    faq: [
      { q: "What is the silver tsunami in small business?", a: "The 'silver tsunami' is the wave of Baby Boomer business owners reaching retirement. About 10,000 Boomers retire every day, and many own profitable small businesses that must be sold, passed down or closed — trillions of dollars in value with little modern tooling for the transition." },
      { q: "Why do small businesses fail to sell?", a: "Roughly 80% of small businesses never sell. Common reasons: the business depends on the owner, the financials aren't buyer-ready, the process runs through slow broker networks, and owners start too late. Preparing early, and considering buyers like employees through an ESOP, improves the odds." },
      { q: "What is an ESOP?", a: "An ESOP (employee stock ownership plan) lets an owner sell part or all of a company to its employees through a trust. On the episode, Laila argues it's one of the most overlooked exit paths for retiring small-business owners, because it pays the founder and keeps the business running and local." },
      { q: "What is Silver Surf?", a: "Silver Surf, founded by Laila Gamaleldin, builds software that helps small-business owners sell their business faster, at a better valuation and with a higher success rate — including exits to employees through ESOPs. Laila joined The Tesla Pod on episode 03." }
    ]
  },
  {
    slug: "raising-yc-at-18-manicule",
    ep: 2, id: "EMmH7ECJ-IQ", date: "2026-05-11", dateHuman: "May 11, 2026", duration: "46:30",
    guest: "Shreyans Jain & Naman Bansal", role: "Cofounders @ Manicule (YC P26)", company: "Manicule",
    title: "They Raised $500K from YC <em>at 18</em>",
    seoTitle: "Raising $500K from Y Combinator at 18 | The Tesla Pod",
    seoDesc: "Shreyans Jain and Naman Bansal were rejected by YC at 15 and funded at 18. Manicule's founders on AI-native docs and betting on yourself early.",
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
    seoTitle: "Testing Software the Way Self-Driving Cars Learn | The Tesla Pod",
    seoDesc: "The ride that started The Tesla Pod: Yasith Jayawardana on testing software with simulated users before launch, the way autonomy is trained.",
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
  <meta name="theme-color" content="#fbfaf8" />
  <script>
    (function () {
      var d = document.documentElement, t = null;
      try { t = localStorage.getItem("tp-theme"); } catch (e) {}
      if (t === "dark" || t === "light") d.setAttribute("data-theme", t);
      var m = document.querySelector('meta[name="theme-color"]');
      if (m) m.setAttribute("content", d.getAttribute("data-theme") === "dark" ? "#101012" : "#fbfaf8");
    })();
  </script>
  <link rel="icon" type="image/svg+xml" href="/assets/brand/favicon.svg" />
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/brand/favicon-32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/brand/favicon-16.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/brand/apple-touch-icon.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700&family=Inter:wght@400;500;600&family=Instrument+Serif:ital@1&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/styles.css" />
  <link rel="alternate" type="application/rss+xml" title="The Tesla Pod — new episodes" href="/feed.xml" />`;

const NAV = `
  <header class="nav" id="nav">
    <a class="nav-logo" href="/" aria-label="The Tesla Pod — home">
      <span class="nav-word"><em>The</em> Tesla Pod</span>
    </a>
    <nav class="nav-links" aria-label="Primary">
      <a href="/episodes">Episodes</a>
      <a href="/insights">Insights</a>
      <a href="/#passengers">Passengers</a>
      <a href="/#apply" class="nav-cta">Be a Guest</a>
    </nav>
    <div class="nav-actions">
      <a class="nav-soc nav-yt" href="https://www.youtube.com/@TeslaPod" target="_blank" rel="noopener" aria-label="The Tesla Pod on YouTube">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z"/></svg>
      </a>
      <a class="nav-soc nav-li" href="https://www.linkedin.com/company/teslapod" target="_blank" rel="noopener" aria-label="The Tesla Pod on LinkedIn">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>
      </a>
      <a class="nav-soc nav-x" href="https://x.com/theteslapod" target="_blank" rel="noopener" aria-label="The Tesla Pod on X">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.66l7.73-8.84L1.24 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.11z"/></svg>
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
    <a href="/episodes">Episodes</a>
    <a href="/insights">Insights</a>
    <a href="/#passengers">Passengers</a>
    <a href="/#apply">Be a Guest</a>
    <a href="https://www.youtube.com/@TeslaPod" target="_blank" rel="noopener">YouTube ↗</a>
    <a href="https://www.linkedin.com/company/teslapod" target="_blank" rel="noopener">LinkedIn ↗</a>
    <a href="https://x.com/theteslapod" target="_blank" rel="noopener">X ↗</a>
  </div>`;

const FOOTER = `
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <a class="nav-logo" href="/" aria-label="The Tesla Pod — home">
          <span class="nav-word"><em>The</em> Tesla Pod</span>
        </a>
        <p>The Tesla podcast — conversations from the autonomous future.<br />Recorded on the move, somewhere in the Bay Area.</p>
        <div class="social-mini footer-social" aria-label="The Tesla Pod on social">
          <a class="sm-yt" href="https://www.youtube.com/@TeslaPod" target="_blank" rel="noopener" aria-label="The Tesla Pod on YouTube">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z"/></svg>
          </a>
          <a class="sm-li" href="https://www.linkedin.com/company/teslapod" target="_blank" rel="noopener" aria-label="The Tesla Pod on LinkedIn">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>
          </a>
          <a class="sm-x" href="https://x.com/theteslapod" target="_blank" rel="noopener" aria-label="The Tesla Pod on X">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true"><path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.66l7.73-8.84L1.24 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.11z"/></svg>
          </a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Ride along</h4>
        <a href="/episodes">Episodes</a>
        <a href="/insights">Insights</a>
        <a href="/#passengers">Passengers</a>
        <a href="/#apply">Be a guest</a>
      </div>
      <div class="footer-col">
        <h4>Get in touch</h4>
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
    var root = document.documentElement, saved = null, themingTimer = null;
    var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    try { saved = localStorage.getItem("tp-theme"); } catch (e) {}
    if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
    function syncThemeColor(t) {
      var m = document.querySelector('meta[name="theme-color"]');
      if (m) m.setAttribute("content", t === "dark" ? "#101012" : "#fbfaf8");
    }
    document.getElementById("themeToggle").addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      if (!reduced) {
        root.classList.add("theming");
        clearTimeout(themingTimer);
        themingTimer = setTimeout(function () { root.classList.remove("theming"); }, 420);
      }
      root.setAttribute("data-theme", next);
      syncThemeColor(next);
      try { localStorage.setItem("tp-theme", next); } catch (e) {}
    });
    var burger = document.getElementById("navBurger"), menu = document.getElementById("mobileMenu");
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.getElementById("year").textContent = new Date().getFullYear();
    // lazy images ease in once decoded — opt into the fade only now that JS is running
    (function fadeImgs() {
      document.documentElement.classList.add("img-fade");
      document.querySelectorAll("img[loading='lazy']").forEach(function (img) {
        if (img.complete && img.naturalWidth) { img.classList.add("loaded"); return; }
        img.addEventListener("load", function () { img.classList.add("loaded"); }, { once: true });
        img.addEventListener("error", function () { img.classList.add("loaded"); }, { once: true });
      });
    })();
    // reading progress + nav presence on scroll
    var bar = document.getElementById("inProgress"), nav = document.getElementById("nav");
    function onScroll() {
      var h = document.documentElement, y = h.scrollTop;
      if (bar) bar.style.width = (y / (h.scrollHeight - h.clientHeight || 1)) * 100 + "%";
      if (nav) nav.classList.toggle("scrolled", y > 8);
    }
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
    // article blocks rise in as they enter view
    var blocks = document.querySelectorAll(".in-article > *");
    if (blocks.length && !reduced && "IntersectionObserver" in window) {
      var rio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.remove("in-vis-wait"); en.target.classList.add("in-vis"); rio.unobserve(en.target); } });
      }, { rootMargin: "0px 0px -6% 0px", threshold: 0 });
      blocks.forEach(function (b) { b.classList.add("in-vis-wait"); rio.observe(b); });
    }
    // copy link
    var copyBtn = document.querySelector(".sh-copy");
    if (copyBtn) copyBtn.addEventListener("click", function () {
      var url = copyBtn.getAttribute("data-url"), label = copyBtn.querySelector("span");
      function flash(text, cls) {
        if (cls) copyBtn.classList.add(cls);
        label.textContent = text;
        setTimeout(function () { copyBtn.classList.remove("done"); label.textContent = "Copy link"; }, 1800);
      }
      function done() { flash("Link copied", "done"); }
      function fail() { flash("Couldn\u2019t copy"); }
      function legacy() {
        var t = document.createElement("textarea"), ok = false;
        t.value = url; t.setAttribute("readonly", ""); t.style.cssText = "position:fixed;top:0;left:0;opacity:0;font-size:16px";
        document.body.appendChild(t); t.select(); t.setSelectionRange(0, url.length);
        try { ok = document.execCommand("copy"); } catch (e) {}
        t.remove();
        ok ? done() : fail();
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, legacy);
      else legacy();
    });
    // scrollspy for the article table of contents
    var tocLinks = document.querySelectorAll(".in-toc a[href^='#']");
    if (tocLinks.length) {
      var map = {}, current = null, spyQueued = false;
      tocLinks.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
      var heads = Array.prototype.filter.call(document.querySelectorAll(".in-article h2[id]"), function (h) { return map[h.id]; });
      function spy() {
        spyQueued = false;
        var h = document.documentElement, navH = parseFloat(getComputedStyle(h).getPropertyValue("--nav-h")) || 64;
        var line = navH + 40, active = null;
        heads.forEach(function (el) { if (el.getBoundingClientRect().top <= line) active = el; });
        // bottom of the page: the final (often short) section is the one being read
        if (h.scrollTop + h.clientHeight >= h.scrollHeight - 4 && heads.length) active = heads[heads.length - 1];
        var link = active ? map[active.id] : null;
        if (link === current) return;
        if (current) current.classList.remove("on");
        current = link;
        if (current) current.classList.add("on");
      }
      addEventListener("scroll", function () { if (!spyQueued) { spyQueued = true; requestAnimationFrame(spy); } }, { passive: true });
      addEventListener("resize", spy);
      spy();
    }
  })();
  </script>`;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const plain = (s) => String(s).replace(/<[^>]+>/g, "");
// WebP variants come from tools/build-thumbs.mjs; on any failure fall back to the YouTube still
const thumbSet = (id) => [320, 640, 960, 1280].map((w) => `/assets/thumbs/${id}-${w}.webp ${w}w`).join(", ");
const thumbErr = (id) => `this.onerror=null;this.removeAttribute('srcset');this.src='https://img.youtube.com/vi/${id}/hqdefault.jpg'`;
// reading time from every prose field on the page (220 wpm)
function readingTime(it) {
  const text = [it.sub, ...it.bigIdea, it.whyNow, ...it.takeaways, ...it.themes.map((t) => t.h + " " + t.p),
    it.autonomyLens, it.counter.claim, it.counter.response, it.about, ...it.faq.map((f) => f.q + " " + f.a)]
    .map(plain).join(" ");
  return Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 220));
}

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
    dateModified: "__LASTMOD__",
    author: { "@type": "Person", name: "Irosha de Silva", jobTitle: "Host, The Tesla Pod", url: "https://www.irosha.com", sameAs: ["https://www.irosha.com", "https://www.linkedin.com/in/iroshads/", "https://x.com/iroshads"] },
    publisher: { "@type": "Organization", name: "The Tesla Pod", url: `${SITE}/` },
    mainEntityOfPage: url,
    keywords: it.keywords,
    about: {
      "@type": "PodcastEpisode",
      episodeNumber: it.ep,
      name: plain(it.title),
      url: episodeById(it.id) ? episodeUrl(episodeById(it.id)) : `https://www.youtube.com/watch?v=${it.id}`,
      sameAs: `https://www.youtube.com/watch?v=${it.id}`,
      partOfSeries: { "@type": "PodcastSeries", name: "The Tesla Pod", url: `${SITE}/` }
    }
  };
  const epPage = episodeById(it.id) ? `/episodes/${episodeById(it.id).slug}` : null;
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
  const n = INSIGHTS.length, skip = new Set([it.slug, prev && prev.slug, next && next.slug]);
  const related = [2, -2, 3, -3, 4, -4].map((d) => INSIGHTS[(i + d + n) % n])
    .filter((x, k, a) => !skip.has(x.slug) && a.indexOf(x) === k).slice(0, 3);
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
  <div class="in-progress" id="inProgress" aria-hidden="true"></div>
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
        <span class="in-read">${readingTime(it)} MIN READ</span>
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
        ${epPage ? `<a class="btn btn-ghost" href="${epPage}">Episode page &amp; show notes</a>` : ""}
      </div>
      <div class="in-share" aria-label="Share this article">
        <span class="in-share-label">Share</span>
        <a class="sh-x" href="https://x.com/intent/post?text=${encodeURIComponent(plain(it.title) + " — via @theteslapod")}&url=${encodeURIComponent(url)}" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.66l7.73-8.84L1.24 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.11z"/></svg>Post on X
        </a>
        <a class="sh-li" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>Share on LinkedIn
        </a>
        <button type="button" class="sh-copy" data-url="${url}">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg><span>Copy link</span>
        </button>
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
      ${epPage ? `<a href="${epPage}">Episode page &amp; show notes</a>` : ""}
      <a class="in-toc-watch" href="https://www.youtube.com/watch?v=${it.id}" target="_blank" rel="noopener">▶ Watch the episode</a>
    </aside>
    </div>
    <section class="in-related">
      <h2>More insights from the pod</h2>
      <div class="insights-grid">
        ${related.map((r) => `<a class="in-card in-card-sm" href="/insights/${r.slug}">
        <div class="in-card-media">
          <img loading="lazy" src="/assets/thumbs/${r.id}.jpg" srcset="${thumbSet(r.id)}" sizes="(max-width: 640px) 220vw, (max-width: 1020px) 110vw, 800px" alt="${esc(plain(r.title))} — The Tesla Pod episode ${String(r.ep).padStart(2, "0")}" onerror="${thumbErr(r.id)}" />
        </div>
        <span class="in-card-ep" aria-hidden="true">${String(r.ep).padStart(2, "0")}</span>
        <div class="in-card-body">
          <span class="in-card-kicker">${esc(r.company)}</span>
          <h3>${r.title.replace(/<\/?em>/g, "")}</h3>
          <span class="in-card-go">Read the insights <i aria-hidden="true">→</i></span>
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
  <title>Founder Insights from The Tesla Pod, the Tesla Podcast</title>
  <meta name="description" content="Big ideas, numbers and takeaways from every episode of The Tesla Pod: AI agents, agentic browsing, AI customer success, YC founders and more." />
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
        <div class="in-card-media">
          <img loading="lazy" src="/assets/thumbs/${it.id}.jpg" srcset="${thumbSet(it.id)}" sizes="(max-width: 640px) 230vw, (max-width: 1020px) 115vw, 860px" alt="${esc(plain(it.title))} — The Tesla Pod episode ${String(it.ep).padStart(2, "0")}" onerror="${thumbErr(it.id)}" />
        </div>
        <span class="in-card-ep" aria-hidden="true">${String(it.ep).padStart(2, "0")}</span>
        <div class="in-card-body">
          <span class="in-card-kicker">${esc(it.company)} · ${esc(it.dateHuman)}</span>
          <h2>${it.title.replace(/<\/?em>/g, "")}</h2>
          <p>${esc(it.hook)}</p>
          <span class="in-card-go">Read the insights <i aria-hidden="true">→</i></span>
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

/* ===================================================================
   episodes: helpers
   =================================================================== */
const pad2 = (n) => String(n).padStart(2, "0");
const epLabel = (ep) => `EP ${pad2(ep.num)}`;
const durationParts = (d) => { const p = String(d).split(":").map(Number); return p.length === 3 ? p : [0, p[0] || 0, p[1] || 0]; };
const isoDuration = (d) => { const [h, m, s] = durationParts(d); return "PT" + (h ? h + "H" : "") + (m ? m + "M" : "") + (s || (!h && !m) ? s + "S" : ""); };
const durationSeconds = (d) => { const [h, m, s] = durationParts(d); return h * 3600 + m * 60 + s; };
const insightFor = (ep) => INSIGHTS.find((x) => x.id === ep.id);
const isoDate = (ep) => (insightFor(ep) ? insightFor(ep).date : new Date(ep.releaseDate + " 12:00 UTC").toISOString().slice(0, 10));
const rfc822 = (iso) => new Date(iso + "T12:00:00Z").toUTCString();
// "Cofounders @ Ontora (YC P26)" → company label "Ontora (YC P26)", company key "Ontora"
const companyLabel = (role) => { const at = String(role || "").indexOf("@ "); return at === -1 ? "" : String(role).slice(at + 2).trim(); };
const companyKey = (label) => String(label || "").replace(/\s*\([^)]*\)\s*$/, "").trim();
const guestsOf = (ep) => PEOPLE.filter((p) => p.episodeId === ep.id && !p.isHost);
const HOST = PEOPLE.find((p) => p.isHost);
const HOST_SAME_AS = ["https://www.irosha.com", "https://www.linkedin.com/in/iroshads/", "https://x.com/iroshads"];
const SHOW_SAME_AS = ["https://www.youtube.com/@TeslaPod", "https://www.linkedin.com/company/teslapod", "https://x.com/theteslapod"];
const absAsset = (p) => `${SITE}/${String(p).replace(/^\//, "")}`;
const xmlEsc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/* ---------- transcripts (optional, per episode) ---------- */
// content/transcripts/<id>.json  → [{ t: seconds, text }]   (what YouTube's transcript panel gives)
// content/transcripts/<id>.srt|.vtt → caption file downloaded from YouTube Studio
async function loadTranscript(id) {
  for (const ext of ["json", "srt", "vtt"]) {
    const f = join(root, "content", "transcripts", `${id}.${ext}`);
    if (!existsSync(f)) continue;
    const raw = await readFile(f, "utf8");
    if (ext === "json") return JSON.parse(raw);
    const cues = [];
    for (const block of raw.replace(/\r/g, "").split(/\n\n+/)) {
      const m = block.match(/(?:(\d{1,2}):)?(\d{1,2}):(\d{2})[.,]\d{3}\s*-->/);
      if (!m) continue;
      const t = (m[1] ? +m[1] * 3600 : 0) + +m[2] * 60 + +m[3];
      const text = block.split("\n").filter((l) => !/-->/.test(l) && !/^\d+$/.test(l.trim()) && !/^WEBVTT/.test(l))
        .join(" ").replace(/<[^>]+>/g, "").trim();
      if (text && (!cues.length || cues[cues.length - 1].text !== text)) cues.push({ t, text });
    }
    return cues;
  }
  return null;
}
// auto-captions: drop sound tags and fillers, collapse stutters, fix names the recogniser mangles
const TX_FIXES = [
  [/\bTesla pod\b/g, "Tesla Pod"], [/\bsilicon mania\b/gi, "Silicon Mania"], [/\bSiliconia\b/g, "Silicon Mania"],
  [/\bSilicon Money\b/g, "Silicon Mania"], [/\bMr\.? ?Beast\b/g, "MrBeast"], [/\bTik Tok\b/g, "TikTok"],
  [/\bWhimos\b/g, "Waymos"], [/\bWhimo\b/g, "Waymo"], [/\bFounders Fen\b/g, "Founders Fund"], [/\bA6Z\b/g, "a16z"]
];
function cleanTranscriptText(text) {
  let s = " " + text + " ";
  s = s.replace(/\[[^\]]*\]/g, " ");
  s = s.replace(/\b(?:uh|um|uhm|erm)\b[,.]?\s*/gi, "");
  for (let i = 0; i < 3; i++) s = s.replace(/\b([\w']+)(?:,?\s+\1\b)+/gi, "$1");
  for (const [re, to] of TX_FIXES) s = s.replace(re, to);
  return s.replace(/\s+([,.?!])/g, "$1").replace(/\s{2,}/g, " ").trim();
}
// ~40-second paragraphs, preferring to break at the end of a sentence
function transcriptParagraphs(segs) {
  const out = [];
  let cur = null;
  for (const seg of segs) {
    const text = cleanTranscriptText(seg.text);
    if (!text) continue;
    if (!cur) cur = { t: seg.t, parts: [] };
    cur.parts.push(text);
    const span = seg.t - cur.t;
    if ((span >= 35 && /[.?!]$/.test(text)) || span >= 70) { out.push(cur); cur = null; }
  }
  if (cur) out.push(cur);
  return out.map((p) => {
    const s = p.parts.join(" ");
    return { t: p.t, text: s.charAt(0).toUpperCase() + s.slice(1) };
  });
}
const clock = (sec) => { const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = Math.floor(sec % 60); return (h ? h + ":" + pad2(m) : m) + ":" + pad2(s); };

/* ---------- shared episode card (episodes index, related rides) ---------- */
function episodeCard(ep, headingTag = "h3") {
  const co = companyLabel(ep.guestRole);
  return `<a class="ep-card" href="/episodes/${ep.slug}">
        <div class="ep-thumb">
          <img loading="lazy" src="/assets/thumbs/${ep.id}.jpg" srcset="${thumbSet(ep.id)}" sizes="(max-width: 700px) 100vw, (max-width: 1020px) 50vw, 400px" alt="${esc(ep.fullTitle)} — The Tesla Pod ${epLabel(ep)}" onerror="${thumbErr(ep.id)}" />
          <span class="dur">${esc(ep.duration)}</span>
        </div>
        <div class="ep-body">
          <span class="ep-num">${epLabel(ep)} · ${esc(ep.releaseDate)}</span>
          <${headingTag}>${esc(ep.title)}</${headingTag}>
          <div class="ep-guest">with <b>${esc(ep.guest)}</b>${co ? " · " + esc(co) : ""}</div>
        </div>
      </a>`;
}

/* ===================================================================
   episode page
   =================================================================== */
function episodePage(ep, i, transcript) {
  const c = EPISODE_CONTENT[ep.id];
  if (!c) throw new Error(`no EPISODE_CONTENT entry for ${ep.id} (${ep.title}) — add it to tools/episodes-content.mjs`);
  const url = episodeUrl(ep);
  const img = `${IMG_HOST}/assets/thumbs/${ep.id}.jpg`;
  const watch = `https://www.youtube.com/watch?v=${ep.id}`;
  const older = EPISODES[i + 1], newer = EPISODES[i - 1];
  const ins = insightFor(ep);
  const coLabel = companyLabel(ep.guestRole), coKey = companyKey(coLabel), co = COMPANIES[coKey];
  const guests = guestsOf(ep);
  const date = isoDate(ep);
  const paras = transcript && transcript.length ? transcriptParagraphs(transcript) : null;
  const txWords = paras ? paras.reduce((n, p) => n + p.text.split(/\s+/).length, 0) : 0;
  const personLd = (p) => ({
    "@type": "Person", name: p.name, jobTitle: p.role,
    worksFor: { "@type": "Organization", name: companyKey(p.company), ...(COMPANIES[companyKey(p.company)] ? { url: COMPANIES[companyKey(p.company)].url } : {}) },
    image: absAsset(p.photo),
    ...((c.guestLinks || {})[p.name] ? { sameAs: c.guestLinks[p.name].map((l) => l.url) } : {})
  });
  const videoLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": url + "#video",
    name: ep.fullTitle,
    description: c.seoDesc,
    thumbnailUrl: [img, `https://i.ytimg.com/vi/${ep.id}/maxresdefault.jpg`],
    uploadDate: c.publishedAt || date,
    duration: isoDuration(ep.duration),
    embedUrl: `https://www.youtube.com/embed/${ep.id}`,
    url,
    publisher: { "@type": "Organization", name: "The Tesla Pod", url: `${SITE}/`, logo: { "@type": "ImageObject", url: `${SITE}/assets/brand/icon-192.png` } }
  };
  const episodeLd = {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: ep.title,
    episodeNumber: ep.num,
    url,
    sameAs: watch,
    datePublished: date,
    description: plain(c.summary[0]),
    timeRequired: isoDuration(ep.duration),
    image: img,
    inLanguage: "en",
    partOfSeries: { "@type": "PodcastSeries", name: "The Tesla Pod", url: `${SITE}/` },
    author: { "@type": "Person", name: HOST.name, url: HOST_SAME_AS[0], sameAs: HOST_SAME_AS },
    actor: guests.map(personLd),
    associatedMedia: { "@id": url + "#video" }
  };
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "The Tesla Pod", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Episodes", item: `${SITE}/episodes` },
      { "@type": "ListItem", position: 3, name: `${epLabel(ep)}: ${ep.title}`, item: url }
    ]
  };
  const n = EPISODES.length;
  const skip = new Set([ep.id, older && older.id, newer && newer.id]);
  const related = [2, -2, 3, -3, 4, -4].map((d) => EPISODES[(i + d + n) % n])
    .filter((x, k, a) => !skip.has(x.id) && a.indexOf(x) === k).slice(0, 3);
  const guestNames = guests.map((g) => g.name);
  const withLine = guestNames.length > 1 ? guestNames.slice(0, -1).join(", ") + " and " + guestNames[guestNames.length - 1] : guestNames[0] || ep.guest;
  const toc = [
    ["about-episode", "About this episode"],
    ["topics", "What they get into"],
    ["passengers", guests.length > 1 ? "The passengers" : "The passenger"],
    co ? ["company", `About ${coKey}`] : null,
    ins ? ["insights", "The insights"] : null,
    paras ? ["transcript", "Transcript"] : null
  ].filter(Boolean);
  return `<!doctype html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
${GA}
  <title>${esc(c.seoTitle)}</title>
  <meta name="description" content="${esc(c.seoDesc)}" />
  <link rel="canonical" href="${url}" />
${HEAD_COMMON}
  <meta property="og:type" content="video.episode" />
  <meta property="og:site_name" content="The Tesla Pod" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${esc(ep.title)} — ${esc(withLine)} on The Tesla Pod" />
  <meta property="og:description" content="${esc(c.seoDesc)}" />
  <meta property="og:image" content="${img}" />
  <meta property="og:image:width" content="1280" />
  <meta property="og:image:height" content="720" />
  <meta property="og:image:alt" content="${esc(ep.fullTitle)}" />
  <meta property="og:video" content="https://www.youtube.com/embed/${ep.id}" />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:title" content="${esc(ep.title)} — ${esc(withLine)} on The Tesla Pod" />
  <meta property="twitter:description" content="${esc(c.seoDesc)}" />
  <meta property="twitter:image" content="${img}" />
  <script type="application/ld+json">${JSON.stringify(episodeLd)}</script>
  <script type="application/ld+json">${JSON.stringify(videoLd)}</script>
  <script type="application/ld+json">${JSON.stringify(crumbs)}</script>
</head>
<body>
  <div class="in-progress" id="inProgress" aria-hidden="true"></div>
${NAV}
  <main class="in-main ep-page">
    <nav class="in-crumbs" aria-label="Breadcrumb"><a href="/">The Tesla Pod</a><span>/</span><a href="/episodes">Episodes</a><span>/</span><span>${epLabel(ep)}</span></nav>
    <div class="in-hero">
      <h1>${esc(ep.title)}</h1>
      <p class="in-sub">${esc(withLine)}${coLabel ? ` of ${esc(coLabel)}` : ""}, riding through San Francisco in a self-driving Tesla with host ${esc(HOST.name)}.</p>
      <div class="in-meta">
        <span>EPISODE <b>${pad2(ep.num)}</b></span>
        <span>${esc(ep.releaseDate).toUpperCase()}</span>
        <span><b>${esc(ep.duration)}</b></span>
        ${coLabel ? `<span><b>${esc(coLabel)}</b></span>` : ""}
        ${paras ? `<span>TRANSCRIPT</span>` : ""}
      </div>
    </div>
    <div class="ep-video">
      <iframe src="https://www.youtube.com/embed/${ep.id}?rel=0" title="${esc(ep.fullTitle)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    </div>
    <div class="in-layout">
    <article class="in-article">
      <h2 id="about-episode">About this episode</h2>
      ${c.summary.map((p) => `<p>${esc(p)}</p>`).join("\n      ")}
      <h2 id="topics">What they get into</h2>
      <ul class="in-takeaways">
        ${c.topics.map((t) => `<li>${esc(t)}</li>`).join("\n        ")}
      </ul>
      ${c.audience ? `<p class="ep-audience">${esc(c.audience)}</p>` : ""}
      <h2 id="passengers">${guests.length > 1 ? "The passengers" : "The passenger"}</h2>
      <div class="ep-people">
        ${guests.map((g) => `<div class="ep-person">
          <img loading="lazy" src="/${esc(g.photo)}" alt="${esc(g.name)}" width="64" height="64" />
          <div>
            <h3>${esc(g.name)}</h3>
            <p>${esc(g.role)} · ${esc(g.company)}</p>
            ${(c.guestLinks || {})[g.name] ? `<p class="ep-person-links">${c.guestLinks[g.name].map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join("")}</p>` : ""}
          </div>
        </div>`).join("\n        ")}
      </div>
      ${co ? `<h2 id="company">About ${esc(coKey)}</h2>
      <p>${esc(co.about)}</p>
      <p class="ep-company-link"><a href="${esc(co.url)}" target="_blank" rel="noopener">${esc(co.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""))} ↗</a></p>` : ""}
      ${ins ? `<h2 id="insights">The insights</h2>
      <p>${esc(ins.hook)} The write-up pulls out the big idea, the numbers, the counterargument and what it means for the autonomous future.</p>
      <div class="in-watch">
        <span>${esc(plain(ins.title))}</span>
        <a class="btn btn-primary" href="/insights/${ins.slug}">Read the insights →</a>
      </div>` : ""}
      ${paras ? `<h2 id="transcript">Transcript</h2>
      <p class="ep-tx-note">Auto-generated from the episode audio and lightly cleaned up, so expect the odd misheard word. Each timestamp opens that moment on YouTube.</p>
      <details class="ep-transcript">
        <summary>Read the full transcript <span>${txWords.toLocaleString("en-US")} words</span></summary>
        <div class="ep-tx-body">
          ${paras.map((p) => `<p><a class="tx-t" href="${watch}&amp;t=${Math.floor(p.t)}s" target="_blank" rel="noopener">${clock(p.t)}</a> ${esc(p.text)}</p>`).join("\n          ")}
        </div>
      </details>` : ""}
      <div class="in-watch">
        <span>Watch ${epLabel(ep)} of The Tesla Pod on YouTube — ${esc(ep.duration)}, recorded on Tesla FSD in San Francisco.</span>
        <a class="btn btn-primary" href="${watch}" target="_blank" rel="noopener">▶ Watch on YouTube</a>
      </div>
      <div class="in-share" aria-label="Share this episode">
        <span class="in-share-label">Share</span>
        <a class="sh-x" href="https://x.com/intent/post?text=${encodeURIComponent(ep.title + " — " + withLine + " on @theteslapod")}&url=${encodeURIComponent(url)}" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.66l7.73-8.84L1.24 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.11z"/></svg>Post on X
        </a>
        <a class="sh-li" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>Share on LinkedIn
        </a>
        <button type="button" class="sh-copy" data-url="${url}">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg><span>Copy link</span>
        </button>
      </div>
      <nav class="in-prevnext" aria-label="More episodes">
        ${older ? `<a href="/episodes/${older.slug}">← ${epLabel(older)} · ${esc(older.title)}</a>` : "<span></span>"}
        ${newer ? `<a href="/episodes/${newer.slug}" style="text-align:right">${epLabel(newer)} · ${esc(newer.title)} →</a>` : "<span></span>"}
      </nav>
    </article>
    <aside class="in-toc" aria-label="On this page">
      <span class="in-toc-label">On this page</span>
      ${toc.map(([id, label]) => `<a href="#${id}">${esc(label)}</a>`).join("\n      ")}
      <a class="in-toc-watch" href="${watch}" target="_blank" rel="noopener">▶ Watch on YouTube</a>
    </aside>
    </div>
    <section class="in-related">
      <h2>More rides</h2>
      <div class="episode-grid">
      ${related.map((r) => episodeCard(r)).join("\n      ")}
      </div>
    </section>
  </main>
${FOOTER}
${PAGE_JS}
</body>
</html>
`;
}

/* ---------- /episodes ---------- */
function episodesIndexPage() {
  const url = `${SITE}/episodes`;
  const totalHours = Math.round(EPISODES.reduce((s, e) => s + durationSeconds(e.duration), 0) / 360) / 10;
  const ld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "All episodes — The Tesla Pod",
    description: "Every episode of The Tesla Pod, the Tesla podcast where startup founders talk while a self-driving Tesla drives San Francisco.",
    url,
    isPartOf: { "@type": "WebSite", name: "The Tesla Pod", url: `${SITE}/` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: EPISODES.length,
      itemListElement: EPISODES.map((ep, k) => ({ "@type": "ListItem", position: k + 1, url: episodeUrl(ep), name: `${epLabel(ep)}: ${ep.title}` }))
    }
  };
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "The Tesla Pod", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Episodes", item: url }
    ]
  };
  const guests = PEOPLE.filter((p) => !p.isHost).map((p) => p.name);
  return `<!doctype html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
${GA}
  <title>All Episodes of The Tesla Pod — The Tesla Podcast</title>
  <meta name="description" content="All ${EPISODES.length} episodes of The Tesla Pod: founders from YC, ex-Google and beyond, interviewed in a self-driving Tesla in San Francisco. Show notes and links for every ride." />
  <link rel="canonical" href="${url}" />
${HEAD_COMMON}
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="The Tesla Pod" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="All episodes — The Tesla Pod" />
  <meta property="og:description" content="Founders interviewed in a self-driving Tesla in San Francisco. Show notes for every ride." />
  <meta property="og:image" content="${IMG_HOST}/assets/brand/og.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="The Tesla Pod — the Tesla podcast" />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:title" content="All episodes — The Tesla Pod" />
  <meta property="twitter:description" content="Founders interviewed in a self-driving Tesla in San Francisco." />
  <meta property="twitter:image" content="${IMG_HOST}/assets/brand/og.jpg" />
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
  <script type="application/ld+json">${JSON.stringify(crumbs)}</script>
</head>
<body>
${NAV}
  <main class="in-main ep-index">
    <nav class="in-crumbs" aria-label="Breadcrumb"><a href="/">The Tesla Pod</a><span>/</span><span>Episodes</span></nav>
    <div class="in-hero">
      <h1>Every ride, <em>every founder.</em></h1>
      <p class="in-sub">All ${EPISODES.length} episodes of The Tesla Pod, the Tesla podcast recorded in a self-driving Tesla on the streets of San Francisco. ${totalHours} hours of founders talking AI agents, autonomy and company-building while nobody watches the road. Each page has the show notes, the guests and a link to the insights.</p>
      <div class="in-meta">
        <span><b>${EPISODES.length}</b> EPISODES</span>
        <span><b>${totalHours}</b> HOURS</span>
        <span><b>${guests.length}</b> GUESTS</span>
        <span>HOSTED BY <b>${esc(HOST.name).toUpperCase()}</b></span>
      </div>
    </div>
    <div class="episode-grid">
      ${EPISODES.map((ep) => episodeCard(ep, "h2")).join("\n      ")}
    </div>
  </main>
${FOOTER}
${PAGE_JS}
</body>
</html>
`;
}

/* ===================================================================
   home page: crawlable episode + guest markup, series JSON-LD
   (app.js re-renders these containers with the interactive versions)
   =================================================================== */
function homeFeatured(ep) {
  const ins = insightFor(ep);
  return `<article class="feat-card">
        <div class="feat-thumb"><img src="/assets/thumbs/${ep.id}.jpg" srcset="${thumbSet(ep.id)}" sizes="(max-width: 1020px) 100vw, 720px" alt="${esc(ep.fullTitle)} — The Tesla Pod episode thumbnail" /></div>
        <div class="feat-body">
          <div class="ep-meta"><span class="ep-chip hot">Latest · ${epLabel(ep)}</span><span class="ep-chip">${esc(ep.releaseDate)}</span><span class="ep-chip">${esc(ep.duration)}</span>${ins ? `<span class="ep-num-spacer"></span><a class="ep-insight" href="/insights/${ins.slug}">Insights →</a>` : ""}</div>
          <h3><a class="ep-link" href="/episodes/${ep.slug}">${esc(ep.title)}</a></h3>
          <p class="ep-desc">${esc(ep.description)}</p>
          <div class="ep-guest">with <b>${esc(ep.guest)}</b> · ${esc(ep.guestRole)}</div>
        </div>
      </article>`;
}
function homeGridCard(ep) {
  const ins = insightFor(ep), co = companyLabel(ep.guestRole);
  return `<article class="ep-card">
        <div class="ep-thumb"><img loading="lazy" src="/assets/thumbs/${ep.id}.jpg" srcset="${thumbSet(ep.id)}" sizes="(max-width: 700px) 100vw, (max-width: 1020px) 50vw, 400px" alt="${esc(ep.fullTitle)} — The Tesla Pod episode thumbnail" /><span class="dur">${esc(ep.duration)}</span></div>
        <div class="ep-body">
          <span class="ep-num">${epLabel(ep)} · ${esc(ep.releaseDate)}${ins ? `<span class="ep-num-spacer"></span><a class="ep-insight" href="/insights/${ins.slug}">Insights →</a>` : ""}</span>
          <h3><a class="ep-link" href="/episodes/${ep.slug}">${esc(ep.title)}</a></h3>
          <div class="ep-guest">with <b>${esc(ep.guest)}</b>${co ? " · " + esc(co) : ""}</div>
        </div>
      </article>`;
}
function homeHostCard() {
  return `<div class="host-photo"><img src="/${esc(HOST.photo)}" alt="${esc(HOST.name)}" /></div>
      <div class="host-body">
        <span class="host-label">The Host</span>
        <h3>${esc(HOST.name)}</h3>
        <p class="host-role">${esc(HOST.role)} · ${esc(HOST.company)}</p>
        <p class="host-bio">No studio. No steering wheel. Irosha rides Tesla FSD through San Francisco with the founders building the autonomous future — and asks the questions that only get answered when nobody’s watching the road.</p>
        <a class="modal-yt host-sub" href="https://www.youtube.com/@TeslaPod?sub_confirmation=1" target="_blank" rel="noopener">Subscribe on YouTube ↗</a>
      </div>`;
}
function homePersonCard(p) {
  const ep = episodeById(p.episodeId);
  return `<article class="person-card">
        <div class="person-photo"><img loading="lazy" src="/${esc(p.photo)}" alt="${esc(p.name)}" /></div>
        ${ep ? `<span class="person-play">▶ ${epLabel(ep)}</span>` : ""}
        <div class="person-body"><h3>${ep ? `<a class="ep-link" href="/episodes/${ep.slug}">${esc(p.name)}</a>` : esc(p.name)}</h3><p>${esc(p.role)} · ${esc(p.company)}</p></div>
      </article>`;
}
function seriesLd() {
  return {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    name: "The Tesla Pod",
    alternateName: ["The Tesla Podcast", "Tesla Pod", "Tesla Pod Podcast"],
    url: `${SITE}/`,
    description: "The Tesla Pod is the Tesla podcast recorded inside a self-driving Tesla on FSD. Host Irosha de Silva rides through San Francisco with startup founders — no studio, no script, nobody watching the road.",
    image: `${SITE}/assets/brand/og.jpg`,
    inLanguage: "en",
    genre: ["Technology", "Startups", "Autonomous Vehicles", "Entrepreneurship"],
    keywords: "Tesla podcast, self-driving Tesla, Tesla FSD, San Francisco, startup founders, autonomous driving, YC founders",
    webFeed: `${SITE}/feed.xml`,
    author: { "@type": "Person", name: HOST.name, jobTitle: "Host", url: HOST_SAME_AS[0], sameAs: HOST_SAME_AS, worksFor: { "@type": "Organization", name: "Marketrix AI", url: "https://marketrix.ai" } },
    publisher: { "@type": "Organization", name: "Marketrix AI", url: "https://marketrix.ai" },
    sameAs: SHOW_SAME_AS,
    workExample: EPISODES.map((ep) => ({
      "@type": "PodcastEpisode",
      episodeNumber: ep.num,
      name: ep.title,
      description: ep.description,
      datePublished: isoDate(ep),
      timeRequired: isoDuration(ep.duration),
      url: episodeUrl(ep),
      sameAs: `https://www.youtube.com/watch?v=${ep.id}`,
      image: `${SITE}/assets/thumbs/${ep.id}.jpg`
    }))
  };
}
function fillMarker(html, name, content) {
  const re = new RegExp(`(<!-- build:${name} -->)[\\s\\S]*?(<!-- /build:${name} -->)`);
  if (!re.test(html)) throw new Error(`index.html is missing the build:${name} markers`);
  // function replacer: content is full of "$25M"-style text that a replacement string would treat as patterns
  return html.replace(re, (_, open, close) => `${open}\n      ${content}\n      ${close}`);
}

/* ===================================================================
   write everything, with honest lastmod dates
   =================================================================== */
const TODAY = new Date().toISOString().slice(0, 10);
const manifestPath = join(root, "tools", "lastmod.json");
const manifest = existsSync(manifestPath) ? JSON.parse(await readFile(manifestPath, "utf8")) : {};
const lastmod = {};
// a page's date only moves when its content does; __LASTMOD__ tokens are filled in after hashing
async function emit(file, path, html) {
  const hash = createHash("sha1").update(html).digest("hex").slice(0, 16);
  const prev = manifest[path];
  const date = prev && prev.hash === hash ? prev.date : TODAY;
  manifest[path] = { hash, date };
  lastmod[path] = date;
  await writeFile(join(root, file), html.replace(/__LASTMOD__/g, date));
}

await mkdir(join(root, "insights"), { recursive: true });
await mkdir(join(root, "episodes"), { recursive: true });

await emit("insights/index.html", "/insights", landingPage());
for (let i = 0; i < INSIGHTS.length; i++) await emit(`insights/${INSIGHTS[i].slug}.html`, `/insights/${INSIGHTS[i].slug}`, articlePage(INSIGHTS[i], i));

const transcripts = {};
for (const ep of EPISODES) transcripts[ep.id] = await loadTranscript(ep.id);
await emit("episodes/index.html", "/episodes", episodesIndexPage());
for (let i = 0; i < EPISODES.length; i++) await emit(`episodes/${EPISODES[i].slug}.html`, `/episodes/${EPISODES[i].slug}`, episodePage(EPISODES[i], i, transcripts[EPISODES[i].id]));
// stale pages from renamed slugs would keep serving (and competing) — flag them
for (const f of await readdir(join(root, "episodes"))) {
  if (f !== "index.html" && !EPISODES.some((e) => `${e.slug}.html` === f)) console.warn(`! episodes/${f} no longer matches an episode — delete it`);
}

let home = await readFile(join(root, "index.html"), "utf8");
home = fillMarker(home, "series-ld", `<script type="application/ld+json">\n${JSON.stringify(seriesLd(), null, 2)}\n  </script>`);
home = fillMarker(home, "featured", homeFeatured(EPISODES[0]));
home = fillMarker(home, "grid", EPISODES.slice(1).map(homeGridCard).join("\n      "));
home = fillMarker(home, "host", homeHostCard());
home = fillMarker(home, "people", PEOPLE.filter((p) => !p.isHost).map(homePersonCard).join("\n      "));
await emit("index.html", "/", home);

/* ---------- sitemap.xml (with video entries for every episode page) ---------- */
const urlEntry = (path, priority, changefreq, extra = "") =>
  `  <url>\n    <loc>${SITE}${path === "/" ? "/" : path}</loc>\n    <lastmod>${lastmod[path]}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>${extra}\n  </url>`;
const videoEntry = (ep) => `
    <video:video>
      <video:thumbnail_loc>${SITE}/assets/thumbs/${ep.id}.jpg</video:thumbnail_loc>
      <video:title>${xmlEsc(ep.fullTitle)}</video:title>
      <video:description>${xmlEsc(EPISODE_CONTENT[ep.id].seoDesc)}</video:description>
      <video:player_loc>https://www.youtube.com/embed/${ep.id}</video:player_loc>
      <video:duration>${durationSeconds(ep.duration)}</video:duration>
      <video:publication_date>${EPISODE_CONTENT[ep.id].publishedAt || isoDate(ep)}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
    </video:video>`;
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${[
  urlEntry("/", "1.0", "weekly"),
  urlEntry("/episodes", "0.9", "weekly"),
  ...EPISODES.map((ep) => urlEntry(`/episodes/${ep.slug}`, "0.8", "monthly", videoEntry(ep))),
  urlEntry("/insights", "0.8", "weekly"),
  ...INSIGHTS.map((it) => urlEntry(`/insights/${it.slug}`, "0.7", "monthly"))
].join("\n")}
</urlset>
`;
await writeFile(join(root, "sitemap.xml"), sitemap);

/* ---------- feed.xml (RSS 2.0: one item per episode) ---------- */
const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>The Tesla Pod</title>
    <link>${SITE}/</link>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
    <description>The Tesla podcast recorded inside a self-driving Tesla. Host Irosha de Silva rides through San Francisco with startup founders.</description>
    <language>en-us</language>
    <lastBuildDate>${rfc822(isoDate(EPISODES[0]))}</lastBuildDate>
    <image><url>${SITE}/assets/brand/icon-192.png</url><title>The Tesla Pod</title><link>${SITE}/</link></image>
${EPISODES.map((ep) => {
  const c = EPISODE_CONTENT[ep.id], ins = insightFor(ep);
  return `    <item>
      <title>${xmlEsc(`${epLabel(ep)}: ${ep.title} — ${ep.guest}`)}</title>
      <link>${episodeUrl(ep)}</link>
      <guid isPermaLink="true">${episodeUrl(ep)}</guid>
      <pubDate>${rfc822(isoDate(ep))}</pubDate>
      <description>${xmlEsc(c.summary.join(" ") + (ins ? ` Insights: ${SITE}/insights/${ins.slug}` : "") + ` Watch: https://www.youtube.com/watch?v=${ep.id}`)}</description>
      <media:thumbnail url="${SITE}/assets/thumbs/${ep.id}.jpg" />
    </item>`;
}).join("\n")}
  </channel>
</rss>
`;
await writeFile(join(root, "feed.xml"), feed);

/* ---------- llms.txt: the plain-text summary assistants can read ---------- */
const llms = `# The Tesla Pod

> The Tesla Pod is a video podcast recorded inside a self-driving Tesla (Full Self-Driving, supervised) in San Francisco. Host ${HOST.name}, cofounder and CEO of ${HOST.company}, interviews startup founders while the car drives. ${EPISODES.length} episodes so far, published on YouTube.

- Host: ${HOST.name} (${HOST_SAME_AS[0]})
- Format: unscripted founder conversations, recorded in the car on Tesla FSD through San Francisco
- Watch: ${SHOW_SAME_AS[0]}
- LinkedIn: ${SHOW_SAME_AS[1]}
- X: ${SHOW_SAME_AS[2]}
- Be a guest: ${SITE}/#apply
- Contact and sponsorships: irosha@marketrix.ai
- Not affiliated with Tesla, Inc.

## Episodes

${EPISODES.map((ep) => `- [${epLabel(ep)}: ${ep.title}](${episodeUrl(ep)}): ${guestsOf(ep).map((g) => `${g.name} (${g.role}, ${g.company})`).join("; ") || ep.guest}. ${ep.releaseDate}, ${ep.duration}.`).join("\n")}

## Insights

${INSIGHTS.map((it) => `- [${plain(it.title)}](${SITE}/insights/${it.slug}): ${it.hook}`).join("\n")}

## Optional

- [All episodes](${SITE}/episodes)
- [RSS feed](${SITE}/feed.xml)
- [Sitemap](${SITE}/sitemap.xml)
`;
await writeFile(join(root, "llms.txt"), llms);

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`built: ${INSIGHTS.length} insights, ${EPISODES.length} episode pages (${Object.values(transcripts).filter(Boolean).length} with transcripts), episodes index, home pre-render, sitemap.xml, feed.xml, llms.txt`);
