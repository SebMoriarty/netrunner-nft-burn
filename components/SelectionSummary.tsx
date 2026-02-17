"use client";

import { Flame, Percent, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SelectionSummaryProps {
  selectedCount: number;
  maxSelection: number;
  discountPercent: number;
  onContinue: () => void;
}

export default function SelectionSummary({
  selectedCount,
  maxSelection,
  discountPercent,
  onContinue,
}: SelectionSummaryProps) {
  return (
    <div className="sticky bottom-0 z-40 border-t border-primary/20 bg-background/98 backdrop-blur supports-[backdrop-filter]:bg-background/90 shadow-lg shadow-primary/5">
      <div className="px-4 md:px-8 lg:px-12 py-5 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Flame className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Selected</span>
              <div className="text-xl font-bold">
                <span className="text-primary">{selectedCount}</span>
                <span className="text-muted-foreground">/{maxSelection}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Percent className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Discount</span>
              <div className="text-2xl font-bold text-primary">
                {discountPercent}%
              </div>
            </div>
          </div>
        </div>

        <Button
          size="lg"
          onClick={onContinue}
          disabled={selectedCount === 0}
          className="px-8 shadow-md shadow-primary/20"
          data-testid="button-continue"
        >
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
