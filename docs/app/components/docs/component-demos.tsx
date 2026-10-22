import { Clapperboard, ChevronRight, Film, Inbox, Mic, Pause, Play, Square } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "~/components/ui/button";
import { ButtonGroup } from "~/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "~/components/ui/item";
import { Label } from "~/components/ui/label";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "~/components/ui/message-scroller";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Slider } from "~/components/ui/slider";
import { Textarea } from "~/components/ui/textarea";

const takes = { "1": "Take 1", "2": "Take 2", "3": "Take 3" };

const log = [
  "Slate: scene 4, take 1.",
  "Rolling.",
  "Speed.",
  "Action.",
  "Cut. Reset to one.",
  "Back to first positions.",
  "Rolling again.",
  "Action.",
  "Cut. Check the gate.",
  "Gate's good. Moving on.",
];

/**
 * One demo per component the template ships, keyed by file name in
 * app/components/ui. The Props page fails its test if a shipped component has no entry.
 */
export const demos: Record<string, () => ReactNode> = {
  button: () => (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button>Action</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Cut</Button>
      <Button variant="link">Link</Button>
      <Button size="icon" aria-label="Record">
        <Mic />
      </Button>
    </div>
  ),
  "button-group": () => (
    <ButtonGroup aria-label="Transport">
      <Button variant="outline" aria-label="Play">
        <Play />
      </Button>
      <Button variant="outline" aria-label="Pause">
        <Pause />
      </Button>
      <Button variant="outline" aria-label="Stop">
        <Square />
      </Button>
    </ButtonGroup>
  ),
  "dropdown-menu": () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>Scene 4</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Takes</DropdownMenuLabel>
          <DropdownMenuItem>Mark as print</DropdownMenuItem>
          <DropdownMenuItem>Add a note</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive">Discard take</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  empty: () => (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Inbox />
        </EmptyMedia>
        <EmptyTitle>No takes yet</EmptyTitle>
        <EmptyDescription>Roll camera to record the first one.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">Roll camera</Button>
      </EmptyContent>
    </Empty>
  ),
  item: () => (
    <ItemGroup className="w-full max-w-sm">
      <Item variant="outline">
        <ItemMedia variant="icon">
          <Film />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Scene 4, take 2</ItemTitle>
          <ItemDescription>Circled. 1 min 42 s.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="ghost" size="icon-sm" aria-label="Open">
            <ChevronRight />
          </Button>
        </ItemActions>
      </Item>
    </ItemGroup>
  ),
  label: () => (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="demo-notes">Script notes</Label>
      <Textarea id="demo-notes" placeholder="Labels name the field they sit next to." />
    </div>
  ),
  "message-scroller": () => (
    <div className="h-56 w-full max-w-sm border">
      <MessageScrollerProvider defaultScrollPosition="end">
        <MessageScroller>
          <MessageScrollerViewport aria-label="Sound log">
            <MessageScrollerContent className="gap-3 p-4">
              {log.map((line, i) => (
                <MessageScrollerItem key={i} messageId={String(i)} className="text-sm">
                  {line}
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  ),
  "navigation-menu": () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Departments</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-56 gap-1 p-2">
              {["Camera", "Sound", "Lighting"].map((d) => (
                <li key={d}>
                  <NavigationMenuLink href="#props">{d}</NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
  select: () => (
    <Select items={takes} defaultValue="2">
      <SelectTrigger className="w-40" aria-label="Take">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.entries(takes).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
  separator: () => (
    <div className="flex h-5 items-center gap-4 text-sm">
      <span>Camera</span>
      <Separator orientation="vertical" />
      <span>Sound</span>
      <Separator orientation="vertical" />
      <span>Lighting</span>
    </div>
  ),
  slider: () => (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Label>
        <Clapperboard /> Boom level
      </Label>
      <Slider defaultValue={[60]} max={100} aria-label="Boom level" />
    </div>
  ),
  textarea: () => <Textarea className="max-w-sm" placeholder="Continuity notes for scene 4…" />,
};
