export interface Staff {
  id_utilisateur: number;

  nom: string;
  prenom: string;

  genre?: string;

  telephone?: string;
  email?: string;

  ville?: string;
  quartier?: string;

  groupe_sanguin?: string | null;

  actif: boolean;

  role_id: number;
  centre_id: number;

  role?: {
    id_role: number;
    nom_role: string;
  };

  centre_sante?: {
    id_centre: number;
    nom: string;
    ville: string;
    adresse?: string;
    telephone?: string;
  };
}

export interface CreateStaffPayload {
  nom: string;
  prenom: string;
  genre: string;
  date_naissance: string;
  telephone: string;
  email: string;
  password: string;
  ville: string;
  quartier: string;
}

export interface CreateStaffResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
}