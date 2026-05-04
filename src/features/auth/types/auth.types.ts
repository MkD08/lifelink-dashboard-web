export type RoleId = 1 | 2 | 3 | 4;

export interface User {
  id_utilisateur: number;
  nom?: string;
  prenom?: string;
  email?: string | null;
  telephone?: string | null;
  role_id?: RoleId;
  centre_id?: number | null;
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

export interface LoginOfficeResponse {
  success: boolean;
  message?: string;
  access_token?: string;
  refresh_token?: string;
  user?: User;
}