import type { ReactNode } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { HighlightedCode } from "./code-block";

/** Preview / Code tabs: a live demo next to the component's source. */
export function ComponentPreview({ children, html }: { children: ReactNode; html: string }) {
  return (
    <Tabs defaultValue="preview" className="min-w-0">
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent
        value="preview"
        className="flex min-h-48 items-center justify-center border p-6 sm:p-10"
      >
        {children}
      </TabsContent>
      <TabsContent value="code" className="min-w-0">
        <HighlightedCode html={html} />
      </TabsContent>
    </Tabs>
  );
}
