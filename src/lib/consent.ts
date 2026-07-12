// Shared constants and helpers for the cookie-consent banner (kept out of the
// component file so it can stay a component-only module for Fast Refresh).
export const CONSENT_STORAGE_KEY = "devbox-consent";
export const CONSENT_OPEN_EVENT = "devbox:open-consent";

/** Reopen the consent banner from anywhere (e.g. a footer link). */
export function openConsentSettings() {
  window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT));
}
