"use client";

import Link from "next/link";
import { useAppState } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { X, GitCompareArrows } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CompareBar() {
  const { properties, compareList, toggleCompare } = useAppState();
  const compared = properties.filter((p) => compareList.includes(p.id));

  const clearCompare = () => {
    compared.forEach((p) => toggleCompare(p.id));
  };

  if (compared.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card/95 shadow-2xl backdrop-blur-xl"
      >
        <div className="container mx-auto flex items-center gap-4 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <GitCompareArrows className="h-5 w-5 text-secondary" />
            <span>Compare ({compared.length}/4)</span>
          </div>

          <div className="flex flex-1 items-center gap-2 overflow-x-auto">
            {compared.map((p) => (
              <div
                key={p.id}
                className="flex flex-shrink-0 items-center gap-2 rounded-lg border bg-background px-2 py-1.5"
              >
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="h-8 w-12 rounded object-cover"
                />
                <span className="max-w-[120px] truncate text-xs font-medium">
                  {p.title}
                </span>
                <button
                  onClick={() => toggleCompare(p.id)}
                  className="rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCompare}
              className="text-muted-foreground"
            >
              Clear
            </Button>
            <Link href="/compare">
              <Button
                size="sm"
                disabled={compared.length < 2}
                className="gradient-accent text-accent-foreground border-0"
              >
                Compare Now
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
