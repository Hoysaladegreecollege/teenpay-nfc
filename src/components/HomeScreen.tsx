import {
  ChevronRight,
  Plus,
  Users,
  Receipt,
  Gift,
  Home,
  UsersRound,
  ArrowDownUp,
  Settings,
} from "lucide-react";

type Contact = { name: string; initial: string; badge?: number; tone: string };

const contacts: Contact[] = [
  { name: "Mom", initial: "M", badge: 1, tone: "bg-[#3a2e2a]" },
  { name: "Wife", initial: "W", badge: 2, tone: "bg-[#2e2a36]" },
  { name: "Brother", initial: "B", tone: "bg-[#2a3330]" },
  { name: "Sis", initial: "S", tone: "bg-[#332a2e]" },
];

type Tx = { title: string; date: string; amount: string };
const txs: Tx[] = [
  { title: "Transfer to Wife", date: "12 Mar 2024", amount: "-2,000 ৳" },
  { title: "Electricity bill", date: "10 Mar 2024", amount: "-540 ৳" },
];

export function HomeScreen() {
  return (
    <div className="flex flex-col gap-5 px-5 pb-32 pt-2">
      {/* Header */}
      <header className="flex items-center justify-between">
        <button className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-elevated text-[12px] font-semibold text-foreground ring-1 ring-border">
            R
          </div>
          <span className="text-[14px] font-medium text-foreground">Rajeev</span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2.2} />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-surface ring-1 ring-border">
          <Gift className="h-4 w-4 text-foreground" strokeWidth={1.8} />
        </button>
      </header>

      {/* Balance + Send card */}
      <section className="relative overflow-hidden rounded-[28px] bg-surface p-5 ring-1 ring-border">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-[12px] font-medium text-muted-foreground">Balance</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-[32px] font-bold leading-none tracking-tight text-foreground">
                2,500
              </span>
              <span className="text-[18px] font-semibold text-muted-foreground">৳</span>
            </div>
          </div>
          <button className="flex items-center gap-1.5 rounded-full bg-surface-elevated px-3.5 py-2 text-[12px] font-medium text-foreground ring-1 ring-border transition-colors hover:bg-surface-muted">
            <Plus className="h-3.5 w-3.5" strokeWidth={2.2} />
            Add funds
          </button>
        </div>

        <button
          className="group relative mt-5 flex h-14 w-full items-center justify-center overflow-hidden rounded-full text-[15px] font-semibold text-[#1a1410] shadow-[0_10px_30px_-12px_oklch(0.78_0.12_290_/_0.7)] transition-transform active:scale-[0.99]"
          style={{ background: "var(--gradient-send)" }}
        >
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/25 to-transparent" />
          Send money
        </button>
      </section>

      {/* Two action cards */}
      <section className="grid grid-cols-2 gap-3">
        <ActionCard icon={<Users className="h-4 w-4" strokeWidth={1.8} />} label="Family vault" />
        <ActionCard icon={<Receipt className="h-4 w-4" strokeWidth={1.8} />} label="Pay bills" />
      </section>

      {/* Quick Send */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-foreground">Quick Send</h2>
          <button className="flex items-center gap-0.5 text-[12px] font-medium text-muted-foreground hover:text-foreground">
            Manage <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2.5">
          {contacts.map((c) => (
            <ContactTile key={c.name} contact={c} />
          ))}
        </div>
      </section>

      {/* Recent transactions */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-foreground">Recent transactions</h2>
          <button className="flex items-center gap-0.5 text-[12px] font-medium text-muted-foreground hover:text-foreground">
            See all <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {txs.map((t) => (
            <TxRow key={t.title} tx={t} />
          ))}
        </div>
      </section>

      <BottomNav />
    </div>
  );
}

function ActionCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex h-14 items-center gap-2.5 rounded-2xl bg-surface px-4 ring-1 ring-border transition-colors hover:bg-surface-elevated">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-elevated text-foreground ring-1 ring-border">
        {icon}
      </span>
      <span className="text-[13px] font-medium text-foreground">{label}</span>
    </button>
  );
}

function ContactTile({ contact }: { contact: Contact }) {
  return (
    <button className="group flex flex-col items-center gap-1.5">
      <div className="relative h-[68px] w-full overflow-hidden rounded-2xl ring-1 ring-border">
        <div className={`flex h-full w-full items-center justify-center ${contact.tone}`}>
          <span className="text-[20px] font-semibold text-foreground/80">{contact.initial}</span>
        </div>
        {contact.badge !== undefined && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[9px] font-bold text-background">
            {contact.badge}
          </span>
        )}
      </div>
      <span className="text-[11px] font-medium text-muted-foreground">{contact.name}</span>
    </button>
  );
}

function TxRow({ tx }: { tx: Tx }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-surface px-4 py-3 ring-1 ring-border">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-elevated ring-1 ring-border">
          <ArrowDownUp className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-semibold text-foreground">{tx.title}</span>
          <span className="text-[11px] text-muted-foreground">{tx.date}</span>
        </div>
      </div>
      <span className="text-[13px] font-semibold text-foreground">{tx.amount}</span>
    </div>
  );
}

function BottomNav() {
  const items = [
    { icon: Home, active: true },
    { icon: UsersRound },
    { icon: ArrowDownUp },
    { icon: Settings },
  ];
  return (
    <nav className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-full bg-[oklch(0.18_0.005_270)/0.92] px-2 py-2 ring-1 ring-border backdrop-blur-xl shadow-[var(--shadow-pill)]">
        {items.map(({ icon: Icon }, i) => (
          <button
            key={i}
            className={`flex h-11 w-11 items-center justify-center rounded-full transition-all ${
              i === 0
                ? "bg-foreground text-background shadow-[0_0_0_4px_oklch(0.18_0.005_270)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </button>
        ))}
      </div>
    </nav>
  );
}
