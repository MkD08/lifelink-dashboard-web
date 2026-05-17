import type { AdminUser } from "../../admin-users/types/admin-user.types";

export interface Director extends AdminUser {}

export interface CreateDirectorPayload {
  nom: string;
  prenom: string;
  genre: string;
  date_naissance: string;
  telephone: string;
  email: string;
  password: string;
  ville: string;
  quartier: string;

  /**
   * Centre affilié
   */
  centre_id: number;
}

export interface DirectorsApiResponse {
  success?: boolean;
  message?: string;
  data?: Director[];
}