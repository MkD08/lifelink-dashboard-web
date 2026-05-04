export interface User {
    id_utilisateur: number;
  
    nom?: string;
    prenom?: string;
    email?: string;
  
    role_id: number;
  
    centre_id?: number;
  
    centre_sante?: {
      id_centre: number;
      nom: string;
      ville: string;
      adresse: string;
      latitude: number;
      longitude: number;
      telephone?: string | null;
    } | null;
  }