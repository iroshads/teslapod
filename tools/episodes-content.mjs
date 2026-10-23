// Show notes for every episode page (/episodes/<slug>), keyed by YouTube video id.
// Source: each episode's official YouTube description, rewritten in the third person.
// publishedAt: the video's publish time on YouTube (watch page → "publishDate"), with timezone.
// Facts only — nothing here that the episode or its description doesn't state.
//
// New episode: add an entry (slug must match the "slug" in data.js), then run
//   node tools/build-site.mjs
// Optional transcript: drop content/transcripts/<videoId>.json ([{t, text}]) or .srt/.vtt
// (YouTube Studio → Subtitles → ⋮ → Download) and the page picks it up on the next build.

export const EPISODE_CONTENT = {
  "9Ejk8wq14ww": {
    publishedAt: "2026-08-24T11:01:36-07:00", // YouTube publish time — VideoObject.uploadDate
    seoTitle: "Adil Mania on Making Tech Media Fun | The Tesla Pod",
    seoDesc: "Silicon Mania cofounder Adil Mania on why tech media is boring, what “MrBeast meets NBC” means for tech, and five formats in eight months. The Tesla Pod EP 11.",
    summary: [
      "Adil Mania thinks tech media is the most boring media in the world. Food has shows. Fashion has shows. Sports has shows. Tech has ten thousand podcasts of founders talking to founders. On episode 11 of The Tesla Pod, host Irosha de Silva asks him whether this show is part of the problem.",
      "Adil grew up in Rabat, studied engineering in France, built in Paris, and now runs Silicon Mania out of San Francisco. In eight months the company has shipped five formats: a recap show, a print magazine, live events, original games and more. It is backed by Offline Ventures and Founders Inc, with angels including Guillermo Rauch and Dan Shipper, and sponsored by Rippling, ElevenLabs, PostHog and Convex."
    ],
    topics: [
      "Why Adil thinks every existing tech show is getting it wrong",
      "Whether a founder interviewing a founder in a car is exactly the problem he's describing",
      "What “MrBeast meets NBC” actually means for tech",
      "Why he walked away from a profitable AI agency because it felt meaningless",
      "The Paris hackerspace that shut down when no European investor would lead",
      "What it's like being called Chief Vibes Officer"
    ],
    audience: "For anyone who makes things, watches things, or thinks tech deserves better stories."
  },
  "g57WpguhxXA": {
    publishedAt: "2026-08-11T04:31:03-07:00", // YouTube publish time — VideoObject.uploadDate
    seoTitle: "Felix Lee on Why ADPList Is Still Free | The Tesla Pod",
    seoDesc: "ADPList CEO Felix Lee on keeping mentorship free at a million users, Sequoia's backing, AI interview practice and skipping the degree. The Tesla Pod EP 10.",
    summary: [
      "Sequoia said yes in 2021. A million users later, a mentorship session on ADPList still costs nothing. Nearly 39,000 mentors, 600 million minutes of advice, 140 countries: a marketplace that size would normally have monetised years ago, and most investors would have pushed hard for it. Felix Lee has been asked to justify that decision for five years, and he still won't move on it.",
      "Felix is the cofounder and CEO of ADPList, the largest free mentorship community in the world. He never finished a university degree, sold his first company while still in high school, and went through Passpod's IPO before taking a deliberate two-year gap to work out what he actually wanted to build. ADPList was backed by Sequoia India's Surge in 2021, alongside angels from Airbnb, Gojek and Zendesk, and usability pioneer Jakob Nielsen."
    ],
    topics: [
      "Why every mentorship session is still free, and what that choice actually costs",
      "What he learned selling a company before he finished school",
      "Why he took two years off before starting ADPList",
      "Whether AI replaces human mentorship or finally makes it scale",
      "The thinking behind ADPList's AI Interview Practice",
      "Why he believes not everything needs to be usable to be valuable",
      "What he'd tell someone starting with none of the usual advantages"
    ],
    audience: "For anyone who cares about mentorship, design, careers, or building something that stays free at scale.",
    guestLinks: {
      "Felix Lee": [
        { label: "LinkedIn", url: "https://www.linkedin.com/in/felixleezd/" },
        { label: "X", url: "https://x.com/felixleezd" }
      ]
    }
  },
  "AR18l-xBY6Q": {
    publishedAt: "2026-07-26T19:35:49-07:00", // YouTube publish time — VideoObject.uploadDate
    seoTitle: "Sanket Agarwal on Fleek's AI for Used Clothing | The Tesla Pod",
    seoDesc: "Fleek cofounder Sanket Agarwal on where donated clothes really go, AI that grades used garments from one photo, and Fleek's $25M Series B. The Tesla Pod EP 09.",
    summary: [
      "Most people have no idea where their donated clothes actually go. A t-shirt dropped in a donation bin in London can travel thousands of miles, get sorted by hand in a warehouse in Karachi or Dubai, and end up on a rack in a vintage store in New York, if it's lucky. The system moving billions of garments a year is enormous, and almost entirely offline.",
      "Sanket Agarwal spent his early career at Google before cofounding Fleek, the company building the AI infrastructure behind the global secondhand clothing trade. Fleek runs a B2B marketplace connecting used-clothing wholesalers and graders with vintage stores and resellers, and its vision-language model, Fleek Sort, can identify, grade and price a used garment from a single photo.",
      "Fleek closed a $25M Series B led by Burda, with eBay, FJ Labs, Andreessen Horowitz and Y Combinator backing it, bringing total funding to $45M. It connects more than 2,000 suppliers with over 50,000 buyers across 100-plus countries."
    ],
    topics: [
      "What actually happens to a piece of clothing after you donate it",
      "Why grading and sorting, not the marketplace, may be the real thing worth owning",
      "How you teach an AI to grade used clothing the way a human expert does",
      "Whether better technology fixes the waste problem in secondhand fashion or just makes it more efficient",
      "Why he left Google-scale engineering to rebuild a fragmented, offline industry"
    ],
    audience: "For anyone who cares about AI, marketplaces, sustainability, or the hidden supply chains that move the physical world."
  },
  "4FtPxcSjpF8": {
    publishedAt: "2026-07-05T19:21:23-07:00", // YouTube publish time — VideoObject.uploadDate
    seoTitle: "Jason Jin on Funky and AI Agent Swarms | The Tesla Pod",
    seoDesc: "Ex-Google engineer Jason Jin on Funky: one API call, hundreds of sandboxed AI agents, why swarms beat one smarter agent, and a live demo. The Tesla Pod EP 08.",
    summary: [
      "Jason Jin spent six years at Google, where he was a founding engineer on Google Analytics Mobile and built a logs system processing over an exabyte of data per day. Then he left to start Funky.",
      "Funky is infrastructure that lets developers spin up hundreds of AI agents in parallel without wrestling with the cost, scaling and reliability problems that usually break multi-agent systems. One API call, hundreds of sub-agents, each in its own sandbox. The ride ends with a live demo: a swarm of attacker agents trying to trick a guarded agent into wiring money out."
    ],
    topics: [
      "Why he walked away from Google to build agent infrastructure",
      "Where the name “Funky” actually comes from",
      "Why running many agents in parallel beats making one agent smarter",
      "How he keeps agent swarms from becoming a runaway cost problem",
      "A live demo: a swarm of attacker agents trying to trick a guarded agent into wiring money out"
    ],
    audience: "For anyone who builds with AI agents or cares about the infrastructure layer underneath them."
  },
  "UkzjHmqDMiY": {
    publishedAt: "2026-06-14T11:02:38-07:00", // YouTube publish time — VideoObject.uploadDate
    seoTitle: "Ontora (YC P26) on Automating Consulting with AI | The Tesla Pod",
    seoDesc: "Ontora cofounders David Korn and Leon Iwanowitsch on an AI agent that interviews every employee and maps how work gets done in 24 hours. The Tesla Pod EP 07.",
    summary: [
      "When a Fortune 500 company wants to understand how it actually works, it hires McKinsey or Bain, pays millions and waits months for a deck. David Korn and his cofounders think that entire model is about to collapse.",
      "David, Max and Leon left Germany to build Ontora (YC P26), an AI agent that interviews every employee in a company and maps how work actually gets done. Not a survey: a real one-on-one conversation that asks sharp follow-ups, digs into the workarounds nobody documents, and surfaces the bottlenecks leadership can't see. What used to take a team of consultants months, Ontora delivers in 24 hours: themed insights, process maps and an automation roadmap with ROI attached.",
      "Their thesis: models are commoditized, and context is the moat. The most valuable thing in any company is the operational knowledge locked in people's heads, and right now it's invisible to both decision-makers and the AI tools they're buying."
    ],
    topics: [
      "Why David walked away from Google and a company he'd already built in Berlin",
      "How you get an employee to be honest with an AI about how work really happens",
      "Whether Ontora is a threat to McKinsey, a tool for McKinsey, or both",
      "“Models are commoditized, context is the moat,” and what that actually means",
      "Whether mapping a company is the same as handing it the blueprint to replace its own people",
      "What it's like building a company about how teams work, as a three-person team"
    ],
    audience: "For anyone who runs operations, works in consulting, or cares about what AI is about to disrupt."
  },
  "7_k8UR_5aDc": {
    publishedAt: "2026-06-07T20:56:58-07:00", // YouTube publish time — VideoObject.uploadDate
    seoTitle: "Anushka Idamekorala: From PhD Dropout to YC | The Tesla Pod",
    seoDesc: "Logical (YC F25) cofounder Anushka Idamekorala on leaving his PhD, building a proactive desktop copilot, and the Sri Lankan founder wave in SF. The Tesla Pod EP 06.",
    summary: [
      "Anushka Idamekorala grew up in Sri Lanka watching his parents work government jobs: fixed salary, hard work, no ceiling. Down the road, a man sold durian from a table. The table became a cart, the cart became a vehicle, the vehicle became a fleet. That lesson stayed with him through engineering school, through leading B2B SaaS teams, and all the way to a PhD at the University of Virginia. Then his childhood friend Sam called with an idea, and he dropped out.",
      "Anushka and Sam are building Logical (YC F25), a proactive desktop copilot. Think Clippy, but actually good. Instead of waiting for the perfect prompt, Logical watches how you work, learns your patterns and helps before you ask: it drafts emails, captures meeting insights, tracks to-dos and takes action across the apps you already use. Their bet is that prompt-first AI is fundamentally flawed, and that a truly helpful AI has to live where you work, on the desktop.",
      "The two have known each other since they were six years old. Sam is the best-performing Sri Lankan in the history of both the International Physics Olympiad and the Asian Physics Olympiad. Now they're cofounders in San Francisco, part of a growing wave of Sri Lankan founders building there."
    ],
    topics: [
      "Why he walked away from a working academic path",
      "The durian seller and the lesson about ceilings",
      "Why prompt-first AI is broken",
      "What it actually takes to build a proactive desktop copilot",
      "The Sri Lankan founder wave forming in San Francisco",
      "What he'd tell someone watching from anywhere in the world who wants to be here"
    ],
    audience: "For anyone who builds with AI, is thinking about leaving academia, or comes from a place that feels far from Silicon Valley."
  },
  "ChwI4UyEGqM": {
    publishedAt: "2026-05-30T23:59:45-07:00", // YouTube publish time — VideoObject.uploadDate
    seoTitle: "rtrvr.ai Founders on AI Agents That Browse the Web | The Tesla Pod",
    seoDesc: "Arjun Chintapalli and Bhavani Kalisetty of rtrvr.ai on DOM-native web agents, 81.4% task completion on WebBench, Rover and the agentic web. The Tesla Pod EP 05.",
    summary: [
      "For thirty years the web was built for humans. We click, we scroll, we fill out forms, we navigate. Arjun Chintapalli and Bhavani Kalisetty think that era is ending.",
      "They left Google to build rtrvr.ai (Retriever AI), an AI agent that actually does things on the web. Not a chatbot that hands you a link: an agent that reads the live page, understands it and takes real action, clicking, filling forms, navigating and finishing the task. While most teams build vision-based agents that browse by screenshot, they went DOM-native. The result is 1.5 million automation workflows running and 81.4% task completion on WebBench.",
      "Their newest launch, Rover, turns any website into an agentic experience with one script tag. A user says “help me check out,” and Rover fills the fields, clicks the buttons and completes the purchase, right inside the site."
    ],
    topics: [
      "Why DOM-native agents beat vision-based agents",
      "The late-night hackathon that became rtrvr",
      "What it took for two engineers to walk away from Google",
      "The 18.6% of the web that still breaks their agent",
      "Whether humans will even browse the web in five years",
      "The agentic web, and what the internet looks like in 2030"
    ],
    audience: "For anyone who builds on the web, works in AI, or wants to understand what's coming for the internet."
  },
  "p7eUWZtrq-0": {
    publishedAt: "2026-05-23T16:51:13-07:00", // YouTube publish time — VideoObject.uploadDate
    seoTitle: "Peazy Labs on AI That Replaces Customer Success | The Tesla Pod",
    seoDesc: "Komala Chenna and Kushal Murthy of Peazy Labs on an AI concierge inside your product: 94% onboarding and 41% less reactive support. The Tesla Pod EP 04.",
    summary: [
      "For years the customer success playbook was the same. Hire a CSM. Buy Pendo. Send onboarding emails. Watch customers churn anyway. Komala Chenna and Kushal (Kush) Murthy are building the thing that ends that.",
      "Peazy is an AI concierge that lives inside your product. It watches users in real time, spots when they're stuck and guides them through the moment: not in another dashboard, not in a help doc, but on the screen where the work is happening. Peazy reports a 94% onboarding rate and 41% less reactive support, with customers reaching value faster and CSMs no longer drowning in tickets."
    ],
    topics: [
      "Why every other tool in the customer success stack is built wrong",
      "The exact moment Komala knew customer success was broken from the inside",
      "Why DOM-native, in-product guidance beats the dashboard model",
      "The dumbest fight they've had as cofounders",
      "Whether the CSM role even exists in five years",
      "The tool every CS team uses today that they think will be dead in two years"
    ],
    audience: "For customer success leaders, founders shipping software, and anyone curious about what AI is replacing right now."
  },
  "VVFp6FDn5KM": {
    publishedAt: "2026-05-17T00:28:04-07:00", // YouTube publish time — VideoObject.uploadDate
    seoTitle: "Laila Gamaleldin on Selling Small Businesses | The Tesla Pod",
    seoDesc: "Silver Surf founder Laila Gamaleldin left Google and TikTok to help small-business owners sell: the silver tsunami, ESOPs and big tech. The Tesla Pod EP 03.",
    summary: [
      "She left Google. She left TikTok. To build software for people who own dry cleaners in Michigan. Ten thousand Baby Boomers retire every day, and 80% of small businesses fail to sell: a generation of plumbers, dry cleaners, restaurant owners and mechanics whose life's work can disappear the day they retire.",
      "Laila Gamaleldin founded Silver Surf to fix that, with software to help small-business owners sell their business faster, at a better valuation and with a higher success rate. Riding through San Francisco on Full Self-Driving, she and host Irosha de Silva talk about one of the biggest economic shifts in America that almost nobody is paying attention to."
    ],
    topics: [
      "Why she walked away from Google and TikTok to do this",
      "The silver tsunami and what it actually means for Main Street America",
      "How ESOPs (employee ownership) might be the answer everyone is missing",
      "What it's like building five tools at once for users who have never opened a Notion doc",
      "What big tech gets fundamentally wrong about how time should be spent",
      "The conversation with her Egyptian parents the night she decided to quit"
    ],
    audience: "For anyone inside big tech who is quietly thinking about leaving."
  },
  "EMmH7ECJ-IQ": {
    publishedAt: "2026-05-11T15:15:33-07:00", // YouTube publish time — VideoObject.uploadDate
    seoTitle: "Manicule's Founders Raised $500K from YC at 18 | The Tesla Pod",
    seoDesc: "Shreyans Jain and Naman Bansal started building at 14, were rejected by YC at 15 and raised $500K from YC at 18. The Manicule story on The Tesla Pod EP 02.",
    summary: [
      "Two teenagers from Agra started building startups at 14. At 15 they were rejected by Y Combinator. At 18 they raised a $500K check from YC.",
      "Shreyans Jain and Naman Bansal are the cofounders of Manicule, which builds AI-native technical documentation for developer tools. Riding through San Francisco in a self-driving Tesla, they talk through the years of failed experiments, late-night coding sessions and curiosity that eventually compounded into something real."
    ],
    topics: [
      "Their journey from Agra to San Francisco",
      "Applying to YC as teenagers",
      "Building and failing repeatedly before finding traction",
      "Why AI-native documentation became a real business",
      "How Manicule scaled through AI automation",
      "The future of dev tools, AI agents and startups",
      "India vs San Francisco for founders",
      "Hot takes on AI startups and services businesses"
    ],
    audience: "For young founders, YC hopefuls, and anyone building developer tools."
  },
  "kl8JXv2KIfc": {
    publishedAt: "2026-05-03T10:39:55-07:00", // YouTube publish time — VideoObject.uploadDate
    seoTitle: "Self-Driving Cars and Self-Driving Software | The Tesla Pod EP 01",
    seoDesc: "Marketrix AI cofounders Irosha de Silva and Yasith Jayawardana on why software should be tested in simulation the way self-driving cars are. The Tesla Pod EP 01.",
    summary: [
      "Self-driving cars are trained in simulation before they touch a real road. They crash safely, learn and iterate until they're ready. Software doesn't get that: we ship it, users break it, and then we patch it.",
      "In the first episode of The Tesla Pod, host Irosha de Silva rides with Marketrix AI cofounder and CTO Yasith Jayawardana on the way to Founders, Inc., in a Tesla Model Y on Full Self-Driving through San Francisco. That's the format of the show: founders talking while the car drives itself. No studio, no script. The conversation is about what changes when software can simulate itself first."
    ],
    topics: [
      "Why simulation worked for cars and why it should work for software",
      "What's actually broken about how software is tested, onboarded and supported today",
      "What Marketrix AI is building and why now",
      "Where this category goes from here"
    ],
    audience: "For anyone working on AI, autonomy or developer tools."
  }
};
