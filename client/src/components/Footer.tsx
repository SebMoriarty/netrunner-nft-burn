import { SiDiscord, SiX } from "react-icons/si";
import { Button } from "@/components/ui/button";
import netrunnerLogo from "@assets/Logo_-_Bright_Netrunner_copy_1765940751964.png";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="px-4 md:px-8 lg:px-12 py-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <img src={netrunnerLogo} alt="Netrunner" className="h-8 w-8 opacity-80" />
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <a href="https://www.netrunner.tax/" target="_blank" rel="noopener noreferrer" data-testid="link-main-site">
              Main Site
            </a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="#" data-testid="link-docs">
              Docs
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
