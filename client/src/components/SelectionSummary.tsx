import { Flame, Percent, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    <div className="sticky bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto max-w-6xl px-4 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Selected:</span>
            <Badge variant="secondary" className="font-mono">
              {selectedCount}/{maxSelection}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Percent className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Discount:</span>
            <span className="text-2xl font-bold text-primary">
              {discountPercent}%
            </span>
          </div>
        </div>

        <Button
          onClick={onContinue}
          disabled={selectedCount === 0}
          data-testid="button-continue"
        >
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
