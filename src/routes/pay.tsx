import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import {
  ChevronLeft,
  CheckCircle2,
  Loader2,
  Nfc,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";

const searchSchema = z.object({
  tag: z.string().min(1),
  type: z.string().optional().default(""),
});

export const Route = createFileRoute("/pay")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Confirm Payment — Tap to Pay" },
      {
        name: "description",
        content: "Confirm the detected NFC tag and complete a contactless payment.",
      },
    ],
  }),
  component: PayPage,
});

type Phase = "review" | "processing" | "success" | "failed";

function PayPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-success/10 blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[oklch(0.5_0.2_270)]/10 blur-[140px]" />
      <div className="relative flex min-h-screen items-center justify-center px-4 py-8">
        <PhoneFrame>
          <PayScreen />
        </PhoneFrame>
      </div>
    </main>
  );
}

function PayScreen() {
  const { tag, type } = Route.useSearch();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("review");
  const [amount] = useState(12.5);
  const merchant = deriveMerchant(tag);

  const pay = () => {
    setPhase("processing");
    window.setTimeout(() => {
      const ok = Math.random() > 0.1;
      setPhase(ok ? "success" : "failed");
    }, 1600);
  };

  return (
    <div className="flex flex-col gap-5 px-5 pb-10 pt-2">
      <header className="flex items-center justify-between">
        <Link
          to="/scan"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface ring-1 ring-border"
        >
          <ChevronLeft className="h-4 w-4 text-foreground" strokeWidth={2} />
        </Link>
        <span className="text-[14px] font-semibold text-foreground">Confirm Payment</span>
        <div className="h-9 w-9" />
      </header>

      {/* Tag summary */}
      <section className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 ring-1 ring-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/15 ring-1 ring-success/30">
          <Nfc className="h-5 w-5 text-success" strokeWidth={1.8} />
        </div>
        <div className="flex flex-1 flex-col leading-tight">
          <span className="text-[13px] font-semibold text-foreground">Tag verified</span>
          <span className="font-mono text-[11px] text-muted-foreground">{tag}</span>
        </div>
        {type && (
          <span className="rounded-full bg-surface-elevated px-2 py-0.5 text-[10px] font-medium text-muted-foreground ring-1 ring-border">
            {type}
          </span>
        )}
      </section>

      {/* Merchant + amount */}
      <section className="flex flex-col items-center gap-2 rounded-[28px] bg-surface p-6 ring-1 ring-border">
        <span className="text-[12px] font-medium text-muted-foreground">Paying</span>
        <span className="text-[16px] font-semibold text-foreground">{merchant}</span>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-[44px] font-bold leading-none tracking-tight text-foreground">
            ${amount.toFixed(2)}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 rounded-full bg-surface-elevated px-3 py-1 text-[11px] text-muted-foreground ring-1 ring-border">
          <ShieldCheck className="h-3.5 w-3.5 text-success" strokeWidth={1.8} />
          Encrypted contactless
        </div>
      </section>

      {/* Phase view */}
      <PhaseView phase={phase} merchant={merchant} amount={amount} />

      {/* Actions */}
      {phase === "review" && (
        <button
          onClick={pay}
          className="flex h-14 w-full items-center justify-center rounded-full bg-foreground text-[15px] font-semibold text-background transition-transform active:scale-[0.99]"
        >
          Pay ${amount.toFixed(2)}
        </button>
      )}
      {phase === "processing" && (
        <button
          disabled
          className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-foreground/70 text-[15px] font-semibold text-background"
        >
          <Loader2 className="h-4 w-4 animate-spin" /> Processing…
        </button>
      )}
      {phase === "success" && (
        <button
          onClick={() => navigate({ to: "/" })}
          className="flex h-14 w-full items-center justify-center rounded-full bg-foreground text-[15px] font-semibold text-background"
        >
          Done
        </button>
      )}
      {phase === "failed" && (
        <div className="flex flex-col gap-2">
          <button
            onClick={pay}
            className="flex h-14 w-full items-center justify-center rounded-full bg-foreground text-[15px] font-semibold text-background"
          >
            Retry payment
          </button>
          <Link
            to="/scan"
            className="flex h-11 w-full items-center justify-center rounded-full bg-surface text-[13px] font-medium text-muted-foreground ring-1 ring-border"
          >
            Cancel
          </Link>
        </div>
      )}
    </div>
  );
}

function PhaseView({
  phase,
  merchant,
  amount,
}: {
  phase: Phase;
  merchant: string;
  amount: number;
}) {
  if (phase === "review") {
    return (
      <p className="px-2 text-center text-[12px] leading-relaxed text-muted-foreground">
        Review the merchant and amount, then confirm to charge your wallet.
      </p>
    );
  }
  if (phase === "processing") {
    return (
      <div className="flex items-center justify-center gap-2 text-[13px] text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Authorizing with {merchant}…
      </div>
    );
  }
  if (phase === "success") {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-success/10 px-4 py-3 ring-1 ring-success/30">
        <CheckCircle2 className="h-5 w-5 text-success" strokeWidth={1.8} />
        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-semibold text-foreground">Payment successful</span>
          <span className="text-[11px] text-muted-foreground">
            ${amount.toFixed(2)} sent to {merchant}
          </span>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-destructive/10 px-4 py-3 ring-1 ring-destructive/30">
      <AlertTriangle className="h-5 w-5 text-destructive" strokeWidth={1.8} />
      <div className="flex flex-col leading-tight">
        <span className="text-[13px] font-semibold text-foreground">Payment declined</span>
        <span className="text-[11px] text-muted-foreground">Try again or cancel.</span>
      </div>
    </div>
  );
}

function deriveMerchant(tag: string): string {
  const merchants = ["Blue Bottle Coffee", "Corner Bodega", "Metro Transit", "Joe's Pizza"];
  let h = 0;
  for (const c of tag) h = (h * 31 + c.charCodeAt(0)) | 0;
  return merchants[Math.abs(h) % merchants.length];
}
