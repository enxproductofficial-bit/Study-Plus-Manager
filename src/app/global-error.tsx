"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 font-sans flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-2">Application Error</h2>
          <p className="text-xs text-slate-400 mb-4">
            {error?.message || "An unexpected error occurred."}
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => {
                try {
                  localStorage.clear();
                } catch {}
                window.location.reload();
              }}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-200"
            >
              Clear Storage & Reload
            </button>
            <button
              onClick={() => reset()}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
