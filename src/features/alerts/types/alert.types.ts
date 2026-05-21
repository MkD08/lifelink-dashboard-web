export type AlertType =
  | "urgent"
  | "warning"
  | "info";

export interface Centre {
  id_centre: number;

  nom: string;

  ville: string;

  adresse?: string;

  quartier?: string;

  latitude?: number;

  longitude?: number;

  telephone?: string;
}

export interface AlertCreator {
  id_utilisateur: number;

  nom: string;

  prenom: string;

  email?: string;
}

export interface Alert {
  id_alerte: number;

  titre: string;

  message: string;

  type: AlertType;

  groupe_sanguin?: string | null;

  ville?: string | null;

  quartier?: string | null;

  is_global?: boolean;

  is_read?: boolean;

  centre_id?: number | null;

  utilisateur_id?: number;

  created_by?: number | null;

  date_creation: string;

  centre?: Centre | null;

  creator?: AlertCreator | null;
}

export interface CreateAlertPayload {
  titre: string;

  message: string;

  type: AlertType;

  groupe_sanguin?: string;

  ville?: string;

  quartier?: string;

  centre_id?: number;

  is_global?: boolean;
}

export interface UpdateAlertPayload {
  titre?: string;

  message?: string;

  type?: AlertType;

  groupe_sanguin?: string;

  ville?: string;

  quartier?: string;

  centre_id?: number;

  is_global?: boolean;
}
