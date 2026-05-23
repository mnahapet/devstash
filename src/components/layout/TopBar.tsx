"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layers, Plus, Search } from "lucide-react";

export default function TopBar() {
  return (
    <header className="grid grid-cols-3 items-center px-4 h-14 border-b border-border shrink-0">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-linear-to-br from-violet-500 to-indigo-700">
          <Layers className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-semibold tracking-tight">DevStash</span>
      </div>

      <div className="relative w-full max-w-sm justify-self-center">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search items..."
          className="pl-9 pr-16 bg-muted border-0 w-full"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-2 justify-end">
        <Button variant="outline" size="sm">
          New Collection
        </Button>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          New Item
        </Button>
      </div>
    </header>
  );
}
