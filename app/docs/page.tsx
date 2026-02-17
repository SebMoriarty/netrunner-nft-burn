"use client";

import { ArrowLeft, Flame, MousePointer, Mail, Wallet, Gift, CheckCircle, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/Header";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

const steps = [
  {
    number: 1,
    title: "Get Started",
    description: "Click the \"Get Started\" button on the main page to begin the burn process.",
    icon: MousePointer,
  },
  {
    number: 2,
    title: "Select NFTs",
    description: "Select the NFTs you want to burn. Each NFT unlocks 3% discount - stack up to 10 for maximum savings of 30% off.",
    icon: Flame,
  },
  {
    number: 3,
    title: "Enter Your Details",
    description: "Enter your email address and Discord username, then click \"Burn and Claim Discount\".",
    icon: Mail,
  },
  {
    number: 4,
    title: "Sign the Transaction",
    description: "Sign the transaction to verify you own the NFTs. This sends the NFTs to our burn wallet.",
    icon: Wallet,
  },
  {
    number: 5,
    title: "Receive Your Code",
    description: "You'll receive your discount code by email within 24 hours. Check your spam folder if you don't see it.",
    icon: Gift,
  },
  {
    number: 6,
    title: "Enjoy Netrunner",
    description: "Use your discount code at checkout. Thank you for participating in the burn program!",
    icon: CheckCircle,
  },
];

const faqs = [
  {
    question: "Which NFTs are eligible for the burn program?",
    answer: "Only Netrunner V2 NFTs are eligible for the burn program. These are verified by our system automatically when you connect your wallet.",
  },
  {
    question: "How much discount can I get?",
    answer: "Each NFT burned gives you 3% discount. You can burn up to 10 NFTs for a maximum discount of 30%.",
  },
  {
    question: "How long until I receive my discount code?",
    answer: "Discount codes are typically sent within 24 hours of completing the burn. Check your spam folder if you haven't received it.",
  },
  {
    question: "Can I burn NFTs from multiple wallets?",
    answer: "Yes, but you'll need to complete separate burn transactions for each wallet. Each burn will generate its own discount code.",
  },
  {
    question: "What happens to my burned NFTs?",
    answer: "Burned NFTs are transferred to our intake wallet and permanently removed from circulation. This process is irreversible.",
  },
  {
    question: "Can I use multiple discount codes?",
    answer: "Discount codes cannot be stacked. However, you can burn multiple NFTs in a single transaction to maximize your discount.",
  },
];

export default function Docs() {
  const { publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const walletAddress = publicKey?.toBase58();

  return (
    <div className="min-h-screen bg-background">
      <Header
        walletAddress={walletAddress}
        onConnectWallet={() => setVisible(true)}
        onDisconnectWallet={disconnect}
      />

      <main className="px-4 md:px-6 lg:px-8 py-12 max-w-4xl mx-auto">
        <Button variant="ghost" size="sm" asChild className="mb-8 text-muted-foreground">
          <Link href="/" data-testid="link-back-home">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Main Site
          </Link>
        </Button>

        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-docs-title">
            How It Works
          </h1>
          <p className="text-lg text-muted-foreground">
            Follow these simple steps to burn your eligible NFTs and claim your Netrunner discount.
          </p>
        </div>

        <div className="space-y-4 mb-16">
          {steps.map((step) => (
            <Card key={step.number} className="overflow-visible" data-testid={`card-step-${step.number}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-mono text-primary">0{step.number}</span>
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6" data-testid="text-faq-title">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="border border-border rounded-md px-4 data-[state=open]:bg-card"
                data-testid={`accordion-faq-${index}`}
              >
                <AccordionTrigger className="text-left hover:no-underline py-4" data-testid={`button-faq-${index}`}>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center py-8 border-t border-border">
          <p className="text-muted-foreground mb-4">Ready to burn your NFTs?</p>
          <Button asChild data-testid="button-start-burning">
            <Link href="/">
              Start Burning
              <ExternalLink className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </main>

      <footer className="border-t border-border py-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors" data-testid="link-footer-home">
            Main Site
          </Link>
          <a
            href="https://discord.gg/netrunner"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
            data-testid="link-footer-discord"
          >
            Discord
          </a>
          <a
            href="mailto:support@netrunner.com"
            className="hover:text-foreground transition-colors"
            data-testid="link-footer-support"
          >
            Support
          </a>
        </div>
      </footer>
    </div>
  );
}
