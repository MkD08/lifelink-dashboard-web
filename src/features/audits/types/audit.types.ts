export interface AuditLog {
    id_journal: number;
    id_utilisateur: number | null;
    action: string;
    description: string | null;
    id_admin: number | null;
    date_action: string;
  
    utilisateur?: {
      id_utilisateur: number;
      nom: string | null;
      prenom: string | null;
      centre_id: number | null;
      role_id: number;
    } | null;
  }