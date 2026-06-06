export interface VerificationUser {
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