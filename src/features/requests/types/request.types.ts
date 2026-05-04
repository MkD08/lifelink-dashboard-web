// ==============================
// Types pour les demandes de sang
// ==============================

// Statuts possibles (sécurisé)
export type RequestStatus = "en attente" | "satisfaite";

// ==============================
// Modèle d'une demande
// ==============================
export interface BloodRequest {
  id_demande: number;
  utilisateur_id: number;

  groupe_sanguin: string;
  ville: string;

  quantite: number;

  statut: RequestStatus;

  latitude: number | null;
  longitude: number | null;

  date_creation: string;
}


export interface RequestsApiResponse {
  success: boolean;
  data: {
    success: boolean;
    data: BloodRequest[];
  };
}