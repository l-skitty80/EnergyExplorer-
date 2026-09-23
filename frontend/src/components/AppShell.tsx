import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Moon, Sun, Menu, X, RotateCcw, ExternalLink } from "lucide-react";
import { STORAGE_KEYS, readLocal } from "@/lib/localState";

const nav = [
  ["/", "Observatory", "⌂"], ["/solar", "Solar tracker", "☼"], ["/journey", "Energy journey", "→"],
  ["/calculator", "Calculator", "∑"], ["/lpu", "LPU model", "▣"], ["/game", "Power the city", "◈"],
  ["/learn", "Information hub", "i"], ["/survey", "Survey", "↗"],
] as const;

export default function AppShell() {
  const location = useLocation();
  const [dark, setDark] = useState(() => readLocal(STORAGE_KEYS.theme, "dark") === "dark");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(STORAGE_KEYS.theme, dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  function clearLocalData() {
    localStorage.removeItem(STORAGE_KEYS.calculator);
    localStorage.removeItem(STORAGE_KEYS.game);
    setDark(true);
    window.dispatchEvent(new Event("helios-data-cleared"));
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-background/90 backdrop-blur-xl" data-testid="app-header">
        <div className="mx-auto flex max-w-[1500px] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex min-w-fit items-center gap-3" data-testid="brand-home-link">
            <span className="relative grid size-9 place-items-center rounded-xl border border-cyan-400/40 bg-cyan-400/10 text-lg text-cyan-300 shadow-[0_0_24px_rgba(0,217,255,.16)]">✦<span className="signal-dot absolute -right-0.5 -top-0.5 size-2 rounded-full bg-amber-400" /></span>
            <span className="hidden sm:block"><span className="block font-heading text-lg font-semibold tracking-wide">HELIOS</span><span className="font-mono text-[9px] uppercase tracking-[.22em] text-muted-foreground">energy explorer</span></span>
          </NavLink>
          <nav className="hidden flex-1 items-center justify-end gap-1 overflow-x-auto xl:flex" aria-label="Primary navigation" data-testid="desktop-navigation">
            {nav.map(([path, label, icon]) => <NavItem key={path} path={path} label={label} icon={icon} />)}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button type="button" onClick={() => setDark((v) => !v)} className="grid size-11 place-items-center rounded-xl border border-border bg-card/70 text-muted-foreground hover:border-cyan-400/60 hover:text-cyan-500" aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} data-testid="theme-toggle-button">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
            <button type="button" onClick={() => setMenuOpen((v) => !v)} className="grid size-11 place-items-center rounded-xl border border-border bg-card/70 text-muted-foreground hover:border-cyan-400/60 hover:text-cyan-500 xl:hidden" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} data-testid="mobile-navigation-toggle">{menuOpen ? <X size={18} /> : <Menu size={18} />}</button>
          </div>
        </div>
        {menuOpen && <nav className="border-t border-border bg-background px-4 py-3 xl:hidden" aria-label="Mobile navigation" data-testid="mobile-navigation">{nav.map(([path, label, icon]) => <NavItem key={path} path={path} label={label} icon={icon} mobile /> )}</nav>}
      </header>
      <main className="page-enter mx-auto max-w-[1500px]"> <Outlet /> </main>
      <footer className="mt-20 border-t border-cyan-500/15 bg-slate-950/40 px-4 py-12 sm:px-6 lg:px-8" data-testid="app-footer">
        <div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div><p className="font-mono text-xs uppercase tracking-[.2em] text-cyan-400">[ GRID: ONLINE ]</p><h2 className="mt-3 max-w-md font-heading text-3xl font-semibold">Make the invisible energy system legible.</h2><p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">A college project for learning how renewable energy works, where estimates come from, and why every design choice has a trade-off.</p></div>
          <div><p className="font-mono text-xs uppercase tracking-[.2em] text-muted-foreground">Explore</p><div className="mt-4 grid gap-2 text-sm">{nav.slice(1, 5).map(([path, label]) => <NavLink key={path} to={path} className="text-muted-foreground hover:text-cyan-400">{label}</NavLink>)}</div></div>
          <div><p className="font-mono text-xs uppercase tracking-[.2em] text-muted-foreground">Local controls</p><p className="mt-4 text-sm leading-6 text-muted-foreground">Theme, calculator inputs, and game progress stay in this browser only.</p><button type="button" onClick={clearLocalData} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-3 text-sm text-muted-foreground hover:border-amber-400 hover:text-amber-500" data-testid="clear-local-data-button"><RotateCcw size={14} /> Clear local data</button></div>
        </div>
        <div className="mx-auto mt-12 flex max-w-[1500px] flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-5 font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground"><span data-testid="footer-status">[ TELEMETRY: EDUCATIONAL MODE ]</span><NavLink to="/about" className="hover:text-cyan-400">Sources & methodology</NavLink><a href="https://forms.google.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-cyan-400" data-testid="footer-survey-link">Survey placeholder <ExternalLink size={11} /></a></div>
      </footer>
    </div>
  );
}

function NavItem({ path, label, icon, mobile = false }: { path: string; label: string; icon: string; mobile?: boolean }) {
  return <NavLink to={path} className={({ isActive }) => `group flex min-h-11 items-center gap-2 rounded-lg px-3 text-xs font-medium whitespace-nowrap ${mobile ? "w-full border-b border-border py-3" : ""} ${isActive ? "bg-cyan-400/12 text-cyan-400" : "text-muted-foreground hover:bg-card hover:text-foreground"}`} data-testid={`nav-${label.toLowerCase().replaceAll(" ", "-")}-link`}><span className="font-mono text-cyan-500">{icon}</span>{label}</NavLink>;
}