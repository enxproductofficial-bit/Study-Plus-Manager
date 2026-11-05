"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Trash2, Home, Building2 } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to browser console for diagnostics
    console.error("GranthSetu Client Error Boundary:", error);
  }, [error]);

  const handleClearCacheAndReload = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("granthsetu_user");
        localStorage.removeItem("granthsetu_lang");
        localStorage.removeItem("theme");
      }
    } catch {}
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full rounded-3xl border border-slate-800 bg-slate-900/90 p-7 shadow-2xl backdrop-blur-xl text-center space-y-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Client-Side Exception Recovered
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            A temporary client rendering issue occurred in your browser session. You can reload or reset your cached session below.
          </p>
        </div>

        {error?.message && (
          <div className="rounded-xl border border-rose-900/40 bg-rose-950/20 p-3 text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 block mb-1">
              Diagnostic Error:
            </span>
            <p className="text-xs font-mono text-rose-200 break-words line-clamp-3">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2.5 pt-2">
          <button
            onClick={() => reset()}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-2.5 text-xs font-bold text-white shadow-sm transition active:scale-98"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </button>

          <button
            onClick={handleClearCacheAndReload}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 py-2.5 text-xs font-semibold text-slate-200 transition"
          >
            <Trash2 className="h-3.5 w-3.5 text-rose-400" />
            <span>Clear Cached Session & Reload</span>
          </button>

          <Link
            href="/owner"
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-blue-500/30 bg-blue-950/40 hover:bg-blue-900/50 py-2.5 text-xs font-bold text-blue-300 transition"
          >
            <Building2 className="h-3.5 w-3.5 text-blue-400" />
            <span>Open Owner Portal Directly</span>
          </Link>
        </div>

        <div className="pt-2 text-[10px] text-slate-500">
          GranthSetu • Enterprise Study Centre Management OS
        </div>
      </div>
    </div>
  );
}

