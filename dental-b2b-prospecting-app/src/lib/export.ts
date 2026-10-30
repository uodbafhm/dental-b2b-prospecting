import * as XLSX from "xlsx";
import { fmtDate, fmtTime, priorityLabel } from "./analyze";
import type { InstaState, Lead, YesNo } from "./types";

const yn = (v: YesNo): string => (v === "oui" ? "نعم" : v === "non" ? "لا" : "—");
const instaLabel = (v: InstaState): string =>
  v === "actif" ? "نشط" : v === "inactif" ? "مهمل" : v === "absent" ? "ما عندوش" : "—";

/** كيصدّر الجدول كامل لملف Excel (.xlsx) */
export function exportLeadsXlsx(leads: Lead[]): void {
  const rows = leads.map((l, i) => ({
    "#": i + 1,
    "التاريخ": `${fmtDate(l.createdAt)} ${fmtTime(l.createdAt)}`,
    "الكابيني": l.cabinet,
    "التيليفون": l.phone,
    "الواتساب": l.whatsapp,
    "المدينة": l.ville,
    "السيت + الحجز": yn(l.siteBooking),
    "إنستغرام": instaLabel(l.instagram),
    "تصاور Maps": yn(l.photosMaps),
    "فيديوز": yn(l.videos),
    "نوتة Google": String(l.rating).replace(".", ","),
    "عدد التقييمات": l.reviewsCount,
    "ملاحظة التقييمات": l.reviewsNote,
    "النواقص": l.gaps.map((g) => g.title).join(" • "),
    "تبيع ليه": l.gaps.map((g) => g.offer).join(" • "),
    "السكور /100": l.score,
    "الأولوية": priorityLabel(l.priority),
    "بيتش الواتساب": l.pitchWa,
    "سكريبت المكالمة": l.pitchCall,
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  ws["!cols"] = [
    { wch: 4 },
    { wch: 18 },
    { wch: 28 },
    { wch: 16 },
    { wch: 16 },
    { wch: 14 },
    { wch: 14 },
    { wch: 12 },
    { wch: 12 },
    { wch: 9 },
    { wch: 11 },
    { wch: 8 },
    { wch: 34 },
    { wch: 60 },
    { wch: 70 },
    { wch: 10 },
    { wch: 18 },
    { wch: 90 },
    { wch: 100 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "التنقيب");
  const date = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `prospection-cabinets-dentaires-${date}.xlsx`);
}
