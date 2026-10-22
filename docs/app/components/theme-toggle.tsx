import { Monitor, Moon, Sun } from "lucide-react";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { getTheme, setTheme, type Theme } from "~/lib/theme";

/**
 * Light / Dark / System menu. The trigger shows a sun or a moon for whichever
 * theme is actually showing, including when "System" picked it. That icon is
 * chosen by CSS (`dark:` variants), not React state, so the server render
 * always matches and nothing flickers on load. The selected option is read
 * from storage when the menu opens, which only happens in the browser.
 */
export function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>("system");

  return (
    <DropdownMenu onOpenChange={(open) => open && setThemeState(getTheme())}>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="Theme" />}>
        <Sun className="dark:hidden" />
        <Moon className="hidden dark:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value: Theme) => {
            setTheme(value);
            setThemeState(value);
          }}
        >
          <DropdownMenuRadioItem value="light" closeOnClick>
            <Sun /> Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" closeOnClick>
            <Moon /> Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system" closeOnClick>
            <Monitor /> System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
