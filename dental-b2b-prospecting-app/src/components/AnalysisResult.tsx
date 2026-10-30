import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpLeft,
  AtSign,
  BadgeCheck,
  CalendarDays,
  Check,
  Clapperboard,
  Copy,
  Flame,
  Gauge,
  Globe,
  Images,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  Radar,
  Star,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { fmtDate, fmtTime, priorityHint, priorityLabel, waLink, waNumber } from "../lib/analyze";
import type { GapIcon, Lead, Priority } from "../lib/types";

/* ------------------------------------------------------------------ */

const GAP_ICONS: Record<GapIcon, LucideIcon> = {
  globe: Globe,
  instagram: AtSign,
  image: Images,
  video: Clapperboard,
  star: Star,
};

const PRIO: Record<Priority, { badge: string; icon: LucideIcon; ring: string }> = {
  hot: { badge: "border-orange-400/40 bg-orange-400/10 text-orange-300", icon: Flame, ring: "#fb923c" },
  warm: { badge: "border-sky-400/40 bg-sky-400/10 text-sky-300", icon: Gauge, ring: "#38bdf8" },
  cool: { badge: "border-teal-400/40 bg-teal-400/10 text-teal-300", icon: BadgeCheck, ring: "#2dd4bf" },
};

const ANALYZE_STEPS = [
  "كنقرو الفيشة ديال Google Business",
  "كنحللو الريزو والمحتوى ديال الكابيني",
  "كنكتبو بيتش البيع الجاهز",
];

function gapsChipLabel(n: number): string {
  if (n === 0) return "والو";
  if (n === 1) return "نقصة وحدة";
  return `${n} نواقص`;
}

/* ------------------------------------------------------------------ */

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-[128px] shrink-0">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="9" />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * score) / 100 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-[30px] font-black leading-none text-white">{score}</span>
        <span className="mt-1.5 text-[10px] font-semibold text-zinc-500">رقمي / 100</span>
      </div>
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [ok, setOk] = useState(false);
  const run = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setOk(true);
    window.setTimeout(() => setOk(false), 1600);
  };
  return (
    <button
      type="button"
      onClick={run}
      className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11.5px] font-bold transition-all active:scale-[0.96] ${
        ok
          ? "border-teal-400/50 bg-teal-400/10 text-teal-300"
          : "border-white/10 bg-white/[0.04] text-zinc-300 hover:border-white/25 hover:text-white"
      }`}
    >
      {ok ? <Check size={13} /> : <Copy size={13} />}
      {ok ? "تنسخ!" : label}
    </button>
  );
}

function PitchCard({
  icon: Icon,
  title,
  sub,
  text,
  accent,
  action,
}: {
  icon: LucideIcon;
  title: string;
  sub: string;
  text: string;
  accent: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0f14]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className={`flex size-8 items-center justify-center rounded-lg border ${accent}`}>
            <Icon size={15} />
          </span>
          <div>
            <div className="font-display text-[13.5px] font-black text-white">{title}</div>
            <div className="text-[11px] text-zinc-500">{sub}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {action}
          <CopyButton text={text} label="نسخ" />
        </div>
      </div>
      <pre className="max-h-[320px] overflow-y-auto whitespace-pre-wrap px-5 py-4 font-body text-[13.5px] leading-[1.85] text-zinc-300">
        {text}
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------ */

interface AnalysisResultProps {
  lead: Lead | null;
  analyzing: boolean;
}

export function AnalysisResult({ lead, analyzing }: AnalysisResultProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-[11.5px] font-semibold text-zinc-500">النواقص والخطاب البيعي</div>
        <h2 className="mt-1 font-display text-xl font-black text-white">تقرير التحليل</h2>
      </div>

      <AnimatePresence mode="wait">
        {analyzing ? (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-teal-400/20 bg-teal-400/[0.03] p-8 text-center"
          >
            <div className="flex size-14 items-center justify-center rounded-2xl border border-teal-400/30 bg-teal-400/10">
              <Loader2 size={24} className="animate-spin text-teal-300" />
            </div>
            <h3 className="mt-5 font-display text-[17px] font-black text-white">التحليل جاري…</h3>
            <ul className="mt-4 space-y-2.5">
              {ANALYZE_STEPS.map((s, i) => (
                <motion.li
                  key={s}
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.3 }}
                  className="flex items-center gap-2.5 text-[12.5px] text-zinc-400"
                >
                  <span className="size-1 rounded-full bg-teal-400" />
                  {s}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ) : !lead ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.015] p-8 text-center"
          >
            <div className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <Radar size={24} className="text-zinc-500" />
            </div>
            <h3 className="mt-5 font-display text-[17px] font-black text-white">مازال ما كاين حتى تحليل</h3>
            <p className="mt-2 max-w-[320px] text-[12.5px] leading-relaxed text-zinc-500">
              جاوب على 6 ديال الأسئلة ودير التحليل: النواقص ديال الكابيني والبيتش الجاهز غادي يبانو هنا.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            {/* الخلاصة */}
            <div className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-6">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="min-w-0">
                  <h3 className="font-display text-[20px] font-black leading-tight text-white">{lead.cabinet}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {lead.phone && (
                      <a
                        href={`tel:${lead.phone.replace(/\s/g, "")}`}
                        title="اتصل بالكابيني"
                        className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[11.5px] font-medium text-zinc-300 transition-colors hover:border-teal-400/40 hover:text-teal-300"
                      >
                        <Phone size={12} />
                        <span dir="ltr">{lead.phone}</span>
                      </a>
                    )}
                    {waNumber(lead) && (
                      <a
                        href={waLink(waNumber(lead), "")}
                        target="_blank"
                        rel="noreferrer"
                        title="حل المحادثة فواتساب"
                        className="flex items-center gap-1.5 rounded-lg border border-emerald-400/25 bg-emerald-400/[0.07] px-2.5 py-1.5 text-[11.5px] font-medium text-emerald-300 transition-colors hover:bg-emerald-400/15"
                      >
                        <MessageCircle size={12} />
                        <span dir="ltr">{waNumber(lead)}</span>
                      </a>
                    )}
                    {lead.ville && (
                      <span className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[11.5px] font-medium text-zinc-300">
                        <MapPin size={12} /> {lead.ville}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[11.5px] font-medium text-zinc-400">
                      <CalendarDays size={12} />
                      {fmtDate(lead.createdAt)} · {fmtTime(lead.createdAt)}
                    </span>
                  </div>
                  <div className="mt-5">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-display text-[12.5px] font-black ${PRIO[lead.priority].badge}`}
                    >
                      {(() => {
                        const Icon = PRIO[lead.priority].icon;
                        return <Icon size={14} />;
                      })()}
                      {priorityLabel(lead.priority)}
                    </span>
                    <p className="mt-2 text-[11.5px] text-zinc-500">{priorityHint(lead.priority)}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ScoreRing score={lead.score} color={PRIO[lead.priority].ring} />
                </div>
              </div>
            </div>

            {/* النواقص */}
            <div className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="font-display text-[14px] font-black text-white">النواقص اللي لقينا</h4>
                <span
                  className={`rounded-full border px-2.5 py-1 font-display text-[11px] font-black ${
                    lead.gaps.length
                      ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
                      : "border-teal-400/30 bg-teal-400/10 text-teal-300"
                  }`}
                >
                  {gapsChipLabel(lead.gaps.length)}
                </span>
              </div>

              {lead.gaps.length === 0 ? (
                <div className="rounded-2xl border border-teal-400/20 bg-teal-400/[0.05] p-4 text-[12.5px] leading-relaxed text-teal-100/80">
                  هاد الكابيني ديجا داري كلشي مزيان أونلاين. ما تبيعوش التصليح: بيع ليه النمو — كامباني ديال الـ
                  Pub مستهدفة، براندينغ بريميوم، ومحتوى تعليمي على نطاق واسع.
                </div>
              ) : (
                <ul className="space-y-3">
                  {lead.gaps.map((g, i) => {
                    const Icon = GAP_ICONS[g.icon];
                    return (
                      <motion.li
                        key={g.id}
                        initial={{ opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.08, duration: 0.35 }}
                        className="rounded-2xl border border-white/[0.06] bg-[#0a0f14] p-4"
                      >
                        <div className="flex gap-3.5">
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-amber-400/25 bg-amber-400/[0.08] text-amber-300">
                            <Icon size={17} />
                          </span>
                          <div className="min-w-0">
                            <div className="font-display text-[13.5px] font-black text-white">{g.title}</div>
                            <p className="mt-1 text-[12px] leading-relaxed text-zinc-400">{g.detail}</p>
                            <p className="mt-2.5 flex items-start gap-2 text-[12px] leading-relaxed text-teal-200/90">
                              <Tag size={13} className="mt-1 shrink-0 text-teal-400" />
                              <span>
                                <span className="font-black text-teal-300">تبيع ليه: </span>
                                {g.offer}
                              </span>
                            </p>
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* البيتشات */}
            <PitchCard
              icon={MessageCircle}
              title="بيتش الواتساب"
              sub="مساج قصير، جاهز تسيفطو كيما هو."
              text={lead.pitchWa}
              accent="border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
              action={
                waNumber(lead) ? (
                  <a
                    href={waLink(waNumber(lead), lead.pitchWa)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-3 py-1.5 text-[11.5px] font-bold text-emerald-300 transition-all hover:bg-emerald-400/20 active:scale-[0.96]"
                  >
                    <ArrowUpLeft size={13} />
                    حل الواتساب
                  </a>
                ) : undefined
              }
            />
            <PitchCard
              icon={Phone}
              title="سكريبت المكالمة"
              sub="التراما الكاملة ديال المكالمة التيليفونية."
              text={lead.pitchCall}
              accent="border-sky-400/30 bg-sky-400/10 text-sky-300"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
