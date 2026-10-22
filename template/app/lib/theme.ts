/**
 * Dark mode without a provider.
 *
 * The `dark` class on <html> is the single source of truth. `themeScript` is
 * inlined in <head> (see root.tsx) and runs before first paint, so there's no
 * flash of the wrong theme.
 *
 * Preference is "light", "dark" or "system". "system" is the default and is
 * stored as no value at all, so new visitors follow their OS setting, live,
 * until they pick otherwise. Style with `dark:` variants; switch with
 * `setTheme()`.
 */

export const THEME_STORAGE_KEY = "theme";

export type Theme = "light" | "dark" | "system";

export const themeScript = `(() => {
  const key = ${JSON.stringify(THEME_STORAGE_KEY)};
  const query = matchMedia("(prefers-color-scheme: dark)");
  const apply = () => {
    let saved = null;
    try { saved = localStorage.getItem(key); } catch {}
    document.documentElement.classList.toggle(
      "dark",
      saved === "dark" || (saved !== "light" && query.matches),
    );
  };
  apply();
  query.addEventListener("change", apply);
  addEventListener("storage", (e) => e.key === key && apply());
})();`;

/** The saved preference. Client-only: call it in effects or event handlers. */
export function getTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // Storage blocked: fall through to system.
  }
  return "system";
}

export function setTheme(theme: Theme) {
  const dark =
    theme === "system" ? matchMedia("(prefers-color-scheme: dark)").matches : theme === "dark";
  document.documentElement.classList.toggle("dark", dark);
  try {
    // "system" clears the key, so themeScript goes back to following the OS.
    if (theme === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage blocked (private mode etc.): the switch still works for this page view.
  }
}

/** Flips between light and dark, saving an explicit choice. */
export function toggleTheme() {
  setTheme(document.documentElement.classList.contains("dark") ? "light" : "dark");
}
