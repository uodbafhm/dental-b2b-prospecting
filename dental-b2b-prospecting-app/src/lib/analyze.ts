import type { Gap, Lead, Priority, ProspectInput } from "./types";

const fr = (n: number) => n.toFixed(1).replace(".", ",");

const MONTHS_AR = [
  "يناير", "فبراير", "مارس", "أبريل", "ماي", "يونيو",
  "يوليوز", "غشت", "شتنبر", "أكتوبر", "نونبر", "دجنبر",
];

export function fmtDate(ts: number): string {
  const d = new Date(ts);
  return `${d.getDate()} ${MONTHS_AR[d.getMonth()]}`;
}

export function fmtTime(ts: number): string {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function priorityLabel(p: Priority): string {
  if (p === "hot") return "أولوية سخونة";
  if (p === "warm") return "إمكانية متوسطة";
  return "بروفيل قوي";
}

export function priorityHint(p: Priority): string {
  if (p === "hot") return "بزاف ديال النواقص — فرصة كبيرة للبيع";
  if (p === "warm") return "شوية ديال النواقص تقدر تستغلهم فالتيليفون";
  return "راه مروقّم مزيان — بيع ليه الـ upsell (pub، براندينغ)";
}

/** كنرجعو النمرة المغربية لفورما ديال wa.me (06… ← 2126…) */
export function normalizePhone(p: string): string {
  let d = (p || "").replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("0")) d = "212" + d.slice(1);
  return d;
}

/** النمرة ديال الواتساب: الخانة المخصصة إلا كانت عامرة، إلا لا التيليفون */
export function waNumber(input: { whatsapp: string; phone: string }): string {
  return (input.whatsapp ?? "").trim() || (input.phone ?? "").trim();
}

export function waLink(phone: string, text: string): string {
  return `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(text)}`;
}

/* ------------------------------------------------------------------ */
/*  صياغة البيتشات بالدارجة                                             */
/* ------------------------------------------------------------------ */

function buildPitchWa(input: ProspectInput, gaps: Gap[]): string {
  const ville = input.ville.trim();
  const lieu = ville ? ` ف${ville}` : "";
  const hook = `السلام عليكم، سمحولي نهضر معاكم على ${input.cabinet.trim()}${lieu}.`;

  if (gaps.length === 0) {
    return [
      hook,
      "",
      "الحضور ديالكم أونلاين ديجا من أحسن ما كاين فالسيكتور: سيت فيه الحجز، ريزو نشاط، وتقييمات قويين.",
      "اللي كيبقى لكابيني بحال ديالكم هو الإكويزيسيون المأجورة: كامباني مستهدفة (blanchiment، implants، orthodontie) باش تعمّرو الساعات الخاوين بمرضى qualifiés من المدينة ديالكم.",
      "واش نسيفط ليكم جوج أمثلة بالأرقام هنا فواتساب؟",
    ].join("\n");
  }

  const g1 = gaps[0];
  const g2 = gaps[1];
  const constats = g2
    ? `لاحظت جوج حوايج: ${g1.title}، و ${g2.title}.`
    : `لاحظت حاجة مهمة: ${g1.title}.`;
  const props = gaps
    .slice(0, 2)
    .map((g) => g.offer)
    .join(" ؛ و ");

  return [
    hook,
    "",
    `ملي كنت كنحضّر دراسة على كابينيات السنان فالمنطقة، ${constats}`,
    "يعني كل سيمانة كاينين مرضى جداد كيقلّبو على دونتيست قريب منهم أونلاين — وكيتصلو بالكونكيرون غير حيت هو اللي كيبان ليهم اللول.",
    "",
    `أنا متخصص فالرقمنة ديال كابينيات السنان: نقدر ندير ليكم ${props}. النتيجة: طلبات رونديفو أكثر، بلا ما تبدّلو حتى حاجة فطريقة الخدمة ديالكم.`,
    "",
    "واش نسيفط ليكم جوج أمثلة كونكري هنا فواتساب؟ 5 دقايق وتشوفو واش مناسب للكابيني ديالكم.",
  ].join("\n");
}

function buildCallScript(input: ProspectInput, gaps: Gap[]): string {
  const ville = input.ville.trim();
  const lieu = ville ? ` ف${ville}` : "";
  const lines: string[] = [];
  let step = 1;
  const num = () => `${step++}`;

  lines.push(`سكريبت المكالمة — ${input.cabinet.trim().toUpperCase()}`);
  if (input.phone.trim()) lines.push(`التيليفون: ${input.phone.trim()}`);
  const wa = waNumber(input);
  if (wa) lines.push(`الواتساب: ${wa}`);
  lines.push("");

  lines.push(`${num()} · الاتفاتنة (30 ثانية)`);
  lines.push(
    `« السلام عليكم، دوكتور؟ كنتصل بيك على الڤيزيبيليتي أونلاين ديال الكابيني${lieu}. غير 30 ثانية ونتا اللي كتقرر واش فيها فايدة — اتفاق؟ »`
  );
  lines.push("");

  if (gaps.length > 0) {
    lines.push(`${num()} · اللي شفت أونلاين (تأكدت منو هاد الصباح)`);
    gaps.slice(0, 3).forEach((g) => lines.push(`— ${g.title}: ${g.detail}`));
    lines.push("");
  }

  lines.push(`${num()} · شنو نقترح عليك`);
  const offers =
    gaps.length > 0
      ? gaps.slice(0, 2).map((g) => g.offer)
      : ["كامباني ديال الإكويزيسيون مستهدفة (implants، blanchiment، orthodontie) باش تعمّرو الساعات الخاوين"];
  offers.forEach((o) => lines.push(`— ${o}`));
  lines.push("");

  lines.push(`${num()} · الخطوة الجاية`);
  lines.push(
    "« نقدر نمر للكابيني 15 دقيقة هاد السيمانة، نوريك جوج أمثلة كونكري ديال كابينيات بحال ديالك — الثلاثاء ولا الخميس أحسن ليك؟ »"
  );
  lines.push("");

  lines.push("الاعتراض « شحال الثمن؟ »");
  lines.push("« أقل من implant وحدة فالشهر — وكليانة جديدة دائمة وحدة كتخلّص ليك لالطوطال. »");

  return lines.join("\n");
}

/* ------------------------------------------------------------------ */
/*  محرك التحليل: من الأجوبة ← سكور، نواقص مرتبة، بيتشات جاهزة          */
/* ------------------------------------------------------------------ */

export function analyzeProspect(input: ProspectInput): Lead {
  const gaps: Gap[] = [];
  let score = 0;

  /* 1 — السيت + الحجز أونلاين (25 نقطة) */
  if (input.siteBooking === "oui") {
    score += 25;
  } else {
    gaps.push({
      id: "site",
      icon: "globe",
      title: "ما كاينش حجز أونلاين (Booking)",
      detail:
        "ما كاين لا سيت لا سيستيم ديال الحجز: كل رونديفو كيبقى تابع للتيليفون. الناس اللي كيقلّبو بالليل ولا فالويكاند كيمشيو عند الكونكيرون.",
      offer: "سيت ويب خفيف وسريع + حجز الرونديفو أونلاين 24/7 مربوط بالأچاندا ديال الكابيني",
      weight: 5,
    });
  }

  /* 2 — الإنستغرام (20 نقطة) */
  if (input.instagram === "actif") {
    score += 20;
  } else if (input.instagram === "inactif") {
    score += 7;
    gaps.push({
      id: "insta-inactif",
      icon: "instagram",
      title: "الإنستغرام ناعس",
      detail:
        "الكونط كاين ولكن حبس النشر: كيعطي تصورة ديال كابيني مسدود ولا مهمل — أشر من ما يكونش كونط أصلاً.",
      offer: "إعادة إطلاق الإنستغرام: أوديت ديال الكونط + 12 بوست/شهر + 4 Reels (قبل/بعد، كوليس الكابيني)",
      weight: 4,
    });
  } else {
    gaps.push({
      id: "insta-absent",
      icon: "instagram",
      title: "ما كاينش فالإنستغرام",
      detail:
        "حتى كونط نشط: اليوم الناس من 25 حتى 45 عام كيختارو الدكتور ديال السنان من الريزو قبل ما يشوفو الأنير.",
      offer: "خلق + تدبير الإنستغرام: هوية بصرية، محتوى شهري، وسيتاج محلي ديال المدينة",
      weight: 4,
    });
  }

  /* 3 — تصاور Google Maps (15 نقطة) */
  if (input.photosMaps === "oui") {
    score += 15;
  } else {
    gaps.push({
      id: "photos",
      icon: "image",
      title: "الفيشة ديال Google باهتة",
      detail:
        "التصاور ما كاينينش ولا قدام فـ Google Maps: أول إنبريسيون ديال الناس كتدير هنا، فـ 3 ثواني، قبل حتى التيليفون.",
      offer: "شووتينغ فوتو برو ديال الكابيني + أوبتيميزاسيون كاملة ديال الفيشة Google Business",
      weight: 3,
    });
  }

  /* 4 — الفيديوز (20 نقطة) */
  if (input.videos === "oui") {
    score += 20;
  } else {
    gaps.push({
      id: "videos",
      icon: "video",
      title: "زيرو فيديو",
      detail:
        "حتى فيديو على الكابيني: إمبوسيبل تصاوب الثقة قبل أول ڤيزيت، فاش الفيديو هو اللي كيطمّن الكليان الخايف من دونتيست.",
      offer: "بروديكسيون ديال فيديوهات قصار (جولة فالكابيني، تقديم، تيموينياج) للـ Reels، TikTok والواتساب",
      weight: 4,
    });
  }

  /* 5 — السومعة الإلكترونية (20 نقطة) */
  const r = input.rating;
  const c = Math.max(0, Math.round(input.reviewsCount || 0));
  const noteSuffix = input.reviewsNote.trim() ? ` ملاحظة من التيران: « ${input.reviewsNote.trim()} ».` : "";

  if (r >= 4.3 && c >= 30) {
    score += 20;
  } else if (r >= 3.9 && c >= 10) {
    score += 10;
    gaps.push({
      id: "reviews-mid",
      icon: "star",
      title: "السومعة الإلكترونية ناقصة",
      detail: `${fr(r)}/5 مع ${c} تقييم: تحت السيي ديال الثقة (≥ 4,3/5 و 30 تقييم) اللي كيحوّل البحث فـ Google لمكالمة.${noteSuffix}`,
      offer: "ماكينة التقييمات فـ Google: QR code فسال داطانت، مساج أوتوماتيك من بعد السوا، وأجواب برو على التقييمات",
      weight: 4,
    });
  } else {
    gaps.push({
      id: "reviews-bad",
      icon: "star",
      title: "السومعة الإلكترونية هشة",
      detail: `${fr(r)}/5 مع ${c} تقييم: الكليان الجديد كيقارن 3 فيشات قبل ما يتصل — وهنا الفيشة كتخسر الدويل.${noteSuffix}`,
      offer: "بلان إنقاد السومعة الإلكترونية: جمع تقييمات 5 نجوم + أجواب برو + أوبتيميزاسيون ديال الفيشة Google",
      weight: 5,
    });
  }

  /* ترتيب النواقص على حساب الأهمية التجارية */
  gaps.sort((a, b) => b.weight - a.weight);

  const priority: Priority = score <= 45 ? "hot" : score <= 70 ? "warm" : "cool";

  return {
    ...input,
    cabinet: input.cabinet.trim(),
    phone: input.phone.trim(),
    ville: input.ville.trim(),
    reviewsCount: c,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
    gaps,
    score,
    priority,
    pitchWa: buildPitchWa(input, gaps),
    pitchCall: buildCallScript(input, gaps),
  };
}
