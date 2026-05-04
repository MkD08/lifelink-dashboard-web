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