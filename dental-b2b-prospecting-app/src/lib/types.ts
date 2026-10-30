export type YesNo = "oui" | "non" | null;
export type InstaState = "actif" | "inactif" | "absent" | null;

/** Réponses brutes du questionnaire de prospection */
export interface ProspectInput {
  cabinet: string;
  phone: string;
  whatsapp: string;
  ville: string;
  siteBooking: YesNo;
  instagram: InstaState;
  photosMaps: YesNo;
  videos: YesNo;
  rating: number;
  reviewsCount: number;
  reviewsNote: string;
}

export type GapIcon = "globe" | "instagram" | "image" | "video" | "star";

/** Une lacune détectée + l'offre à vendre pour la combler */
export interface Gap {
  id: string;
  icon: GapIcon;
  title: string;
  detail: string;
  offer: string;
  weight: number;
}

export type Priority = "hot" | "warm" | "cool";

/** Une fiche prospect complète, analysée et prête à exporter */
export interface Lead extends ProspectInput {
  id: string;
  createdAt: number;
  gaps: Gap[];
  score: number;
  priority: Priority;
  pitchWa: string;
  pitchCall: string;
}
