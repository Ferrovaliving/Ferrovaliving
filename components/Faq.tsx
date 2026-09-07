"use client";

import { useState } from "react";
import type { FaqItem } from "../lib/site-content";

export function Faq({
  eyebrow,
  heading,
  items,
}: {
  eyebrow: string;
  heading: string;
  items: FaqItem[];
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  if (!items.length) return null;
  return (
    <section id="faq" className="faq">
      <p className="eyebrow gold tc">{eyebrow}</p>
      <h2 className="tc">{heading}</h2>
      <div className="faqList">
        {items.map((f, i) => (
          <div className="faqRow" key={f.q + i}>
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              {f.q}
              <span>{openFaq === i ? "–" : "+"}</span>
            </button>
            {openFaq === i && <p>{f.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
