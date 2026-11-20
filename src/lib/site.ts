export const BRAND = "FalconAI";
export const PAY_LINKS = {
  go: "https://selar.com/57plan?currency=USD",
  pro: "https://selar.com/97plan?currency=USD",
};

export type NavLink = { label: string; href: string; badge?: string };
export type NavGroup = { title: string; links: NavLink[] };
export type NavItem = { label: string; href?: string; groups: NavGroup[] };

export const NAV: NavItem[] = [
  {
    label: "Platform",
    href: "/platform",
    groups: [
      {
        title: "Cross-Domain Detection & Response",
        links: [
          { label: "Endpoint Security", href: "/platform/endpoint-security" },
          { label: "Identity Security", href: "/platform/identity-security" },
          { label: "Cloud Security", href: "/platform/cloud-security" },
          { label: "SaaS Security", href: "/platform/saas-security" },
          { label: "AI Detection & Response", href: "/platform/ai-detection-response" },
          { label: "AI Observability", href: "/platform/ai-observability" },
          { label: "Secure Browser", href: "/platform/secure-browser" },
          { label: "Data Security", href: "/platform/data-security" },
        ],
      },
      {
        title: "Agentic SOC",
        links: [
          { label: "Next-Gen SIEM", href: "/platform/next-gen-siem" },
          { label: "Agentic SOAR", href: "/platform/agentic-soar" },
          { label: "Analyst AI", href: "/platform/analyst-ai" },
          { label: "Data Pipeline Management", href: "/platform/data-pipeline" },
        ],
      },
      {
        title: "Continuous Threat & Exposure Management",
        links: [
          { label: "Threat Intelligence & Hunting", href: "/platform/threat-intelligence" },
          { label: "Exposure Management", href: "/platform/exposure-management" },
          { label: "IT Automation", href: "/platform/it-automation" },
          { label: "XIoT Security", href: "/platform/xiot-security" },
        ],
      },
    ],
  },
  {
    label: "Services",
    href: "/services",
    groups: [
      { title: "Managed Services", links: [{ label: "FalconAI Managed Defense", href: "/services/managed-defense" }] },
      {
        title: "AI Security Services",
        links: [
          { label: "AI Readiness & Resilience", href: "/services/ai-readiness" },
          { label: "Shadow AI Visibility", href: "/services/shadow-ai-visibility" },
          { label: "AI Security Services", href: "/services/ai-security-services" },
        ],
      },
      {
        title: "Professional Services",
        links: [
          { label: "Incident Response", href: "/services/incident-response" },
          { label: "Cybersecurity Consulting", href: "/services/consulting" },
          { label: "Platform Services", href: "/services/platform-services" },
          { label: "Insider Risk Services", href: "/services/insider-risk" },
          { label: "Services Retainer", href: "/services/retainer" },
          { label: "All services", href: "/services" },
        ],
      },
    ],
  },
  {
    label: "Solutions",
    groups: [
      {
        title: "Secure AI",
        links: [
          { label: "AI Detection & Response", href: "/solutions/ai-detection-and-response" },
          { label: "Agent Security", href: "/solutions/agent-security" },
          { label: "Supply Chain Security", href: "/solutions/supply-chain-security" },
          { label: "Automated AI Security Testing", href: "/solutions/ai-security-testing" },
        ],
      },
      {
        title: "Defend with AI",
        links: [
          { label: "Agentic SOC Transformation", href: "/solutions/agentic-soc-transformation" },
          { label: "Frontier AI Readiness", href: "/solutions/frontier-ai-readiness" },
          { label: "Adversary Emulation", href: "/solutions/adversary-emulation" },
          { label: "Cross-Domain Attack Protection", href: "/solutions/cross-domain-attacks" },
          { label: "Ransomware Protection", href: "/solutions/ransomware-protection" },
        ],
      },
      {
        title: "By Industry",
        links: [
          { label: "Small Business", href: "/solutions/small-business" },
          { label: "Federal Government", href: "/solutions/federal-government" },
          { label: "State & Local Government", href: "/solutions/state-local-government" },
          { label: "Financial Services", href: "/solutions/financial-services" },
          { label: "Healthcare", href: "/solutions/healthcare" },
          { label: "Education", href: "/solutions/education" },
          { label: "Retail", href: "/solutions/retail" },
          { label: "Manufacturing", href: "/solutions/manufacturing" },
        ],
      },
    ],
  },
  {
    label: "Cyber SI Lab",
    groups: [
      {
        title: "Cyber SuperIntelligence Lab",
        links: [
          { label: "Cyber SI Lab", href: "/cyber-si-lab" },
          { label: "Cyber SI Research Hub", href: "/cyber-si-lab/research" },
        ],
      },
    ],
  },
  {
    label: "Why FalconAI",
    href: "/why-falconai",
    groups: [
      {
        title: "Why FalconAI",
        links: [
          { label: "Industry Alignment", href: "/why-falconai/industry-alignment" },
          { label: "Customer Scenarios", href: "/why-falconai/customer-scenarios" },
          { label: "FalconAI vs The Competition", href: "/why-falconai/compare" },
          { label: "Compliance & Certifications", href: "/why-falconai/compliance" },
        ],
      },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    groups: [
      {
        title: "Featured",
        links: [
          { label: "Global Threat Report", href: "/resources/global-threat-report" },
          { label: "Threat Hunting Report", href: "/resources/threat-hunting-report", badge: "New" },
          { label: "Adversary Hub", href: "/resources/adversary-hub" },
          { label: "AI Security Hub", href: "/resources/ai-security-hub" },
        ],
      },
      {
        title: "Training & Education",
        links: [
          { label: "FalconAI Academy", href: "/resources/academy" },
          { label: "Cybersecurity 101", href: "/resources/cybersecurity-101" },
          { label: "Hands-On Workshops", href: "/resources/workshops" },
          { label: "Product Videos", href: "/resources/videos" },
        ],
      },
      {
        title: "Resource Library",
        links: [
          { label: "Latest Innovations", href: "/resources/latest-innovations" },
          { label: "Blog", href: "/blog" },
          { label: "Webinars", href: "/resources/webinars" },
          { label: "All resources", href: "/resources" },
        ],
      },
    ],
  },
  {
    label: "Pricing",
    href: "/pricing",
    groups: [
      {
        title: "Bundles",
        links: [
          { label: "FalconAI Go", href: "/pricing#go" },
          { label: "FalconAI Pro", href: "/pricing#pro" },
          { label: "FalconAI Enterprise", href: "/pricing#enterprise" },
        ],
      },
    ],
  },
];

export const UTILITY = [
  { label: "Experienced a breach?", href: "/services/incident-response" },
  { label: "Blog", href: "/blog" },
  { label: "Contact us", href: "/contact-us" },
  { label: "Careers", href: "/careers" },
  { label: "Latest Innovations", href: "/resources/latest-innovations" },
];

export const FOOTER = [
  {
    title: "Get Started",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Free Trial Guide", href: "/resources/free-trial-guide" },
      { label: "Start Free Trial", href: "/signup" },
      { label: "Flex Licensing", href: "/pricing/flex" },
      { label: "Financing", href: "/pricing/financing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Executive Leadership", href: "/about/leadership" },
      { label: "Newsroom", href: "/about/newsroom" },
      { label: "Sustainability", href: "/about/sustainability" },
      { label: "Cyber SuperIntelligence Lab", href: "/cyber-si-lab" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Partners",
    links: [
      { label: "Partner Programs", href: "/partners" },
      { label: "Service Providers", href: "/partners/service-providers" },
      { label: "Strategic Technology", href: "/partners/technology" },
      { label: "Channel & Distributors", href: "/partners/channel" },
      { label: "Become a Partner", href: "/partners/become-a-partner" },
    ],
  },
  {
    title: "Existing Customers",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Support Portal", href: "/support" },
      { label: "Developer Docs", href: "/support/developers" },
      { label: "Community", href: "/support/community" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Experienced a Breach?", href: "/services/incident-response" },
      { label: "Contact Us", href: "/contact-us" },
      { label: "FAQs", href: "/support/faq" },
    ],
  },
];

export type Plan = {
  id: string;
  name: string;
  tag: string;
  price: string;
  unit: string;
  cta: string;
  href: string;
  external?: boolean;
  blurb: string;
  features: string[];
  /** monthly AI analyst credits */
  credits: number;
};

export const PLANS: Plan[] = [
  {
    id: "trial",
    name: "FalconAI Free Trial",
    tag: "Try for 15 days",
    price: "Free",
    unit: "No credit card required",
    cta: "Start free trial",
    href: "/signup",
    blurb: "Full workspace access for 15 days.",
    features: ["Detections & event ingest", "Asset inventory", "Threat intel lookups", "10 AI analyst credits"],
    credits: 10,
  },
  {
    id: "go",
    name: "FalconAI Go",
    tag: "Security Essentials",
    price: "$57",
    unit: "per workspace, one-time plan payment",
    cta: "Buy Go",
    href: PAY_LINKS.go,
    external: true,
    blurb: "Core detection and response for small teams.",
    features: ["Everything in trial", "Up to 100 assets", "Incidents & reports", "100 AI analyst credits / month"],
    credits: 100,
  },
  {
    id: "pro",
    name: "FalconAI Pro",
    tag: "Enhanced Protection",
    price: "$97",
    unit: "per workspace, one-time plan payment",
    cta: "Buy Pro",
    href: PAY_LINKS.pro,
    external: true,
    blurb: "Higher limits and the full AI analyst.",
    features: ["Everything in Go", "Up to 1,000 assets", "API ingest keys", "500 AI analyst credits / month"],
    credits: 500,
  },
  {
    id: "enterprise",
    name: "FalconAI Enterprise",
    tag: "Advanced Protection",
    price: "Custom",
    unit: "Contact sales",
    cta: "Contact sales",
    href: "/contact-us",
    blurb: "Unlimited assets, SSO and dedicated support.",
    features: ["Everything in Pro", "Unlimited assets", "SSO & audit exports", "Custom AI limits"],
    credits: 5000,
  },
];

export const PLAN_LIMITS: Record<string, { assets: number; credits: number }> = {
  trial: { assets: 25, credits: 10 },
  go: { assets: 100, credits: 100 },
  pro: { assets: 1000, credits: 500 },
  enterprise: { assets: 1_000_000, credits: 5000 },
};
