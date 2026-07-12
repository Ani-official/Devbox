import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CONSENT_STORAGE_KEY, CONSENT_OPEN_EVENT } from "../lib/consent";

type GtagConsentParams = Record<string, "granted" | "denied">;
type Gtag = (command: "consent", action: "update", params: GtagConsentParams) => void;

function updateConsent(granted: boolean) {
  const state = granted ? "granted" : "denied";
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag === "function") {
    gtag("consent", "update", {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state,
    });
  }
}

export default function ConsentBanner() {
  // Start hidden so the first client render matches the prerendered HTML
  // (no hydration mismatch); reveal after mount based on stored choice.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_STORAGE_KEY)) setVisible(true);
    } catch {
      /* localStorage unavailable — leave hidden */
    }
    const reopen = () => setVisible(true);
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  const choose = (granted: boolean) => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, granted ? "granted" : "denied");
    } catch {
      /* ignore */
    }
    updateConsent(granted);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          DevBox uses cookies to show ads and understand traffic. You can accept or reject non-essential
          cookies. See our{" "}
          <Link to="/privacy-policy" className="font-medium text-blue-600 underline dark:text-blue-400">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => choose(false)}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Reject
          </button>
          <button
            onClick={() => choose(true)}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
