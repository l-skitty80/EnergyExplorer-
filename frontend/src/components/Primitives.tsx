import type { ReactNode } from "react";
import { ArrowRight, Info } from "lucide-react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[10px] uppercase tracking-[.22em] text-cyan-400" data-testid="page-eyebrow">{children}</p>;
}

export function PageIntro({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: ReactNode }) {
  return <section className="observatory-grid relative overflow-hidden border-b border-cyan-500/15 px-4 py-12 sm:px-6 lg:px-8 lg:py-16" data-testid="page-intro"><div className="relative mx-auto max-w-[1500px]"><Eyebrow>{eyebrow}</Eyebrow><h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl" data-testid="page-title">{title}</h1><p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground" data-testid="page-description">{description}</p>{children && <div className="mt-7 flex flex-wrap gap-3">{children}</div>}</div></section>;
}

export function Panel({ children, className = "", testId }: { children: ReactNode; className?: string; testId?: string }) {
  return <section className={`rounded-2xl border border-cyan-500/15 bg-card/75 p-5 shadow-[0_8px_32px_rgba(0,217,255,.05)] backdrop-blur-xl sm:p-6 ${className}`} data-testid={testId}>{children}</section>;
}

export function PanelHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return <div>{eyebrow && <p className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan-400">{eyebrow}</p>}<h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight" data-testid={`heading-${title.toLowerCase().replaceAll(" ", "-")}`}>{title}</h2>{description && <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>}</div>;
}

export function InfoNote({ children }: { children: ReactNode }) {
  return <div className="flex gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-sm leading-6 text-muted-foreground" data-testid="educational-note"><Info className="mt-0.5 shrink-0 text-cyan-400" size={17} /> <div>{children}</div></div>;
}

export function LinkArrow({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center gap-2">{children}<ArrowRight size={16} /></span>;
}

export function ProgressBar({ value, color = "#00D9FF", label }: { value: number; color?: string; label: string }) {
  const safe = Math.max(0, Math.min(100, value));
  return <div aria-label={`${label}: ${Math.round(safe)} percent`} role="progressbar" aria-valuenow={Math.round(safe)} aria-valuemin={0} aria-valuemax={100} data-testid={`progress-${label.toLowerCase().replaceAll(" ", "-")}`}><div className="mb-2 flex justify-between text-xs"><span className="text-muted-foreground">{label}</span><span className="font-mono" style={{ color }}>{Math.round(safe)}%</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full" style={{ width: `${safe}%`, backgroundColor: color }} /></div></div>;
}