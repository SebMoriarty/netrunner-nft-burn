import { useEffect, useRef } from "react";
import { Loader2, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type TransactionStatus = "preparing" | "signing" | "processing" | "error";

interface TransactionModalProps {
  isOpen: boolean;
  status: TransactionStatus;
  errorMessage?: string;
  onCancel: () => void;
  onRetry?: () => void;
}

export default function TransactionModal({
  isOpen,
  status,
  errorMessage,
  onCancel,
  onRetry,
}: TransactionModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const modal = modalRef.current;
    if (modal) modal.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && status === "signing") {
        onCancel();
        return;
      }
      if (e.key === "Tab" && modal) {
        const focusable = modal.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, status, onCancel]);

  if (!isOpen) return null;

  const statusMessages: Record<TransactionStatus, string> = {
    preparing: "Preparing transaction...",
    signing: "Please sign in your wallet...",
    processing: "Processing transaction...",
    error: "Transaction failed",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-label={statusMessages[status]}>
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={status === "signing" ? onCancel : undefined}
      />

      <div ref={modalRef} tabIndex={-1} className="relative z-10 w-full max-w-md mx-4 p-8 rounded-2xl bg-card border border-border shadow-lg outline-none">
        {status === "error" ? (
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{statusMessages[status]}</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {errorMessage || "Something went wrong. Please try again."}
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={onCancel} data-testid="button-cancel-tx">
                Cancel
              </Button>
              {onRetry && (
                <Button onClick={onRetry} data-testid="button-retry-tx">
                  Try Again
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{statusMessages[status]}</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {status === "signing"
                ? "Check your wallet extension to approve the transaction."
                : "This may take a few moments. Please don't close this page."}
            </p>
            {status === "signing" && (
              <Button variant="outline" onClick={onCancel} data-testid="button-cancel-signing">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
