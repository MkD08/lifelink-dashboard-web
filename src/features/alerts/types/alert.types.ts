export type AlertType = "urgent" | "warning" | "info";

export interface Centre {
  id_centre: number;
  nom: string;
  ville: string;
}

export interface Alert {
  id_alerte: number;
  titre: string;
  message: string;
  type: AlertType;
  groupe_sanguin: string;
  ville: string;
  date_creation: string;
  centre?: Centre;
}
export interface CreateAlertPayload {
    titre: string;
    message: string;
    type: AlertType;
    groupe_sanguin: string;
    ville: string;
    centre_id?: number;
  }

  