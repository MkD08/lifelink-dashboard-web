// ==============================
// Types notifications
// ==============================

// ==============================
// Types possibles
// ==============================

export type NotificationType =
  | "info"
  | "warning"
  | "urgent"
  | "DEMANDE_SANG"
  | "PARTICIPATION_DEMANDE";

// ==============================
// Notification
// ==============================

export interface Notification {

  id_notification: number;

  utilisateur_id?: number | null;

  centre_id?: number | null;

  titre?: string | null;

  message: string;

  type: NotificationType;

  lu: boolean;

  is_global?: boolean;

  ville?: string | null;

  quartier?: string | null;

  target_role?: number | null;

  created_by?: number | null;

  date_creation: string;
}

// ==============================
// Réponse API
// ==============================

export interface NotificationsApiResponse {

  success: boolean;

  data: Notification[];
}