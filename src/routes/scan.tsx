import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  Nfc,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  WifiOff,
  ShieldOff,
  SmartphoneNfc,
} from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import {
  getNfcSupport,
  requestNfcPermission,
  startNfcScan,
  type NfcSupport,
  type NfcTag,
  type ScanHandle,
} from "@/lib/nfc";

type Status =
  | { kind: "checking" }
  | { kind: "blocked"; support: Exclude<NfcSupport, { state: "supported" }> }
  | { kind: "idle" }
  | { kind: "scanning"; elapsed: number }
  | { kind: "detected"; tag: NfcTag }
  | { kind: "error"; message: string };

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Tap to Pay — NFC Scan" },
      {
        name: "description",
        content:
          "Tap an NFC sticker or another phone to pay instantly. Live tag detection with permission handling.",
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
  const [status, setStatus] = useState<Status>({ kind: "checking" });
  const handleRef = useRef<ScanHandle | null>(null);
  const tickRef = useRef<number | null>(null);
  const navigate = useNavigate();

  const checkSupport = useCallback(async () => {
    setStatus({ kind: "checking" });
    const support = await getNfcSupport();
    if (support.state === "supported") setStatus({ kind: "idle" });
    else setStatus({ kind: "blocked", support });
  }, []);

  useEffect(() => {
    checkSupport();
    return () => {
      handleRef.current?.stop();
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, [checkSupport]);

  const stopTicker = () => {
    if (tickRef.current) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
  };

  const startScan = useCallback(async () => {
    await handleRef.current?.stop();
    setStatus({ kind: "scanning", elapsed: 0 });
    stopTicker();
    const startedAt = Date.now();
    tickRef.current = window.setInterval(() => {
      setStatus((s) =>
        s.kind === "scanning" ? { kind: "scanning", elapsed: Date.now() - startedAt } : s,
      );
    }, 100);

    handleRef.current = await startNfcScan(
      (tag) => {
        stopTicker();
        setStatus({ kind: "detected", tag });
      },
      (message) => {
        stopTicker();
        setStatus({ kind: "error", message });
      },
    );
  }, []);

  const cancelScan = useCallback(async () => {
    await handleRef.current?.stop();
    stopTicker();
    setStatus({ kind: "idle" });
  }, []);

  const requestPermission = useCallback(async () => {
    const ok = await requestNfcPermission();
    if (ok) checkSupport();
    else setStatus({ kind: "blocked", support: { state: "denied" } });
  }, [checkSupport]);

  const proceedToPay = (tag: NfcTag) => {
    navigate({ to: "/pay", search: { tag: tag.id, type: tag.type ?? "" } });
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

      <Visualizer status={status} />
      <StatusText status={status} />

      {status.kind === "blocked" ? (
        <BlockedHelp support={status.support} onRetry={checkSupport} onAllow={requestPermission} />
      ) : (
        <Steps />
      )}

      <Actions
        status={status}
        onStart={startScan}
        onCancel={cancelScan}
        onProceed={proceedToPay}
        onRetry={startScan}
      />
    </div>
  );
}

function Visualizer({ status }: { status: Status }) {
  const scanning = status.kind === "scanning";
  const detected = status.kind === "detected";
  const error = status.kind === "error";

  return (
    <section className="relative flex h-[260px] items-center justify-center">
      {scanning && (
        <>
          <span className="absolute h-40 w-40 animate-ping rounded-full bg-success/20" />
          <span
            className="absolute h-56 w-56 animate-ping rounded-full bg-success/10"
            style={{ animationDelay: "300ms" }}
          />
          <span
            className="absolute h-64 w-64 animate-pulse rounded-full ring-1 ring-success/20"
            style={{ animationDuration: "1.6s" }}
          />
        </>
      )}
      <div
        className={`relative flex h-32 w-32 items-center justify-center rounded-full ring-1 ring-border transition-colors duration-300 ${
          detected
            ? "bg-success/15 ring-success/40"
            : error
              ? "bg-destructive/15 ring-destructive/40"
              : "bg-surface"
        }`}
      >
        {detected ? (
          <CheckCircle2 className="h-12 w-12 text-success" strokeWidth={1.6} />
        ) : error ? (
          <AlertTriangle className="h-12 w-12 text-destructive" strokeWidth={1.6} />
        ) : scanning ? (
          <Loader2 className="h-12 w-12 animate-spin text-foreground" strokeWidth={1.6} />
        ) : (
          <Nfc className="h-12 w-12 text-foreground" strokeWidth={1.6} />
        )}
      </div>
    </section>
  );
}

function StatusText({ status }: { status: Status }) {
  let title = "Ready to scan";
  let body: React.ReactNode =
    "Hold the top of your phone close to an NFC sticker or another phone to pay.";

  switch (status.kind) {
    case "checking":
      title = "Checking NFC…";
      body = "Verifying device support and permissions.";
      break;
    case "blocked":
      title = blockedTitle(status.support);
      body = blockedBody(status.support);
      break;
    case "scanning": {
      const seconds = (status.elapsed / 1000).toFixed(1);
      title = "Hold near tag…";
      body = (
        <>
          Listening for NFC. <span className="font-mono text-foreground">{seconds}s</span>
        </>
      );
      break;
    }
    case "detected":
      title = "Tag detected";
      body = (
        <>
          ID <span className="font-mono text-foreground">{status.tag.id}</span>
          {status.tag.type && <span className="text-muted-foreground"> · {status.tag.type}</span>}
        </>
      );
      break;
    case "error":
      title = "Couldn't read tag";
      body = status.message;
      break;
  }

  return (
    <section className="flex flex-col items-center gap-1.5 text-center">
      <h1 className="text-[22px] font-bold tracking-tight text-foreground">{title}</h1>
      <p className="max-w-[280px] text-[13px] leading-relaxed text-muted-foreground">{body}</p>
    </section>
  );
}

function blockedTitle(s: Exclude<NfcSupport, { state: "supported" }>) {
  if (s.state === "disabled") return "NFC is turned off";
  if (s.state === "denied") return "Permission needed";
  if (s.state === "unsupported" && s.reason === "no-hardware") return "No NFC hardware";
  if (s.state === "unsupported" && s.reason === "web") return "Preview mode";
  return "NFC unavailable";
}
function blockedBody(s: Exclude<NfcSupport, { state: "supported" }>) {
  if (s.state === "disabled") return "Enable NFC in your device settings, then tap Retry.";
  if (s.state === "denied") return "Allow NFC access for this app to scan tags.";
  if (s.state === "unsupported" && s.reason === "no-hardware")
    return "This device doesn't have an NFC reader.";
  if (s.state === "unsupported" && s.reason === "web")
    return "Real NFC requires the native app. We'll simulate a tag for you.";
  return "Install the Capacitor NFC plugin to enable scanning.";
}

function BlockedHelp({
  support,
  onRetry,
  onAllow,
}: {
  support: Exclude<NfcSupport, { state: "supported" }>;
  onRetry: () => void;
  onAllow: () => void;
}) {
  const Icon =
    support.state === "denied"
      ? ShieldOff
      : support.state === "disabled"
        ? WifiOff
        : SmartphoneNfc;
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-surface px-4 py-3 ring-1 ring-border">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-elevated ring-1 ring-border">
        <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <span className="text-[12px] leading-relaxed text-muted-foreground">
          {support.state === "denied"
            ? "Tap Allow to grant NFC permission."
            : support.state === "disabled"
              ? "Open Settings → Connections → NFC."
              : support.state === "unsupported" && support.reason === "web"
                ? "You can still try a simulated scan below."
                : "NFC isn't available on this device."}
        </span>
        <div className="flex gap-2">
          {support.state === "denied" && (
            <button
              onClick={onAllow}
              className="rounded-full bg-foreground px-3 py-1.5 text-[12px] font-semibold text-background"
            >
              Allow
            </button>
          )}
          <button
            onClick={onRetry}
            className="rounded-full bg-surface-elevated px-3 py-1.5 text-[12px] font-semibold text-foreground ring-1 ring-border"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}

function Steps() {
  return (
    <section className="flex flex-col gap-2">
      <Step n={1} title="Unlock your phone" desc="NFC only works when the screen is on." />
      <Step n={2} title="Tap the back near the tag" desc="The NFC chip sits near the camera." />
      <Step n={3} title="Hold still for a moment" desc="Wait for the confirmation chime." />
    </section>
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

function Actions({
  status,
  onStart,
  onCancel,
  onProceed,
  onRetry,
}: {
  status: Status;
  onStart: () => void;
  onCancel: () => void;
  onProceed: (tag: NfcTag) => void;
  onRetry: () => void;
}) {
  if (status.kind === "checking" || status.kind === "blocked") {
    if (status.kind === "blocked" && status.support.state === "unsupported" && status.support.reason === "web") {
      return (
        <button
          onClick={onStart}
          className="flex h-14 w-full items-center justify-center rounded-full bg-foreground text-[15px] font-semibold text-background transition-transform active:scale-[0.99]"
        >
          Simulate scan
        </button>
      );
    }
    return null;
  }

  if (status.kind === "scanning") {
    return (
      <button
        onClick={onCancel}
        className="flex h-14 w-full items-center justify-center rounded-full bg-surface text-[15px] font-semibold text-foreground ring-1 ring-border"
      >
        Cancel
      </button>
    );
  }

  if (status.kind === "detected") {
    return (
      <div className="flex flex-col gap-2">
        <button
          onClick={() => onProceed(status.tag)}
          className="flex h-14 w-full items-center justify-center rounded-full bg-foreground text-[15px] font-semibold text-background transition-transform active:scale-[0.99]"
        >
          Continue to pay
        </button>
        <button
          onClick={onRetry}
          className="flex h-11 w-full items-center justify-center rounded-full bg-surface text-[13px] font-medium text-muted-foreground ring-1 ring-border"
        >
          Scan another
        </button>
      </div>
    );
  }

  if (status.kind === "error") {
    return (
      <button
        onClick={onRetry}
        className="flex h-14 w-full items-center justify-center rounded-full bg-foreground text-[15px] font-semibold text-background transition-transform active:scale-[0.99]"
      >
        Try again
      </button>
    );
  }

  return (
    <button
      onClick={onStart}
      className="flex h-14 w-full items-center justify-center rounded-full bg-foreground text-[15px] font-semibold text-background transition-transform active:scale-[0.99]"
    >
      Start scanning
    </button>
  );
}
