/**
 * ==============================
 * INSCRIPTION
 * ==============================
 */
export interface InscriptionCollecte {

  utilisateur_id: number;
}

/**
 * ==============================
 * CENTRE
 * ==============================
 */
export interface CentreCollecte {

  id_centre: number;

  nom: string;

  ville?: string;

  adresse?: string;
}

/**
 * ==============================
 * COLLECTE
 * ==============================
 */
export interface Collecte {

  id_collecte: number;

  // ==============================
  // INFOS
  // ==============================
  titre: string;

  description?: string;

  image?: string | null;

  // ==============================
  // DESIGN THEME
  // ==============================
  theme?:
    | "red"
    | "blue"
    | "green"
    | "purple"
    | "orange";

  // ==============================
  // LOCALISATION
  // ==============================
  lieu: string;

  ville: string;

  latitude: number;

  longitude: number;

  // ==============================
  // DATE & HEURE
  // ==============================
  heure_debut: string;

  heure_fin: string;

  date_collecte: string;

  // ==============================
  // STATUS
  // ==============================
  statut: string;

  places_max?: number;

  // ==============================
  // CENTRE
  // ==============================
  centre_id?: number;

  centre?: CentreCollecte;

  // ==============================
  // PARTICIPANTS
  // ==============================
  inscriptions?: InscriptionCollecte[];

  // ==============================
  // OPTIONAL META
  // ==============================
  created_at?: string;

  updated_at?: string;
}

/**
 * ==============================
 * API RESPONSE
 * ==============================
 */
export interface CollectesApiResponse {

  success: boolean;

  data: Collecte[];
}