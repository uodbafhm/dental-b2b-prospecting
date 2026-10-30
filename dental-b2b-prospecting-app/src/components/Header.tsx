import { Database, Flame, Gauge } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface HeaderProps {
  total: number;
  hot: number;
  avgScore: number;
}

function Stat({ icon: Icon, label, value, accent }: { icon: LucideIcon; label: string; value: string; accent: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3.5 py-2">
      <Icon size={15} strokeWidth={2.2} className={accent} />
      <div className="leading-none">
        <div className="font-display text-[13px] font-black text-white">{value}</div>
        <div className="mt-1 text-[10px] font-medium text-zinc-500">{label}</div>
      </div>
    </div>
  );
}

export function Header({ total, hot, avgScore }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#06090d]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-300 to-emerald-400 shadow-[0_0_28px_-6px_rgba(45,212,191,0.6)]">
            <svg viewBox="0 0 24 24" className="size-5 text-[#05251f]" fill="currentColor">
              <path d="M12 2.6c-2 0-2.9 1-4.3 1S5 2.7 4.1 4.2c-1.2 2-0.6 4.7.2 6.9.9 2.4 1 5 1.6 7.6.3 1.4.8 3 2 3 1.6 0 1.3-2.8 1.9-4.4.3-.9.9-1.5 2.2-1.5s1.9.6 2.2 1.5c.6 1.6.3 4.4 1.9 4.4 1.2 0 1.7-1.6 2-3 .6-2.6.7-5.2 1.6-7.6.8-2.2 1.4-4.9.2-6.9-.9-1.5-2.1-.6-3.6-.6S14 2.6 12 2.6z" />
            </svg>
          </div>
          <div className="leading-none">
            <div className="font-display text-[17px] font-black tracking-tight text-white">
              Dent<span className="text-teal-300">Scope</span>
            </div>
            <div className="mt-1 text-[10px] font-medium text-zinc-500">
              تنقيب B2B · عيادات الأسنان
            </div>
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Stat icon={Database} label="الكابينيات" value={String(total)} accent="text-zinc-300" />
          <Stat icon={Flame} label="أولوية سخونة" value={String(hot)} accent="text-orange-300" />
          <Stat icon={Gauge} label="معدل السكور" value={total ? `${avgScore}/100` : "—"} accent="text-teal-300" />
        </div>
      </div>
    </header>
  );
}
