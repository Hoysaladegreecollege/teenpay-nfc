import { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[400px]">
      <div className="relative overflow-hidden rounded-[44px] border border-border bg-background shadow-[var(--shadow-elevated)]">
        {/* Status bar */}
        <div className="flex items-center justify-between px-7 pt-4 pb-2 text-[13px] font-semibold text-foreground">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <SignalIcon />
            <WifiIcon />
            <BatteryIcon />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

function SignalIcon() {
  return (
    <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
      <rect x="0" y="7" width="3" height="4" rx="0.5" fill="currentColor" />
      <rect x="4.5" y="5" width="3" height="6" rx="0.5" fill="currentColor" />
      <rect x="9" y="2.5" width="3" height="8.5" rx="0.5" fill="currentColor" />
      <rect x="13.5" y="0" width="3" height="11" rx="0.5" fill="currentColor" />
    </svg>
  );
}
function WifiIcon() {
  return (
    <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
      <path
        d="M8 10.5a1 1 0 100-2 1 1 0 000 2zM4.2 6.6a5.5 5.5 0 017.6 0M1.6 4a9 9 0 0112.8 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
function BatteryIcon() {
  return (
    <div className="ml-1 flex items-center gap-0.5 rounded-[5px] bg-foreground px-1.5 py-0.5 text-[10px] font-bold text-background">
      70
    </div>
  );
}
