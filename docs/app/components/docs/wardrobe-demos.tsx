import { useEffect, useState } from "react";

import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { setTheme } from "~/lib/theme";

const tokens = [
  "background",
  "foreground",
  "primary",
  "secondary",
  "muted",
  "accent",
  "destructive",
  "border",
  "card",
  "sidebar",
] as const;

/** The theme's color tokens, drawn from the live CSS variables, so they follow light / dark. */
export function Swatches() {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
      {tokens.map((t) => (
        <div key={t} className="flex flex-col gap-1.5">
          <div className="h-12 border" style={{ background: `var(--${t})` }} />
          <code className="text-xs">{t}</code>
        </div>
      ))}
    </div>
  );
}

/** Flips between light and dark with setTheme(); the header menu also offers System. */
export function DarkModeSwitch() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setDark(root.classList.contains("dark"));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mt-4 flex items-center gap-3">
      <Switch
        id="dark-mode"
        checked={dark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
      <Label htmlFor="dark-mode">Dark mode</Label>
    </div>
  );
}
