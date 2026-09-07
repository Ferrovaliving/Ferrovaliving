const links = [
  ["/admin/site", "Site content"],
  ["/admin/catalog", "Catalog & Categories"],
  ["/admin/projects", "Projects"],
  ["/admin/testimonials", "Testimonials"],
  ["/admin/about", "About"],
];

export function CmsNav({ current }: { current: string }) {
  return (
    <nav className="cmsNav">
      <a href="/admin" className="cmsNav__back">← Admin home</a>
      <div className="cmsNav__links">
        {links.map(([href, label]) => (
          <a key={href} href={href} className={href === current ? "on" : ""}>
            {label}
          </a>
        ))}
      </div>
      <a href="/" target="_blank" rel="noreferrer" className="cmsNav__preview">
        Preview site ↗
      </a>
    </nav>
  );
}
