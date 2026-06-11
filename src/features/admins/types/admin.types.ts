// src/features/admins/types/admin.types.ts

export interface AdminRole {
    id_role: number;
    nom_role: string;
  }
  
  export interface Admin {
    id_utilisateur: number;
  
    nom: string | null;
    prenom: string | null;
  
    telephone: string | null;
    email: string | null;
  
    ville: string | null;
    quartier: string | null;
  
    groupe_sanguin: string | null;
  
    actif: boolean;
  
    role_id: number;
  
    date_creation: string;
    date_mise_a_jour: string;
  
    role?: AdminRole | null;
  }
  
  export interface AdminApiResponse {
    success: boolean;
    message?: string;
    data: Admin[];
  }
  
  export interface AdminDetailsApiResponse {
    success: boolean;
    message?: string;
    data: Admin;
  }
  
  export interface CreateAdminPayload {
    nom: string;
    prenom: string;
  
    telephone: string;
  
    email: string;
  
    password: string;
  
    ville: string;
  
    quartier: string;
  
    groupe_sanguin: string;
  }
  
  export interface UpdateAdminPayload {
    nom?: string;
  
    prenom?: string;
  
    telephone?: string;
  
    email?: string;
  
    ville?: string;
  
    quartier?: string;
  
    groupe_sanguin?: string;
  
    actif?: boolean;
  }
  
  export interface UpdateAdminProfilePayload {
    nom?: string;
  
    prenom?: string;
  
    telephone?: string;
  
    email?: string;
  
    ville?: string;
  
    quartier?: string;
  
    groupe_sanguin?: string;
  }
  
  export interface ChangeAdminPasswordPayload {
    old_password: string;
  
    new_password: string;
  }