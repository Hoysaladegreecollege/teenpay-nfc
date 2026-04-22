import { createFileRoute } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";
import { HomeScreen } from "@/components/HomeScreen";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Pocket — Premium Payments for Teens" },
      {
        name: "description",
        content:
          "A premium, parent-approved payment app built for teens. Send, request, scan and top up — all in one beautifully crafted wallet.",
      },
    ],
  }),
});

function Index() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-success/10 blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[oklch(0.5_0.2_270)]/10 blur-[140px]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-10 px-5 py-14 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        {/* Left: copy */}
        <section className="max-w-md text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground ring-1 ring-border">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Built for teens · Parent approved
          </span>
          <h1 className="mt-5 text-[40px] font-bold leading-[1.05] tracking-tight text-foreground sm:text-[52px]">
            Money,
            <br />
            <span className="text-muted-foreground">made effortless.</span>
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
            A premium wallet for the next generation. Send, request and tap to pay —
            with safety rails parents trust and an interface teens love.
          </p>
          <div className="mt-7 flex items-center justify-center gap-3 lg:justify-start">
            <button className="rounded-full bg-foreground px-5 py-3 text-[13px] font-semibold text-background transition-transform hover:scale-[1.02]">
              Get the app
            </button>
            <button className="rounded-full bg-surface px-5 py-3 text-[13px] font-semibold text-foreground ring-1 ring-border transition-colors hover:bg-surface-elevated">
              How it works
            </button>
          </div>
        </section>

        {/* Right: phone */}
        <div className="relative">
          <PhoneFrame>
            <HomeScreen />
          </PhoneFrame>
        </div>
      </div>
    </main>
  );
}
