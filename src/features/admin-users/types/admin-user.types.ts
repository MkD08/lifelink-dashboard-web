export interface UserRole {
    id_role: number;
    nom_role: string;
  }
  
  export interface UserCentre {
    id_centre: number;
    nom: string;
    ville: string;
    adresse: string;
  
    latitude: number;
    longitude: number;
  
    telephone: string | null;
  
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface AdminUser {
    id_utilisateur: number;
  
    nom: string | null;
    prenom: string | null;
  
    genre: string | null;
  
    date_naissance: string | null;
  
    telephone: string | null;
    email: string | null;
  
    qr_code: string | null;
  
    ville: string | null;
    quartier: string | null;
  
    latitude: number | null;
    longitude: number | null;
  
    groupe_sanguin: string | null;
  
    statut_groupe_sanguin: string | null;
  
    a_donne_recemment: boolean;
  
    date_dernier_don_declaree: string | null;
    date_prochain_don: string | null;
  
    profil_complet: boolean;
  
    actif: boolean;
  
    centre_id: number | null;
  
    points: number | null;
  
    accepte_conditions: boolean;
    accepte_politique_confidentialite: boolean;
  
    date_acceptation_conditions: string | null;
  
    role_id: number;
  
    date_creation: string;
    date_mise_a_jour: string;
  
    role?: UserRole | null;
  
    centre_sante?: UserCentre | null;
  }
  
  export interface AdminUsersApiResponse {
    success: boolean;
  
    message?: string;
  
    data: AdminUser[];
  }
  
  export interface UpdateAdminUserPayload {
    nom?: string | null;
  
    prenom?: string | null;
  
    genre?: string | null;
  
    date_naissance?: string | null;
  
    telephone?: string | null;
  
    email?: string | null;
  
    ville?: string | null;
  
    quartier?: string | null;
  
    latitude?: number | null;
    longitude?: number | null;
  
    groupe_sanguin?: string | null;
  
    statut_groupe_sanguin?: string | null;
  
    profil_complet?: boolean;
  
    actif?: boolean;
  
    centre_id?: number | null;
  
    role_id?: number;
  }