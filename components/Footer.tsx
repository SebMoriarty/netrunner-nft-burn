"use client";

import { SiDiscord, SiX } from "react-icons/si";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface FooterProps {
  onLogoClick?: () => void;
}

export default function Footer({ onLogoClick }: FooterProps) {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="px-4 md:px-8 lg:px-12 py-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          data-testid="link-footer-logo-home"
          className="flex items-center gap-2 text-muted-foreground hover-elevate rounded-md p-1"
          onClick={(e) => {
            if (onLogoClick) {
              e.preventDefault();
              onLogoClick();
            }
          }}
        >
          <img src="/netrunner-logo.png" alt="Netrunner" className="h-8 w-8 opacity-80 cursor-pointer" />
        </Link>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <a href="https://www.netrunner.tax/" target="_blank" rel="noopener noreferrer" data-testid="link-main-site">
              Main Site
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
