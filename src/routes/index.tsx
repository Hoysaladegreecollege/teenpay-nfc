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

      <div className="relative flex min-h-screen items-center justify-center px-4 py-8">
        <PhoneFrame>
          <HomeScreen />
        </PhoneFrame>
      </div>
    </main>
  );
}
