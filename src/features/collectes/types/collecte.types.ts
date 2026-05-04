export interface Collecte {
    id_collecte: number;
    titre: string;
    description?: string;
    image?: string | null;
    lieu: string;
    ville: string;
    latitude: number;
    longitude: number;
    heure_debut: string;
    heure_fin: string;
    date_collecte: string;
    statut: string;
    places_max?: number;
  
    inscriptions?: {
      utilisateur_id: number;
    }[];
  }