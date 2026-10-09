import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { beginSession } from "@/lib/session";

export default function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const processed = useRef(false);
  useEffect(() => {
    if (processed.current) return;
    processed.current = true;
    const sessionId = new URLSearchParams(location.hash.slice(1)).get("session_id");
    if (!sessionId) {
      navigate("/", { replace: true });
      return;
    }
    beginSession(sessionId).then(() => navigate("/account", { replace: true })).catch(() => navigate("/account?auth=error", { replace: true }));
  }, [location.hash, navigate]);
  return <div className="grid min-h-[60svh] place-items-center px-6" data-testid="auth-callback"><div className="text-center"><span className="mx-auto grid size-14 animate-pulse place-items-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-2xl text-cyan-400">✦</span><p className="mt-5 font-heading text-xl font-semibold">Connecting your HELIOS session…</p><p className="mt-2 text-sm text-muted-foreground">This handoff is processed securely by the app server.</p></div></div>;
}