import type { LucideIcon } from "lucide-react";

type Tone = "pos" | "neg" | "warn";

export interface SegOption<T extends string> {
  value: T;
  label: string;
  icon: LucideIcon;
  tone: Tone;
}

const TONE: Record<Tone, { active: string; icon: string }> = {
  pos: {
    active: "border-teal-400/60 bg-teal-400/10 text-teal-100 shadow-[0_0_24px_-6px_rgba(45,212,191,0.55)]",
    icon: "text-teal-300",
  },
  neg: {
    active: "border-rose-400/50 bg-rose-400/10 text-rose-100 shadow-[0_0_24px_-6px_rgba(251,113,133,0.5)]",
    icon: "text-rose-300",
  },
  warn: {
    active: "border-amber-400/50 bg-amber-400/10 text-amber-100 shadow-[0_0_24px_-6px_rgba(251,191,36,0.5)]",
    icon: "text-amber-300",
  },
};

interface SegmentedProps<T extends string> {
  value: T | null;
  options: SegOption<T>[];
  onChange: (v: T) => void;
}

export function Segmented<T extends string>({ value, options, onChange }: SegmentedProps<T>) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup">
      {options.map((opt) => {
        const active = value === opt.value;
        const Icon = opt.icon;
        const t = TONE[opt.tone];
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={[
              "group flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] font-medium transition-all duration-200 active:scale-[0.97]",
              active
                ? t.active
                : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:bg-white/[0.06] hover:text-zinc-200",
            ].join(" ")}
          >
            <Icon
              size={15}
              strokeWidth={2.4}
              className={active ? t.icon : "text-zinc-600 transition-colors group-hover:text-zinc-400"}
            />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
