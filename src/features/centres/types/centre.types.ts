export interface Centre {
    id_centre: number;
    nom: string;
    adresse?: string | null;
    ville?: string | null;
    telephone?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    created_at?: string | null;
  }
  
  export interface CentresApiResponse {
    success?: boolean;
    data?: Centre[];
  }