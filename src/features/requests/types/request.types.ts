// ==============================
// Types pour les demandes de sang
// ==============================

// ==============================
// Statuts possibles
// ==============================

export type RequestStatus =
  | "EN_ATTENTE"
  | "EN_COURS"
  | "VALIDE"
  | "TERMINE"
  | "ANNULE"
  | "REFUSE";

// ==============================
// Centre lié à une demande
// ==============================

export interface RequestCentre {
  id_centre: number;

  nom: string;

  ville: string;

  adresse: string;

  telephone: string;
}

// ==============================
// Utilisateur demandeur
// ==============================

export interface RequestUser {
  id_utilisateur: number;

  nom: string;

  prenom: string;

  telephone: string;
}

// ==============================
// Modèle d'une demande de sang
// ==============================

export interface BloodRequest {

  id_demande: number;

  utilisateur_id: number;

  groupe_sanguin: string;

  ville: string;

  quantite: number;

  // 🔥 Nouveau
  centre_id: number | null;

  // 🔥 Workflow statuts
  statut: RequestStatus;

  latitude: number | null;

  longitude: number | null;

  date_creation: string;

  // 🔥 Relations enrichies backend
  centre?: RequestCentre;

  utilisateur?: RequestUser;
}

// ==============================
// Réponse API
// ==============================

export interface RequestsApiResponse {

  success: boolean;

  data: {

    success: boolean;

    data: BloodRequest[];
  };
}