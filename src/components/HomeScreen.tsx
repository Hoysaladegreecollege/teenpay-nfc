import { Bell, ArrowUpRight, ArrowDownLeft, ScanLine, Wallet, Home, History, QrCode, User } from "lucide-react";

type Tx = {
  icon: string;
  bg: string;
  title: string;
  meta: string;
  amount: string;
  positive?: boolean;
};

const transactions: Tx[] = [
  { icon: "☕", bg: "bg-[#3a2e26]", title: "Starbucks Coffee", meta: "Today, 10:23 AM", amount: "-$4.50" },
  { icon: "🚗", bg: "bg-[#3a2624]", title: "Uber Ride", meta: "Yesterday, 6:45 PM", amount: "-$12.20" },
  { icon: "💰", bg: "bg-[#2a3326]", title: "Payment Received", meta: "Yesterday, 2:30 PM", amount: "+$250.00", positive: true },
  { icon: "🛒", bg: "bg-[#2d2a36]", title: "Whole Foods", meta: "Oct 24, 5:12 PM", amount: "-$85.40" },
];

export function HomeScreen() {
  return (
    <div className="flex flex-col gap-5 px-5 pb-28 pt-3">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-full bg-surface-elevated ring-1 ring-border">
            <div className="flex h-full w-full items-center justify-center text-base font-semibold text-foreground">
              AJ
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] font-medium tracking-wide text-muted-foreground">
              Welcome back,
            </span>
            <span className="text-[15px] font-semibold text-foreground">Alex Johnson</span>
          </div>
        </div>
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-surface ring-1 ring-border transition-colors hover:bg-surface-elevated">
          <Bell className="h-[18px] w-[18px] text-foreground" strokeWidth={1.8} />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-destructive" />
        </button>
      </header>

      {/* Balance Card */}
      <section
        className="relative overflow-hidden rounded-[28px] p-6 shadow-[var(--shadow-soft)] ring-1 ring-border"
        style={{ background: "var(--gradient-balance)" }}
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-success/5 blur-3xl" />
        <div className="flex items-start justify-between">
          <span className="text-[12px] font-medium tracking-wide text-muted-foreground">
            Total Balance
          </span>
          <span className="rounded-full bg-success px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-success-foreground">
            LIVE
          </span>
        </div>
        <div className="mt-2 flex items-baseline">
          <span className="text-[44px] font-bold leading-none tracking-tight text-foreground">
            $12,450
          </span>
          <span className="text-[20px] font-semibold text-muted-foreground">.00</span>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-9 items-center justify-center rounded-md bg-muted-foreground/40">
              <div className="h-3 w-5 rounded-sm bg-foreground/30" />
            </div>
            <span className="text-[14px] font-medium tracking-[0.3em] text-muted-foreground">
              ···· 4582
            </span>
          </div>
          <div className="h-3 w-3 rounded-full ring-2 ring-muted-foreground/40" />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-4 gap-3">
        <QuickAction icon={<ArrowUpRight strokeWidth={1.8} className="h-5 w-5" />} label="Send" />
        <QuickAction icon={<ArrowDownLeft strokeWidth={1.8} className="h-5 w-5" />} label="Request" />
        <QuickAction icon={<ScanLine strokeWidth={1.8} className="h-5 w-5" />} label="Scan" />
        <QuickAction icon={<Wallet strokeWidth={1.8} className="h-5 w-5" />} label="Top Up" />
      </section>

      {/* Recent Activity */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[16px] font-semibold text-foreground">Recent Activity</h2>
          <button className="text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground">
            View All
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {transactions.map((t) => (
            <TransactionRow key={t.title} tx={t} />
          ))}
        </div>
      </section>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
}

function QuickAction({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="group flex flex-col items-center gap-2">
      <div className="flex h-[58px] w-full items-center justify-center rounded-2xl bg-surface ring-1 ring-border transition-all group-hover:bg-surface-elevated group-active:scale-95">
        <span className="text-foreground">{icon}</span>
      </div>
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
    </button>
  );
}

function TransactionRow({ tx }: { tx: Tx }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-surface px-3.5 py-3 ring-1 ring-border transition-colors hover:bg-surface-elevated">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full text-base ${tx.bg}`}>
          {tx.icon}
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[14px] font-semibold text-foreground">{tx.title}</span>
          <span className="text-[11px] text-muted-foreground">{tx.meta}</span>
        </div>
      </div>
      <span
        className={`text-[14px] font-semibold ${
          tx.positive ? "text-success" : "text-foreground"
        }`}
      >
        {tx.amount}
      </span>
    </div>
  );
}

function BottomNav() {
  const items = [
    { icon: Home, label: "Home", active: true },
    { icon: History, label: "Activity" },
    { icon: QrCode, label: "Scan" },
    { icon: Wallet, label: "Wallet" },
    { icon: User, label: "Profile" },
  ];
  return (
    <nav className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-full bg-surface-elevated/95 px-2 py-2 ring-1 ring-border backdrop-blur-xl shadow-[var(--shadow-pill)]">
        {items.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            className={`flex items-center gap-2 rounded-full px-3.5 py-2.5 transition-all ${
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
            {active && <span className="text-[12px] font-semibold">{label}</span>}
          </button>
        ))}
      </div>
    </nav>
  );
}
