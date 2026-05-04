export interface Donor {
    id_utilisateur: number;
    nom: string;
    prenom: string;
    telephone: string | null;
    email: string | null;
    ville: string | null;
    quartier: string | null;
    latitude: number | null;
    longitude: number | null;
    groupe_sanguin: string | null;
    statut_groupe_sanguin: string | null;
    profil_complet: boolean;
    actif: boolean;
    points: number | null;
    qr_code: string | null;
    date_creation: string;
    centre_id: number | null;
  }
  
  export interface DonorsApiResponse {
    success: boolean;
    total: number;
    data: Donor[];
  }
  export interface GenerateQrResponse {
    success?: boolean;
    qr?: string;
    qr_code?: string;
    data?: {
      qr?: string;
      qr_code?: string;
    };
  }