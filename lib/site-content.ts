// Pure content types, defaults and helpers. No Node APIs — safe to import
// from client components. File I/O lives in lib/content.ts.

export type Testimonial = { id: string; quote: string; name: string; role: string; visible: boolean };
export type Project = {
  id: string;
  title: string;
  location: string;
  kind: string;
  summary: string;
  image: string;
  visible: boolean;
};
export type About = {
  eyebrow: string;
  headingLine1: string;
  headingLine2: string;
  intro: string;
  body: string[];
  pageTitle: string;
  pageEyebrow: string;
  pageBody: string[];
};

export type NavLink = { label: string; href: string };
export type IconItem = { icon: string; label: string };
export type FaqItem = { q: string; a: string };

export type SiteContact = {
  company: string;
  tagline: string;
  phoneDisplay: string;
  phoneDigits: string;
  whatsappDigits: string;
  whatsappMessage: string;
  email: string;
  instagramHandle: string;
  instagramUrl: string;
  hours: string;
  addressLine1: string;
  addressLine2: string;
};

export type SiteSeo = {
  siteName: string;
  tagline: string;
  description: string;
  keywords: string[];
};

export type SiteContent = {
  nav: { links: NavLink[]; ctaLabel: string; ctaHref: string };
  hero: {
    eyebrow: string;
    headline: string;
    accent: string;
    intro: string;
    ctaLabel: string;
    ctaHref: string;
    scrollText: string;
    image: string;
  };
  features: IconItem[];
  collectionSection: { eyebrow: string; heading: string; ctaLabel: string };
  why: { eyebrow: string; heading: string; intro: string; items: IconItem[] };
  testimonialSection: { eyebrow: string; heading: string };
  projectSection: { eyebrow: string; heading: string; ctaLabel: string };
  faq: { eyebrow: string; heading: string; items: FaqItem[] };
  enquiry: { eyebrow: string; heading: string; accent: string; budgets: string[]; success: string };
  footer: { links: NavLink[]; copyright: string };
  collectionsPage: { heading: string; intro: string };
  collectionDetail: { intro: string };
  projectsPage: { heading: string; intro: string; empty: string };
  productsPage: { intro: string };
  contact: SiteContact;
  seo: SiteSeo;
};

export type Content = {
  about: About;
  testimonials: Testimonial[];
  projects: Project[];
  site: SiteContent;
};

export const DEFAULT_SITE: SiteContent = {
  nav: {
    links: [
      { label: "Collections", href: "/collections" },
      { label: "Projects", href: "/projects" },
      { label: "About", href: "/about" },
      { label: "FAQ", href: "/#faq" },
    ],
    ctaLabel: "Enquire now ↗",
    ctaHref: "/#contact",
  },
  hero: {
    eyebrow: "OUTDOOR LIVING · MADE IN UDAIPUR",
    headline: "Furniture That Turns Open Spaces\nInto",
    accent: "Experiences",
    intro: "Premium outdoor furniture designed to bring comfort, character, and style to every space.",
    ctaLabel: "Explore the collection",
    ctaHref: "#products",
    scrollText: "SCROLL TO DISCOVER",
    image: "",
  },
  features: [
    { icon: "frame", label: "Powder-Coated Metal" },
    { icon: "fabric", label: "Weather-Resistant Fabric" },
    { icon: "weave", label: "Hand-Woven Rope" },
    { icon: "finish", label: "Outdoor-Grade Finish" },
  ],
  collectionSection: {
    eyebrow: "THE COLLECTION",
    heading: "Explore by Category",
    ctaLabel: "View all collections",
  },
  why: {
    eyebrow: "WHY CHOOSE US?",
    heading: "Why Choose Us?",
    intro:
      "By choosing us as your premium furniture manufacturer, you can expect superior quality, customization options, efficient delivery and installation, and a commitment to ensuring your satisfaction.",
    items: [
      { icon: "medal", label: "Quality Craftsmanship" },
      { icon: "ruler", label: "Customization Options" },
      { icon: "truck", label: "On Time Delivery" },
      { icon: "people", label: "Commitment to Customer Satisfaction" },
    ],
  },
  testimonialSection: { eyebrow: "TESTIMONIALS", heading: "Real Person, Real Review" },
  projectSection: { eyebrow: "SELECTED WORK", heading: "Projects", ctaLabel: "View all projects" },
  faq: {
    eyebrow: "GOT QUESTIONS?",
    heading: "FAQ (Frequently Asked Questions)",
    items: [
      {
        q: "What materials do you use in your furniture?",
        a: "We work with powder-coated metal, teak, hand-woven synthetic rope and performance outdoor fabrics chosen for durability and weather resistance.",
      },
      {
        q: "Can I customize dimensions to fit my space?",
        a: "Yes — every collection can be tailored in size, finish and upholstery to suit your project.",
      },
      {
        q: "How long does it take to deliver made-to-order furniture?",
        a: "Standard pieces ship in 3-4 weeks; fully custom orders typically take 6-8 weeks depending on scope.",
      },
      {
        q: "Do you have weather-resistant outdoor furniture available?",
        a: "All Ferrova collections are engineered for outdoor use, built to withstand sun, rain and humidity.",
      },
      {
        q: "What distinguishes Ferrova Living from other manufacturers?",
        a: "Every piece is hand-finished at our Udaipur workshop with a focus on longevity, considered design and made-to-measure comfort.",
      },
    ],
  },
  enquiry: {
    eyebrow: "CONTACT US",
    heading: "Let’s Create Your",
    accent: "Perfect Space.",
    budgets: ["Under ₹1 Lakh", "₹1 – 5 Lakh", "₹5 – 15 Lakh", "Above ₹15 Lakh"],
    success: "Thank you — our team will reach out shortly.",
  },
  footer: {
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Collections", href: "/collections" },
      { label: "Projects", href: "/projects" },
      { label: "Contact", href: "/#contact" },
    ],
    copyright: "© 2026 Ferrova Living. All rights reserved.",
  },
  collectionsPage: {
    heading: "Collections",
    intro:
      "Considered silhouettes and enduring materials, made to measure for outdoor living. Choose a collection to see the pieces.",
  },
  collectionDetail: {
    intro:
      "Every piece can be tailored in size, finish and upholstery. Enquire for specifications, finishes and lead times.",
  },
  projectsPage: {
    heading: "Projects",
    intro: "A selection of hotels, resorts, villas and restaurants furnished by Ferrova Living.",
    empty: "Project stories are on the way. Add them in Admin → Projects.",
  },
  productsPage: {
    intro:
      "Considered silhouettes and enduring materials, made to measure for outdoor living. Every piece can be customized in size, finish and upholstery.",
  },
  contact: {
    company: "Ferrova Living",
    tagline: "Crafted for Modern Living.",
    phoneDisplay: "+91 90248 07898",
    phoneDigits: "919024807898",
    whatsappDigits: "919024807898",
    whatsappMessage:
      "Hi Ferrova Living, I'd like your latest catalogue and details on custom outdoor furniture.",
    email: "ferrovaliving@gmail.com",
    instagramHandle: "@ferrovaliving",
    instagramUrl: "https://instagram.com/ferrovaliving",
    hours: "Mon–Sun · 9 AM – 9 PM IST",
    addressLine1: "Udaipur, Rajasthan",
    addressLine2: "India · 313001",
  },
  seo: {
    siteName: "Ferrova Living",
    tagline: "Crafted for Modern Living",
    description:
      "Ferrova Living designs and manufactures premium outdoor furniture in Udaipur — powder-coated metal, teak and hand-woven rope pieces for hotels, resorts, villas and considered homes.",
    keywords: [
      "outdoor furniture manufacturer",
      "luxury outdoor furniture India",
      "bespoke outdoor furniture Udaipur",
      "hotel and resort furniture",
      "weatherproof furniture",
      "rope furniture",
      "poolside furniture",
      "custom outdoor furniture",
    ],
  },
};

const arr = <T>(v: unknown, fallback: T[]): T[] => (Array.isArray(v) ? (v as T[]) : fallback);

/** Merge stored site content over defaults so partial/old JSON keeps working. */
export function withSiteDefaults(raw: Partial<SiteContent> | undefined): SiteContent {
  const s = (raw || {}) as Partial<SiteContent>;
  const d = DEFAULT_SITE;
  return {
    nav: { ...d.nav, ...s.nav, links: arr(s.nav?.links, d.nav.links) },
    hero: { ...d.hero, ...s.hero },
    features: arr(s.features, d.features),
    collectionSection: { ...d.collectionSection, ...s.collectionSection },
    why: { ...d.why, ...s.why, items: arr(s.why?.items, d.why.items) },
    testimonialSection: { ...d.testimonialSection, ...s.testimonialSection },
    projectSection: { ...d.projectSection, ...s.projectSection },
    faq: { ...d.faq, ...s.faq, items: arr(s.faq?.items, d.faq.items) },
    enquiry: { ...d.enquiry, ...s.enquiry, budgets: arr(s.enquiry?.budgets, d.enquiry.budgets) },
    footer: { ...d.footer, ...s.footer, links: arr(s.footer?.links, d.footer.links) },
    collectionsPage: { ...d.collectionsPage, ...s.collectionsPage },
    collectionDetail: { ...d.collectionDetail, ...s.collectionDetail },
    projectsPage: { ...d.projectsPage, ...s.projectsPage },
    productsPage: { ...d.productsPage, ...s.productsPage },
    contact: { ...d.contact, ...s.contact },
    seo: { ...d.seo, ...s.seo, keywords: arr(s.seo?.keywords, d.seo.keywords) },
  };
}

/** WhatsApp deep link with a pre-filled message. */
export function whatsappUrl(contact: SiteContact, message?: string): string {
  return `https://wa.me/${contact.whatsappDigits}?text=${encodeURIComponent(
    message || contact.whatsappMessage,
  )}`;
}
