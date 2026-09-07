export function Icon({name}:{name:string}){
  const p={viewBox:"0 0 24 24",fill:"none" as const,stroke:"currentColor",strokeWidth:1.4,strokeLinecap:"round" as const,strokeLinejoin:"round" as const};
  if(name==="frame")return <svg {...p}><path d="M4 3v18M12 3v18M20 3v18"/></svg>;
  if(name==="fabric")return <svg {...p}><rect x="3" y="8" width="13" height="8" rx="3"/><circle cx="19" cy="12" r="2.4"/></svg>;
  if(name==="weave")return <svg {...p}><path d="M2 9c2-3 4-3 6 0s4 3 6 0 4-3 6 0"/><path d="M2 16c2-3 4-3 6 0s4 3 6 0 4-3 6 0"/></svg>;
  if(name==="finish")return <svg {...p}><path d="M6 3h12l4 6-10 12L2 9z"/></svg>;
  if(name==="medal")return <svg {...p}><circle cx="12" cy="8" r="5"/><path d="M8.5 12.5L6 21l6-3.5L18 21l-2.5-8.5"/></svg>;
  if(name==="ruler")return <svg {...p}><path d="M3 17L17 3l4 4L7 21z"/><path d="M13 7l2 2M10 10l2 2M7 13l2 2"/></svg>;
  if(name==="truck")return <svg {...p}><path d="M1 7h13v9H1z"/><path d="M14 11h4l4 4v1h-8z"/><circle cx="5.5" cy="19" r="2"/><circle cx="17.5" cy="19" r="2"/></svg>;
  if(name==="people")return <svg {...p}><circle cx="8" cy="8" r="4"/><circle cx="16" cy="9.5" r="3.4"/><path d="M2 21c0-4 2.8-6.2 6-6.2s6 2.2 6 6.2M14.3 21c.4-3 2-5.2 4-5.2 2.2 0 5.2 1.4 5.7 5.2"/></svg>;
  if(name==="lounge")return <svg {...p}><path d="M6 20V10a2 2 0 012-2h8a2 2 0 012 2v10"/><path d="M4 20h16"/><path d="M4 20v-3a1 1 0 011-1M20 20v-3a1 1 0 00-1-1"/></svg>;
  if(name==="daybeds")return <svg {...p}><rect x="2" y="10" width="20" height="7" rx="2"/><path d="M2 17v3M22 17v3M2 10V8a2 2 0 012-2h4"/></svg>;
  if(name==="sofas")return <svg {...p}><path d="M4 12V9a2 2 0 012-2h12a2 2 0 012 2v3"/><path d="M2 13a2 2 0 012-2 2 2 0 012 2v4h12v-4a2 2 0 012-2 2 2 0 012 2v6H4v-6z"/><path d="M6 20v2M18 20v2"/></svg>;
  if(name==="bar-stools")return <svg {...p}><path d="M8 3h8l-1 7H9z"/><path d="M9 10l-2 11M15 10l2 11M7.5 16h9"/></svg>;
  if(name==="balcony-sets")return <svg {...p}><circle cx="12" cy="10" r="5"/><path d="M12 10v10M7 20l5-4 5 4M4 7h4M16 7h4"/></svg>;
  if(name==="dining")return <svg {...p}><path d="M2 9h20M4 20V9M20 20V9M8 20v-4h8v4"/></svg>;
  if(name==="bar")return <svg {...p}><circle cx="12" cy="7" r="3"/><path d="M12 10v6M8 20l4-4 4 4"/></svg>;
  if(name==="loungers")return <svg {...p}><path d="M2 16h13l4-5H8z"/><path d="M2 16v4M19 11l3 1-1 4"/></svg>;
  if(name==="tables")return <svg {...p}><rect x="4" y="9" width="16" height="3" rx="1"/><path d="M6 12v8M18 12v8"/></svg>;
  if(name==="custom")return <svg {...p}><path d="M14 3l7 7-9 9-7 1 1-7z"/></svg>;
  return null;
}
