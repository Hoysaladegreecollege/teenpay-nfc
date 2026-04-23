import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, Nfc, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";

type Status = "idle" | "scanning" | "detected" | "error";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Tap to Pay — NFC Scan" },
      {
        name: "description",
        content:
          "Tap an NFC sticker or another phone to pay instantly. See live tag detection and status messages.",
      },
      { property: "og:title", content: "Tap to Pay — NFC Scan" },
      {
        property: "og:description",
        content: "Hold your phone near an NFC tag to detect and pay.",
      },
    ],
  }),
  component: ScanPage,
});

function ScanPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-success/10 blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[oklch(0.5_0.2_270)]/10 blur-[140px]" />
      <div className="relative flex min-h-screen items-center justify-center px-4 py-8">
        <PhoneFrame>
          <ScanScreen />
        </PhoneFrame>
      </div>
    </main>
  );
}

function ScanScreen() {
  const [status, setStatus] = useState<Status>("idle");
  const [tagId, setTagId] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "scanning") return;
    const timer = setTimeout(() => {
      // Mock detection — real impl uses @capacitor-community/nfc
      const success = Math.random() > 0.2;
      if (success) {
        setTagId(
          "04:" +
            Array.from({ length: 6 }, () =>
              Math.floor(Math.random() * 256)
                .toString(16)
                .padStart(2, "0"),
            ).join(":"),
        );
        setStatus("detected");
      } else {
        setStatus("error");
      }
    }, 2200);
    return () => clearTimeout(timer);
  }, [status]);

  const startScan = () => {
    setTagId(null);
    setStatus("scanning");
  };

  return (
    <div className="flex flex-col gap-6 px-5 pb-10 pt-2">
      <header className="flex items-center justify-between">
        <Link
          to="/"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface ring-1 ring-border"
        >
          <ChevronLeft className="h-4 w-4 text-foreground" strokeWidth={2} />
        </Link>
        <span className="text-[14px] font-semibold text-foreground">Tap to Pay</span>
        <div className="h-9 w-9" />
      </header>

      {/* Visualizer */}
      <section className="relative flex h-[280px] items-center justify-center">
        {status === "scanning" && (
          <>
            <span className="absolute h-40 w-40 animate-ping rounded-full bg-success/20" />
            <span
              className="absolute h-56 w-56 animate-ping rounded-full bg-success/10"
              style={{ animationDelay: "300ms" }}
            />
          </>
        )}
        <div
          className={`relative flex h-32 w-32 items-center justify-center rounded-full ring-1 ring-border transition-colors ${
            status === "detected"
              ? "bg-success/15"
              : status === "error"
                ? "bg-destructive/15"
                : "bg-surface"
          }`}
        >
          {status === "detected" ? (
            <CheckCircle2 className="h-12 w-12 text-success" strokeWidth={1.6} />
          ) : status === "error" ? (
            <AlertTriangle className="h-12 w-12 text-destructive" strokeWidth={1.6} />
          ) : status === "scanning" ? (
            <Loader2 className="h-12 w-12 animate-spin text-foreground" strokeWidth={1.6} />
          ) : (
            <Nfc className="h-12 w-12 text-foreground" strokeWidth={1.6} />
          )}
        </div>
      </section>

      {/* Status text */}
      <section className="flex flex-col items-center gap-1.5 text-center">
        <h1 className="text-[22px] font-bold tracking-tight text-foreground">
          {status === "idle" && "Ready to scan"}
          {status === "scanning" && "Hold near tag…"}
          {status === "detected" && "Tag detected"}
          {status === "error" && "Couldn't read tag"}
        </h1>
        <p className="max-w-[280px] text-[13px] leading-relaxed text-muted-foreground">
          {status === "idle" &&
            "Hold the top of your phone close to an NFC sticker or another phone to pay."}
          {status === "scanning" && "Keep your device steady against the tag."}
          {status === "detected" && tagId && (
            <>
              ID <span className="font-mono text-foreground">{tagId}</span>
            </>
          )}
          {status === "error" && "Move your phone closer and try again."}
        </p>
      </section>

      {/* Steps */}
      <section className="flex flex-col gap-2">
        <Step n={1} title="Unlock your phone" desc="NFC only works when the screen is on." />
        <Step n={2} title="Tap the back near the tag" desc="The NFC chip sits near the camera." />
        <Step n={3} title="Hold still for a moment" desc="Wait for the confirmation chime." />
      </section>

      {/* Action */}
      <button
        onClick={startScan}
        disabled={status === "scanning"}
        className="flex h-14 w-full items-center justify-center rounded-full bg-foreground text-[15px] font-semibold text-background transition-transform active:scale-[0.99] disabled:opacity-60"
      >
        {status === "scanning"
          ? "Scanning…"
          : status === "detected"
            ? "Scan another"
            : status === "error"
              ? "Try again"
              : "Start scanning"}
      </button>
    </div>
  );
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-surface px-4 py-3 ring-1 ring-border">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-[12px] font-bold text-foreground ring-1 ring-border">
        {n}
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-[13px] font-semibold text-foreground">{title}</span>
        <span className="text-[11px] text-muted-foreground">{desc}</span>
      </div>
    </div>
  );
}
