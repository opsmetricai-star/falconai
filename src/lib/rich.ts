// Rich, multi-section content for the main inner pages.
// Every capability carries an honest status: "live" means it exists in the product today,
// "roadmap" means it is planned. Pages must not imply roadmap items are available.

export type Status = "live" | "roadmap";
export type Rich = {
  overview: { title: string; body: string; bullets: string[] };
  capabilities: { title: string; body: string; status: Status }[];
  steps: { title: string; body: string }[];
  module?: { label: string; href: string; blurb: string };
  faq: { q: string; a: string }[];
};

const STEPS_DETECT = [
  { title: "Connect", body: "Add assets and send events through the dashboard, a CSV upload or the ingest API." },
  { title: "Detect", body: "Deterministic rules mapped to MITRE ATT&CK evaluate every batch within a 30-minute window." },
  { title: "Triage", body: "Analyst AI explains the detection, cites its evidence and recommends next steps." },
  { title: "Respond", body: "Open an incident, track its status and generate a report for stakeholders." },
];

const FAQ_COMMON = [
  { q: "Can I try it before paying?", a: "Yes. Every account starts with a 15-day free trial and 10 AI analyst credits. No credit card is required." },
  { q: "Where does my data live?", a: "In your own isolated workspace. Row-level security keeps each account's data separate." },
];

export const RICH: Record<string, Rich> = {
  "platform/endpoint-security": {
    overview: {
      title: "See what happens on every endpoint, then act on it",
      body: "Send process, authentication and file telemetry from your fleet and let the detection engine flag the behaviors attackers rely on, from encoded PowerShell to shadow-copy deletion.",
      bullets: ["Rules for encoded PowerShell, credential dumping, persistence and ransomware precursors", "Mass file-modification detection for early ransomware warning", "Asset inventory with criticality and isolation status", "Plain-language AI explanation for each detection"],
    },
    capabilities: [
      { title: "Behavioral detection rules", body: "Nine built-in rules mapped to MITRE ATT&CK, evaluated on every ingest.", status: "live" },
      { title: "Telemetry ingest", body: "Send events by form, CSV upload or an authenticated API.", status: "live" },
      { title: "Asset inventory", body: "Track hosts, owners, criticality and last-seen time.", status: "live" },
      { title: "Threat indicator matching", body: "Match IPs, domains, hashes and process names against your watchlist.", status: "live" },
      { title: "Lightweight endpoint agent", body: "A native collector that streams telemetry without custom scripting.", status: "roadmap" },
      { title: "One-click host containment", body: "Isolate a host directly from a detection.", status: "roadmap" },
    ],
    steps: STEPS_DETECT,
    module: { label: "Open Detections", href: "/dashboard/detections", blurb: "Every endpoint rule result appears here with severity, technique and AI analysis." },
    faq: [
      { q: "Do I need to install an agent?", a: "Not today. You send telemetry through the ingest API, CSV upload or the dashboard. A native agent is on the roadmap." },
      { q: "Which operating systems are supported?", a: "Any source that can send JSON events. The built-in rules focus on Windows command-line behavior." },
      ...FAQ_COMMON,
    ],
  },
  "platform/identity-security": {
    overview: {
      title: "Catch account takeover while it is still a login problem",
      body: "Authentication events are correlated per user and source address so brute-force attempts and suspicious successes surface as a single, explained detection.",
      bullets: ["Brute-force detection across a 10-minute window", "Critical alert when a login succeeds right after repeated failures", "Per-user and per-source correlation", "Notifications for high and critical findings"],
    },
    capabilities: [
      { title: "Brute-force detection", body: "Five or more failed logins within ten minutes raise a high-severity detection.", status: "live" },
      { title: "Compromise indicator", body: "A success shortly after failures is escalated to critical.", status: "live" },
      { title: "Authentication ingest", body: "Send login success and failure events from any identity provider.", status: "live" },
      { title: "AI triage", body: "Analyst AI reviews the sequence and recommends containment steps.", status: "live" },
      { title: "Directory connectors", body: "Native connectors for common identity providers.", status: "roadmap" },
      { title: "Automatic session revocation", body: "Block or step up risky sessions automatically.", status: "roadmap" },
    ],
    steps: STEPS_DETECT,
    module: { label: "Send authentication events", href: "/dashboard/events", blurb: "Use event types login_failed and login_success to try the identity rules." },
    faq: [
      { q: "Which identity providers work?", a: "Any provider whose logs you can forward as JSON or CSV." },
      { q: "Does it block accounts?", a: "No. It detects and explains. Automated enforcement is on the roadmap." },
      ...FAQ_COMMON,
    ],
  },
  "platform/cloud-security": {
    overview: {
      title: "Bring cloud activity into the same investigation",
      body: "Cloud audit logs are just events. Send them in, match them against your indicators and review them next to endpoint and identity activity.",
      bullets: ["Ingest cloud audit and network logs", "Indicator matching on IPs and domains", "Cross-source timeline in one workspace", "Reports you can hand to auditors"],
    },
    capabilities: [
      { title: "Log ingest", body: "Send cloud audit events through the ingest API.", status: "live" },
      { title: "Indicator matching", body: "Flag events that touch watchlisted IPs, domains or hashes.", status: "live" },
      { title: "Unified reporting", body: "Summaries across every source in one report.", status: "live" },
      { title: "Posture scanning", body: "Agentless scanning of misconfigurations and exposure.", status: "roadmap" },
      { title: "Runtime workload protection", body: "Container and workload detection.", status: "roadmap" },
      { title: "Cloud-native connectors", body: "Pull logs directly from major cloud providers.", status: "roadmap" },
    ],
    steps: STEPS_DETECT,
    module: { label: "Manage the watchlist", href: "/dashboard/threat-intel", blurb: "Add the IPs and domains you want matched against cloud activity." },
    faq: [
      { q: "Do you scan my cloud accounts?", a: "Not yet. Today you forward logs to FalconAI. Posture scanning is on the roadmap." },
      ...FAQ_COMMON,
    ],
  },
  "platform/next-gen-siem": {
    overview: {
      title: "A SIEM that explains itself",
      body: "Store events, run detections on ingest and ask an AI analyst to triage the results, all in one workspace instead of a stack of tools.",
      bullets: ["Open ingest API and CSV upload", "Detections created automatically on ingest", "De-duplicated alerts so analysts see one finding, not fifty", "Evidence-citing AI triage and incident workflow"],
    },
    capabilities: [
      { title: "Event store and search", body: "Recent events are stored per workspace and viewable in the dashboard.", status: "live" },
      { title: "Detection on ingest", body: "Rules run on every batch and de-duplicate within an hour.", status: "live" },
      { title: "Analyst AI", body: "Structured, validated verdicts with recommended actions.", status: "live" },
      { title: "Incidents and reports", body: "Escalate detections, track status and generate summaries.", status: "live" },
      { title: "Query language", body: "Ad-hoc search across long retention windows.", status: "roadmap" },
      { title: "Petabyte-scale retention", body: "Tiered storage for long-term data.", status: "roadmap" },
    ],
    steps: STEPS_DETECT,
    module: { label: "Open the ingest API docs", href: "/support/developers", blurb: "Create an API key and start sending events from your own sources." },
    faq: [
      { q: "How do I send data?", a: "POST events to /api/ingest with a bearer key (Pro and Enterprise), upload a CSV, or use the form." },
      { q: "Is there a query language?", a: "Not yet. The dashboard lists recent events. A query language is on the roadmap." },
      ...FAQ_COMMON,
    ],
  },
  "platform/analyst-ai": {
    overview: {
      title: "Triage that cites its evidence",
      body: "Analyst AI reviews a detection and the events behind it, then returns a verdict, a likely cause, recommended actions and the evidence it relied on.",
      bullets: ["Verdict with a confidence score", "Recommended actions in priority order", "Evidence list tied to the underlying events", "Untrusted log content is treated strictly as data"],
    },
    capabilities: [
      { title: "Structured verdicts", body: "Output is validated against a schema before it is saved.", status: "live" },
      { title: "Credit metering", body: "Usage is counted per plan and refunded if a call fails.", status: "live" },
      { title: "Prompt-injection hardening", body: "Event content is passed as quoted data, never as instructions.", status: "live" },
      { title: "Saved analysis history", body: "The latest analysis is stored on the detection.", status: "live" },
      { title: "Natural-language questions", body: "Ask free-form questions about your data.", status: "roadmap" },
      { title: "Automated response drafts", body: "Draft containment steps for approval.", status: "roadmap" },
    ],
    steps: [
      { title: "Open a detection", body: "Choose any detection from your list." },
      { title: "Run analysis", body: "One credit is used and the model reviews the rule result, asset and events." },
      { title: "Validate", body: "The response is checked against a strict schema." },
      { title: "Act", body: "Follow the recommended actions or open an incident." },
    ],
    module: { label: "Try it on a detection", href: "/dashboard/detections", blurb: "Use the Analyze with AI button on any detection." },
    faq: [
      { q: "How many credits do I get?", a: "10 on the trial, 100 on Go, 500 on Pro. Credits reset every 30 days." },
      { q: "Can the AI be wrong?", a: "Yes. It is a triage aid, and every result shows its evidence so you can check it." },
      ...FAQ_COMMON,
    ],
  },
  "platform/threat-intelligence": {
    overview: {
      title: "Turn indicators into detections automatically",
      body: "Maintain a watchlist of malicious IPs, domains, hashes and process names. Every incoming event is checked against it.",
      bullets: ["Four indicator types", "Matches become detections with context", "Notes on each indicator for analysts", "Coverage view of every rule and its ATT&CK technique"],
    },
    capabilities: [
      { title: "Indicator watchlist", body: "Add and remove IPs, domains, hashes and process names.", status: "live" },
      { title: "Automatic matching", body: "Events are matched on every ingest.", status: "live" },
      { title: "ATT&CK coverage view", body: "See which techniques your rules cover.", status: "live" },
      { title: "Intelligence feeds", body: "Subscribe to curated indicator feeds.", status: "roadmap" },
      { title: "Adversary profiles", body: "Linked profiles for known threat actors.", status: "roadmap" },
    ],
    steps: STEPS_DETECT,
    module: { label: "Open Threat intel", href: "/dashboard/threat-intel", blurb: "Manage your watchlist and view rule coverage." },
    faq: [{ q: "Are feeds included?", a: "Not yet. You add indicators yourself today." }, ...FAQ_COMMON],
  },
  "platform/exposure-management": {
    overview: {
      title: "Know your assets before you defend them",
      body: "Start with an accurate inventory. Criticality, ownership and last-seen time tell you where a detection matters most.",
      bullets: ["Inventory with owner and criticality", "Last-seen tracking from ingested events", "Isolation and retirement status", "Plan-based asset limits"],
    },
    capabilities: [
      { title: "Asset inventory", body: "Hosts with OS, IP, owner and criticality.", status: "live" },
      { title: "Last-seen tracking", body: "Updated automatically when events arrive.", status: "live" },
      { title: "Status management", body: "Mark assets active, isolated or retired.", status: "live" },
      { title: "Vulnerability correlation", body: "Combine CVEs with exploit activity.", status: "roadmap" },
      { title: "Unmanaged asset discovery", body: "Find devices that are not yet in your inventory.", status: "roadmap" },
    ],
    steps: [
      { title: "Add assets", body: "Create hosts manually." },
      { title: "Set criticality", body: "Tell the platform what matters most." },
      { title: "Send events", body: "Last-seen time updates automatically." },
      { title: "Prioritize", body: "Review detections on critical assets first." },
    ],
    module: { label: "Open Assets", href: "/dashboard/assets", blurb: "Add and manage your inventory." },
    faq: [{ q: "How many assets can I track?", a: "25 on the trial, 100 on Go, 1,000 on Pro, unlimited on Enterprise." }, ...FAQ_COMMON],
  },
  "platform/ai-detection-response": {
    overview: {
      title: "Treat AI systems as part of your attack surface",
      body: "Agents and AI applications produce events too. Send their tool calls and prompts as telemetry and apply the same detection, triage and incident workflow.",
      bullets: ["Ingest agent and application events", "Indicator matching on AI-related infrastructure", "AI triage on resulting detections", "Audit trail through incidents and reports"],
    },
    capabilities: [
      { title: "Agent event ingest", body: "Send tool calls and actions as events.", status: "live" },
      { title: "Shared workflow", body: "Detections, incidents and reports work the same way.", status: "live" },
      { title: "Prompt-injection rules", body: "Built-in detections for injection and jailbreak attempts.", status: "roadmap" },
      { title: "Runtime guardrails", body: "Block unsafe agent actions as they happen.", status: "roadmap" },
      { title: "Agent kill switch", body: "Stop a misbehaving agent with one action.", status: "roadmap" },
    ],
    steps: STEPS_DETECT,
    module: { label: "Send agent events", href: "/dashboard/events", blurb: "Use a custom event_type for each agent action." },
    faq: [{ q: "Are AI-specific rules included?", a: "Not yet. Today you can ingest AI telemetry and use the general workflow. AI-specific rules are on the roadmap." }, ...FAQ_COMMON],
  },
  "services/managed-defense": {
    overview: {
      title: "Add expert hands to your team",
      body: "Managed Defense pairs the platform with analysts who monitor, investigate and respond. Contact us to scope coverage for your environment.",
      bullets: ["Scoped to your environment", "Escalation paths agreed up front", "Reporting aligned to the platform", "Engagement starts with a discovery call"],
    },
    capabilities: [
      { title: "Discovery and scoping", body: "We map your environment and priorities.", status: "live" },
      { title: "Platform-led monitoring", body: "Analysts work from the same detections you see.", status: "live" },
      { title: "24/7 coverage", body: "Follow-the-sun monitoring.", status: "roadmap" },
      { title: "Hands-on remediation", body: "Containment performed on your behalf.", status: "roadmap" },
    ],
    steps: [
      { title: "Talk to us", body: "Share your environment and goals." },
      { title: "Scope", body: "Agree coverage and escalation." },
      { title: "Onboard", body: "Connect data sources." },
      { title: "Operate", body: "Review findings together." },
    ],
    module: { label: "Contact sales", href: "/contact-us", blurb: "Tell us what you need and we will reply by email." },
    faq: [{ q: "Is this available now?", a: "Engagements are scoped individually. Contact us to discuss availability." }],
  },
  "services/incident-response": {
    overview: {
      title: "Experienced a breach? Start here",
      body: "Contain first, then investigate. Use the platform to preserve evidence and contact us for hands-on help.",
      bullets: ["Open an incident in one click from a detection", "Track status from open to closed", "Generate a report for leadership", "Contact us with the Incident response topic"],
    },
    capabilities: [
      { title: "Incident tracking", body: "Open, investigating, contained, closed.", status: "live" },
      { title: "Evidence in context", body: "Detections link to their incident.", status: "live" },
      { title: "Summary reports", body: "Time-bounded reports of findings.", status: "live" },
      { title: "On-call responders", body: "Responders engage within hours.", status: "roadmap" },
    ],
    steps: [
      { title: "Contain", body: "Isolate affected systems." },
      { title: "Record", body: "Open an incident and attach detections." },
      { title: "Investigate", body: "Use AI triage and event history." },
      { title: "Report", body: "Generate a summary." },
    ],
    module: { label: "Open Incidents", href: "/dashboard/incidents", blurb: "Track every open investigation." },
    faq: [{ q: "Do you offer 24/7 response?", a: "Hands-on response is handled by contacting us. Always-on retainers are on the roadmap." }],
  },
  "solutions/ransomware-protection": {
    overview: {
      title: "Catch ransomware before encryption spreads",
      body: "Two rules target the earliest ransomware signals: backup and shadow-copy destruction, and mass file modification.",
      bullets: ["Shadow-copy and backup deletion detection", "Mass file modification within one minute", "Credential-theft precursor rules", "Critical notifications immediately"],
    },
    capabilities: [
      { title: "Recovery inhibition rule", body: "Detects vssadmin, wbadmin and bcdedit tampering.", status: "live" },
      { title: "Mass modification rule", body: "50+ file changes on a host in a minute.", status: "live" },
      { title: "Credential dumping rule", body: "Mimikatz-style tooling and LSASS access.", status: "live" },
      { title: "Automatic containment", body: "Isolate a host when ransomware behavior is seen.", status: "roadmap" },
    ],
    steps: STEPS_DETECT,
    module: { label: "Review detections", href: "/dashboard/detections", blurb: "Critical ransomware findings appear at the top." },
    faq: [{ q: "Does it stop encryption?", a: "It detects precursors and alerts you quickly. Automatic blocking is on the roadmap." }, ...FAQ_COMMON],
  },
  "solutions/agentic-soc-transformation": {
    overview: {
      title: "Move analysts from alert queues to decisions",
      body: "Let AI handle first-pass triage so people spend time on judgement, hunting and improving detections.",
      bullets: ["AI triage on every detection", "Structured, comparable verdicts", "Incident workflow for human sign-off", "Usage metered per plan"],
    },
    capabilities: [
      { title: "First-pass AI triage", body: "A verdict, cause and next steps for each detection.", status: "live" },
      { title: "Human-in-the-loop", body: "Every action is taken by an analyst.", status: "live" },
      { title: "Reporting", body: "Summaries for leadership.", status: "live" },
      { title: "Autonomous playbooks", body: "Agents act within approved guardrails.", status: "roadmap" },
    ],
    steps: STEPS_DETECT,
    module: { label: "Run Analyst AI", href: "/dashboard/detections", blurb: "Analyze any detection and review the evidence." },
    faq: [{ q: "Does the AI take action?", a: "No. It recommends, and a person decides." }, ...FAQ_COMMON],
  },
};
