import { useEffect, useRef, useState } from "react";
import { AnalysisResult } from "./components/AnalysisResult";
import { Header } from "./components/Header";
import { LeadsTable } from "./components/LeadsTable";
import { ProspectForm } from "./components/ProspectForm";
import { analyzeProspect } from "./lib/analyze";
import { exportLeadsXlsx } from "./lib/export";
import type { Lead, ProspectInput } from "./lib/types";

const STORAGE_KEY = "dentscope.leads.v1";

function loadLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Lead[]) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [leads, setLeads] = useState<Lead[]>(loadLeads);
  const [current, setCurrent] = useState<Lead | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    } catch {
      /* التخزين عامر ولا ما متاحش: كنكملو بلا برسيستونس */
    }
  }, [leads]);

  const scrollToResult = () => {
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleAnalyze = (input: ProspectInput) => {
    setAnalyzing(true);
    if (window.innerWidth < 1280) scrollToResult();
    window.setTimeout(() => {
      const lead = analyzeProspect(input);
      setLeads((prev) => [lead, ...prev]);
      setCurrent(lead);
      setAnalyzing(false);
    }, 1200);
  };

  const handleSelect = (lead: Lead) => {
    setCurrent(lead);
    scrollToResult();
  };

  const handleDelete = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const handleClear = () => {
    if (window.confirm("بغيتي تحيّد الجدول كامل؟ هاد العملية ما كترجعش.")) {
      setLeads([]);
    }
  };

  const handleExport = () => {
    if (leads.length > 0) exportLeadsXlsx(leads);
  };

  const hotCount = leads.filter((l) => l.priority === "hot").length;
  const avgScore = leads.length ? Math.round(leads.reduce((s, l) => s + l.score, 0) / leads.length) : 0;

  return (
    <div className="noise min-h-screen bg-[#06090d] font-body text-zinc-100">
      {/* الديكور ديال الخلفية */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="animate-drift absolute -top-40 left-1/2 h-[560px] w-[860px] -translate-x-1/2 rounded-full bg-teal-500/[0.07] blur-[120px]" />
        <div className="animate-drift-slow absolute end-[-200px] top-1/3 h-[480px] w-[480px] rounded-full bg-emerald-400/[0.05] blur-[110px]" />
        <div className="absolute bottom-[-160px] start-[-120px] h-[420px] w-[420px] rounded-full bg-sky-500/[0.05] blur-[110px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent)]" />
      </div>

      <Header total={leads.length} hot={hotCount} avgScore={avgScore} />

      <main className="relative z-10 mx-auto max-w-[1440px] px-4 pb-24 pt-8 sm:px-6 lg:px-10 lg:pt-12">
        {/* المقدمة */}
        <div className="mb-8 lg:mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-400/25 bg-teal-400/[0.07] px-3.5 py-1.5 text-[11px] font-bold text-teal-300">
            <span className="size-1.5 rounded-full bg-teal-300 animate-pulse-ring" />
            أوديت إكسبريس · 6 أسئلة · 30 ثانية
          </div>
          <h1 className="max-w-3xl font-display text-[clamp(28px,4.2vw,44px)] font-black leading-[1.3] text-white">
            حوّل الفيشة ديال Google ديال الكابيني{" "}
            <span className="bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
              لبيتش بيعي جاهز
            </span>
            .
          </h1>
          <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-zinc-400">
            عمّر غير اللي كتشوفو أونلاين عند الدونتيست: DentScope كيخرّج ليك النواقص، كيكتب مساج الواتساب
            وسكريبت المكالمة بالدارجة، وكيسجّل كلشي فجدول كتصدّرو لـ Excel.
          </p>
        </div>

        {/* الاستمارة + النتيجة */}
        <div className="grid items-start gap-6 xl:grid-cols-[1.12fr_0.88fr]">
          <ProspectForm analyzing={analyzing} onAnalyze={handleAnalyze} />
          <div ref={resultRef} className="scroll-mt-24 xl:sticky xl:top-24">
            <AnalysisResult lead={current} analyzing={analyzing} />
          </div>
        </div>

        {/* الهيستوري + التصدير */}
        <LeadsTable
          leads={leads}
          selectedId={current?.id ?? null}
          onSelect={handleSelect}
          onDelete={handleDelete}
          onExport={handleExport}
          onClear={handleClear}
        />
      </main>

      <footer className="relative z-10 border-t border-white/[0.06] py-8">
        <p className="mx-auto max-w-[1440px] px-4 text-center text-[12px] leading-relaxed text-zinc-600 sm:px-6 lg:px-10">
          DentScope — أداة داخلية للتنقيب B2B ديال عيادات السنان. المعطيات ديالك محفوظة لوكال فهاد المتصفح،
          والإكسبور Excel كيخليك تخزّنها فين ما بغيتي.
        </p>
      </footer>
    </div>
  );
}
