import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Building2,
  Check,
  CheckCircle2,
  Hash,
  Loader2,
  MapPin,
  MessageCircle,
  Pause,
  PenLine,
  Phone,
  Sparkles,
  Star,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Segmented, type SegOption } from "./Segmented";
import type { InstaState, ProspectInput, YesNo } from "../lib/types";

/* ------------------------------------------------------------------ */
/*  الدوني                                                              */
/* ------------------------------------------------------------------ */

const EMPTY: ProspectInput = {
  cabinet: "",
  phone: "",
  whatsapp: "",
  ville: "",
  siteBooking: null,
  instagram: null,
  photosMaps: null,
  videos: null,
  rating: 4.0,
  reviewsCount: 12,
  reviewsNote: "",
};

const EXAMPLE: ProspectInput = {
  cabinet: "كابيني دونتير سميل أطلس",
  phone: "06 61 23 45 67",
  whatsapp: "06 61 23 45 67",
  ville: "الدار البيضاء — المعاريف",
  siteBooking: "non",
  instagram: "inactif",
  photosMaps: "non",
  videos: "non",
  rating: 3.9,
  reviewsCount: 11,
  reviewsNote: "كاين شوية تقييمات سلبية جداد، والكابيني ما كيجاوبش عليهم.",
};

type OuiNon = Exclude<YesNo, null>;
type Insta = Exclude<InstaState, null>;

const OUI_NON: SegOption<OuiNon>[] = [
  { value: "oui", label: "نعم", icon: Check, tone: "pos" },
  { value: "non", label: "لا", icon: X, tone: "neg" },
];

const INSTA_OPTS: SegOption<Insta>[] = [
  { value: "actif", label: "نعم، نشط", icon: Check, tone: "pos" },
  { value: "inactif", label: "مهمل / ناعس", icon: Pause, tone: "warn" },
  { value: "absent", label: "لا، ما عندوش", icon: X, tone: "neg" },
];

/* ------------------------------------------------------------------ */
/*  كومبونونتس صغار                                                     */
/* ------------------------------------------------------------------ */

function Question({
  n,
  title,
  sub,
  answered,
  children,
}: {
  n: string;
  title: string;
  sub?: string;
  answered?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition-colors duration-300 hover:border-white/[0.12]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5">
          <span className="mt-0.5 rounded-lg border border-teal-400/25 bg-teal-400/[0.08] px-2 py-0.5 font-display text-[12px] font-black text-teal-300">
            {n}
          </span>
          <div>
            <h3 className="font-display text-[15px] font-bold leading-snug text-zinc-100">{title}</h3>
            {sub && <p className="mt-1 text-[12px] leading-relaxed text-zinc-500">{sub}</p>}
          </div>
        </div>
        {answered && <CheckCircle2 size={17} className="mt-1 shrink-0 text-teal-400" />}
      </div>
      {children}
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon: LucideIcon;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11.5px] font-semibold text-zinc-500">
        {label} {required && <span className="text-teal-400">*</span>}
      </span>
      <div className="relative">
        <Icon size={15} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pe-4 ps-10 text-sm text-zinc-100 outline-none transition-all duration-200 placeholder:text-zinc-600 focus:border-teal-400/60 focus:bg-teal-400/[0.04] focus:ring-4 focus:ring-teal-400/10"
        />
      </div>
    </label>
  );
}

function rateMeta(rating: number): { label: string; cls: string } {
  if (rating < 3.5) return { label: "ضعيفة", cls: "text-rose-300" };
  if (rating < 4.3) return { label: "متوسطة", cls: "text-amber-300" };
  if (rating < 4.7) return { label: "مزيانة", cls: "text-teal-300" };
  return { label: "ممتازة", cls: "text-emerald-300" };
}

/* ------------------------------------------------------------------ */
/*  الاستمارة                                                           */
/* ------------------------------------------------------------------ */

interface ProspectFormProps {
  analyzing: boolean;
  onAnalyze: (input: ProspectInput) => void;
}

export function ProspectForm({ analyzing, onAnalyze }: ProspectFormProps) {
  const [input, setInput] = useState<ProspectInput>(EMPTY);
  const [tried, setTried] = useState(false);

  const set = <K extends keyof ProspectInput>(k: K, v: ProspectInput[K]) =>
    setInput((p) => ({ ...p, [k]: v }));

  const missing = useMemo(() => {
    const m: string[] = [];
    if (!input.cabinet.trim()) m.push("سمية الكابيني");
    if (!input.siteBooking) m.push("السيت + الحجز");
    if (!input.instagram) m.push("الإنستغرام");
    if (!input.photosMaps) m.push("تصاور Maps");
    if (!input.videos) m.push("الفيديوز");
    return m;
  }, [input]);

  const submit = () => {
    if (missing.length > 0) {
      setTried(true);
      return;
    }
    onAnalyze(input);
  };

  const meta = rateMeta(input.rating);
  const sliderFill = ((input.rating - 1) / 4) * 100;

  return (
    <div className="space-y-4">
      {/* الترويسة ديال الاستمارة */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[11.5px] font-semibold text-zinc-500">الاستمارة ديال التيران</div>
          <h2 className="mt-1 font-display text-xl font-black text-white">كابيني جديد للتحليل</h2>
        </div>
        <button
          type="button"
          onClick={() => {
            setInput(EXAMPLE);
            setTried(false);
          }}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[12px] font-medium text-zinc-400 transition-all hover:border-teal-400/40 hover:text-teal-300 active:scale-[0.97]"
        >
          <Zap size={13} />
          عمّر ميتال
        </button>
      </div>

      {/* 01 — التعريف */}
      <Question n="01" title="التعريف بالكابيني" sub="السمية التجارية والمعلومات ديال التواصل للمتابعة." answered={!!input.cabinet.trim()}>
        <div className="space-y-4">
          <TextField
            label="سمية الكابيني"
            value={input.cabinet}
            onChange={(v) => set("cabinet", v)}
            placeholder="مثال: كابيني دونتير سميل أطلس"
            icon={Building2}
            required
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TextField
              label="التيليفون"
              value={input.phone}
              onChange={(v) => set("phone", v)}
              placeholder="06 12 34 56 78"
              icon={Phone}
              type="tel"
            />
            <TextField
              label="واتساب (إلا كان مختلف)"
              value={input.whatsapp}
              onChange={(v) => set("whatsapp", v)}
              placeholder="خليه خاوي إلا بحال التيليفون"
              icon={MessageCircle}
              type="tel"
            />
            <TextField
              label="المدينة / الحي"
              value={input.ville}
              onChange={(v) => set("ville", v)}
              placeholder="الدار البيضاء — المعاريف"
              icon={MapPin}
            />
          </div>
        </div>
      </Question>

      {/* 02 — السيت + البوكينغ */}
      <Question
        n="02"
        title="واش عندو سيت ويب فيه الحجز؟"
        sub="واش الكابيني عندو موقع فيه سيستيم ديال Booking أونلاين؟"
        answered={!!input.siteBooking}
      >
        <Segmented<OuiNon> value={input.siteBooking} options={OUI_NON} onChange={(v) => set("siteBooking", v)} />
      </Question>

      {/* 03 — الإنستغرام */}
      <Question
        n="03"
        title="واش الإنستغرام ديالو نشط؟"
        sub="واش الكونط كينشر بوستات جداد (أقل من شهر)؟"
        answered={!!input.instagram}
      >
        <Segmented<Insta> value={input.instagram} options={INSTA_OPTS} onChange={(v) => set("instagram", v)} />
      </Question>

      {/* 04 — تصاور Maps */}
      <Question
        n="04"
        title="واش التصاور فـ Google Maps زوينين؟"
        sub="تصاور واضحة وجداد ديال الكابيني فالفيشة ديال Google؟"
        answered={!!input.photosMaps}
      >
        <Segmented<OuiNon> value={input.photosMaps} options={OUI_NON} onChange={(v) => set("photosMaps", v)} />
      </Question>

      {/* 05 — الفيديوز */}
      <Question
        n="05"
        title="واش كيدير فيديوز على الكابيني؟"
        sub="فيديوهات (جولة، علاجات، الفريق) فالريزو أو فالفيشة ديال Google؟"
        answered={!!input.videos}
      >
        <Segmented<OuiNon> value={input.videos} options={OUI_NON} onChange={(v) => set("videos", v)} />
      </Question>

      {/* 06 — التقييمات */}
      <Question
        n="06"
        title="التقييمات ديال Google Maps"
        sub="النوتة المتوسطة، عدد التقييمات، وملاحظاتك من التيران."
        answered
      >
        <div className="space-y-5">
          <div>
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-[11.5px] font-semibold text-zinc-500">النوتة المتوسطة</span>
              <span className={`flex items-center gap-1.5 font-display text-[15px] font-black ${meta.cls}`} dir="ltr">
                <Star size={14} className="fill-current" />
                {input.rating.toFixed(1).replace(".", ",")}/5 · {meta.label}
              </span>
            </div>
            <div dir="ltr">
              <input
                type="range"
                min={1}
                max={5}
                step={0.5}
                value={input.rating}
                onChange={(e) => set("rating", Number(e.target.value))}
                className="slider-teal"
                style={{ "--fill": `${sliderFill}%` } as CSSProperties}
              />
              <div className="mt-1.5 flex justify-between text-[10px] font-medium text-zinc-600">
                <span>1</span>
                <span>3</span>
                <span>5</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-[11.5px] font-semibold text-zinc-500">عدد التقييمات</span>
              <div className="relative">
                <Hash size={15} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input
                  type="number"
                  min={0}
                  dir="ltr"
                  value={input.reviewsCount}
                  onChange={(e) => set("reviewsCount", Math.max(0, Number(e.target.value)))}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pe-4 ps-10 text-start text-sm text-zinc-100 outline-none transition-all duration-200 focus:border-teal-400/60 focus:bg-teal-400/[0.04] focus:ring-4 focus:ring-teal-400/10"
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[11.5px] font-semibold text-zinc-500">ملاحظة صغيرة (اختياري)</span>
              <div className="relative">
                <PenLine size={15} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input
                  type="text"
                  value={input.reviewsNote}
                  onChange={(e) => set("reviewsNote", e.target.value)}
                  placeholder="مثال: ما كيجاوبش على التقييمات"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pe-4 ps-10 text-sm text-zinc-100 outline-none transition-all duration-200 placeholder:text-zinc-600 focus:border-teal-400/60 focus:bg-teal-400/[0.04] focus:ring-4 focus:ring-teal-400/10"
                />
              </div>
            </label>
          </div>
        </div>
      </Question>

      {/* الزر ديال التحليل */}
      <div className="pt-1">
        <button
          type="button"
          onClick={submit}
          disabled={analyzing}
          className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 bg-[length:200%_100%] bg-left py-4 font-display text-[15px] font-black text-[#052a22] transition-all duration-500 hover:bg-right active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
        >
          <span className="relative flex items-center justify-center gap-2.5">
            {analyzing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {analyzing ? "كنحللو الإشارات الرقمية…" : "حلّل — خرّج البيزون (Analyser)"}
          </span>
        </button>
        {tried && missing.length > 0 && (
          <p className="mt-2.5 text-center text-[12px] text-rose-300">
            باقي ناقصك: <span className="font-bold">{missing.join("، ")}</span>
          </p>
        )}
        {!tried && missing.length > 0 && (
          <p className="mt-2.5 text-center text-[12px] text-zinc-600">باقي تكمل: {missing.join(" · ")}</p>
        )}
      </div>
    </div>
  );
}
