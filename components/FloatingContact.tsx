import { publicContent, whatsappUrl } from "../lib/content";

export async function FloatingContact() {
  const { site } = await publicContent();
  const c = site.contact;

  return (
    <div className="floatContact" aria-label="Quick contact">
      <a
        className="floatContact__btn floatContact__btn--wa"
        href={whatsappUrl(c)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Message ${c.company} on WhatsApp`}
      >
        <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
          <path
            fill="currentColor"
            d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.6 6L4 27l6.2-1.6c1.7.9 3.7 1.4 5.8 1.4 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-1.9 0-3.7-.5-5.3-1.5l-.4-.2-3.7 1 1-3.6-.2-.4A9.7 9.7 0 0 1 6.2 15C6.2 9.6 10.6 5.2 16 5.2S25.8 9.6 25.8 15 21.4 24.8 16 24.8zm5.4-7.3c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.3z"
          />
        </svg>
        <span className="floatContact__label">WhatsApp</span>
      </a>
      <a
        className="floatContact__btn floatContact__btn--ig"
        href={c.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${c.company} on Instagram`}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <g fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4.2" />
            <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
          </g>
        </svg>
        <span className="floatContact__label">Instagram</span>
      </a>
    </div>
  );
}
