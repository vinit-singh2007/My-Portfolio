import React from "react";

const base = { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" } as const;
export const ArrowUpRight = () => (<svg className="i" viewBox="0 0 24 24" {...base} strokeWidth={2}><path d="M7 17 17 7M8 7h9v9" /></svg>);
export const ArrowLeft = () => (<svg className="i" viewBox="0 0 24 24" {...base} strokeWidth={2}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>);
export const Chevron = ({ dir }: { dir: "l" | "r" }) => (<svg className="i" viewBox="0 0 24 24" {...base} strokeWidth={2}><path d={dir === "l" ? "M15 6l-6 6 6 6" : "m9 6 6 6-6 6"} /></svg>);
export const Calendar = () => (<svg viewBox="0 0 24 24" {...base} strokeWidth={1.6}><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>);
export const Clock = () => (<svg viewBox="0 0 24 24" {...base} strokeWidth={1.6}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);
export const Mail = () => (<svg viewBox="0 0 24 24" {...base} strokeWidth={1.6}><path d="M4 6h16v12H4zM4 7l8 6 8-6" /></svg>);
export const Window = () => (<svg viewBox="0 0 24 24" {...base} strokeWidth={1.6}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18" /></svg>);
export const Pin = () => (<svg viewBox="0 0 24 24" {...base} strokeWidth={1.6}><path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>);
export const Wave = () => (<svg viewBox="0 0 24 24" {...base} strokeWidth={1.6}><path d="M6 9c4-3 8 3 12 0M6 15c4-3 8 3 12 0" /></svg>);
