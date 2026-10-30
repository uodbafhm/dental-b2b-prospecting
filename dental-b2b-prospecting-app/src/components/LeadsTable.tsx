import {
  ArrowUpLeft,
  Eraser,
  FileSpreadsheet,
  Inbox,
  MapPin,
  MessageCircle,
  Trash2,
} from "lucide-react";
import { fmtDate, priorityLabel, waLink, waNumber } from "../lib/analyze";
import type { Lead, Priority } from "../lib/types";

interface LeadsTableProps {
  leads: Lead[];
  selectedId: string | null;
  onSelect: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onExport: () => void;
  onClear: () => void;
}

const PRIO_PILL: Record<Priority, string> = {
  hot: "border-orange-400/30 bg-orange-400/10 text-orange-300",
  warm: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  cool: "border-teal-400/30 bg-teal-400/10 text-teal-300",
};

const scoreCls = (s: number) => (s <= 45 ? "text-orange-300" : s <= 70 ? "text-sky-300" : "text-teal-300");
const scoreDot = (s: number) => (s <= 45 ? "bg-orange-400" : s <= 70 ? "bg-sky-400" : "bg-teal-400");

const TH = "px-5 py-3.5 text-[11px] font-semibold text-zinc-500";

export function LeadsTable({ leads, selectedId, onSelect, onDelete, onExport, onClear }: LeadsTableProps) {
  return (
    <section className="mt-14">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div>
            <div className="text-[11.5px] font-semibold text-zinc-500">الهيستوري والتصدير</div>
            <h2 className="mt-1 font-display text-xl font-black text-white">الجدول ديال التنقيب</h2>
          </div>
          <span className="mt-4 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-display text-[11px] font-black text-zinc-300">
            {leads.length} كابيني
          </span>
        </div>

        <div className="flex items-center gap-2">
          {leads.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-[12px] font-bold text-zinc-400 transition-all hover:border-rose-400/40 hover:text-rose-300 active:scale-[0.97]"
            >
              <Eraser size={14} />
              حيّد كلشي
            </button>
          )}
          <button
            type="button"
            onClick={onExport}
            disabled={leads.length === 0}
            className="flex items-center gap-2 rounded-xl border border-teal-400/40 bg-teal-400/10 px-4 py-2.5 text-[12.5px] font-black text-teal-300 transition-all hover:bg-teal-400/20 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FileSpreadsheet size={15} />
            صدّر Excel (.xlsx)
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.015]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-start">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className={`${TH} text-start`}>#</th>
                <th className={`${TH} text-start`}>الكابيني</th>
                <th className={`${TH} text-start`}>الكونتاكت</th>
                <th className={`${TH} text-start`}>السكور</th>
                <th className={`${TH} text-start`}>الأولوية</th>
                <th className={`${TH} text-start`}>أول نقصة</th>
                <th className={`${TH} text-start`}>تزاد فـ</th>
                <th className={`${TH} text-end`}>الأكشنز</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <Inbox size={28} className="mx-auto text-zinc-700" />
                    <p className="mt-3 text-[13px] font-bold text-zinc-500">مازال ما كاين حتى كابيني محلل.</p>
                    <p className="mt-1 text-[12px] text-zinc-600">
                      كل تحليل كتديرو كيتسجّل هنا، وكتقدر تصدّرو لملف Excel.
                    </p>
                  </td>
                </tr>
              ) : (
                leads.map((l, i) => (
                  <tr
                    key={l.id}
                    onClick={() => onSelect(l)}
                    className={`cursor-pointer border-b border-white/[0.04] transition-colors last:border-0 hover:bg-white/[0.03] ${
                      selectedId === l.id ? "bg-teal-400/[0.05]" : ""
                    }`}
                  >
                    <td className="px-5 py-4 font-display text-[12px] font-black text-zinc-600">
                      {String(leads.length - i).padStart(2, "0")}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-display text-[13.5px] font-black text-white">{l.cabinet}</div>
                      {l.ville && (
                        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-zinc-500">
                          <MapPin size={10} /> {l.ville}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-[12.5px] tabular-nums text-zinc-400">
                      <div dir="ltr" className="w-fit">{l.phone || "—"}</div>
                      {!!l.whatsapp && l.whatsapp.trim() !== "" && l.whatsapp.trim() !== l.phone.trim() && (
                        <div dir="ltr" className="mt-1 flex w-fit items-center gap-1 text-[11px] text-emerald-400/80">
                          <MessageCircle size={10} /> {l.whatsapp}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`flex items-center gap-2 font-display text-[14px] font-black ${scoreCls(l.score)}`}>
                        <span className={`size-1.5 rounded-full ${scoreDot(l.score)}`} />
                        {l.score}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-1 text-[10.5px] font-black ${PRIO_PILL[l.priority]}`}
                      >
                        {priorityLabel(l.priority)}
                      </span>
                    </td>
                    <td className="max-w-[240px] px-5 py-4">
                      <span className="block truncate text-[12px] text-zinc-400">
                        {l.gaps[0]?.title ?? "بروفيل قوي — upsell"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[12px] text-zinc-500">{fmtDate(l.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {waNumber(l) ? (
                          <a
                            href={waLink(waNumber(l), l.pitchWa)}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title="حل الواتساب بالبيتش جاهز"
                            className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400 transition-all hover:border-emerald-400/40 hover:text-emerald-300"
                          >
                            <ArrowUpLeft size={14} />
                          </a>
                        ) : null}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(l.id);
                          }}
                          title="حيّد هاد الكابيني"
                          className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400 transition-all hover:border-rose-400/40 hover:text-rose-300"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-3 text-[11px] text-zinc-600">
        كليكي على شي سطر باش ترجع تشوف التقرير كامل ديالو. المعطيات محفوظة فهاد المتصفح، حتى إلا سديتيه ورديتيه.
      </p>
    </section>
  );
}
