import { Zap } from "lucide-react";
import { SiDiscord, SiX } from "react-icons/si";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Zap className="h-4 w-4" />
          <span className="text-sm">Netrunner NFT Burn</span>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <a href="#" data-testid="link-docs">
              Docs
            </a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="#" data-testid="link-status">
              Status
            </a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="#" data-testid="link-support">
              Support
            </a>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild data-testid="link-discord">
            <a href="#" aria-label="Discord">
              <SiDiscord className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild data-testid="link-twitter">
            <a href="#" aria-label="Twitter">
              <SiX className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
}
