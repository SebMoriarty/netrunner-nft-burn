import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, MessageCircle, Flame, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { NFT } from "./NFTCard";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  discord: z.string().min(2, "Discord handle must be at least 2 characters"),
});

type FormData = z.infer<typeof formSchema>;

interface UserInfoFormProps {
  selectedNFTs: NFT[];
  discountPercent: number;
  isSubmitting: boolean;
  onSubmit: (data: FormData) => void;
  onBack: () => void;
}

export default function UserInfoForm({
  selectedNFTs,
  discountPercent,
  isSubmitting,
  onSubmit,
  onBack,
}: UserInfoFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      discord: "",
    },
  });

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl w-full">
        <div className="flex flex-col justify-center">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 w-fit"
            data-testid="button-flow-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Selection
          </Button>

          <h2 className="text-2xl font-semibold mb-2">Claim Your Discount</h2>
          <p className="text-muted-foreground mb-6">
            Enter your details below. Your discount code will be sent to your email after the burn is verified.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="you@example.com"
                          className="pl-10"
                          data-testid="input-email"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discord"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discord Handle</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="username#1234"
                          className="pl-10"
                          data-testid="input-discord"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full mt-6 shadow-md shadow-primary/20"
                disabled={isSubmitting}
                data-testid="button-burn"
              >
                <Flame className="h-5 w-5 mr-2" />
                {isSubmitting ? "Processing..." : "Burn & Claim Discount"}
              </Button>
            </form>
          </Form>
        </div>

        <div className="flex items-center">
          <Card className="p-6 w-full">
            <h3 className="font-semibold mb-4">Burn Summary</h3>

            <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
              <span className="text-muted-foreground">NFTs to Burn</span>
              <Badge variant="secondary" className="font-mono text-base px-3">
                {selectedNFTs.length}
              </Badge>
            </div>

            <div className="flex items-center justify-between mb-6">
              <span className="text-muted-foreground">Your Discount</span>
              <span className="text-3xl font-bold text-primary">{discountPercent}%</span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {selectedNFTs.map((nft) => (
                <div
                  key={nft.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                >
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{nft.name}</p>
                    <p className="text-xs font-mono text-muted-foreground truncate">
                      {nft.mint.slice(0, 8)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
