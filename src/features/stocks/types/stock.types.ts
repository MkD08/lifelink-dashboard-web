export interface BloodStock {
    id?: number;
    centre_id?: number | null;
    groupe_sanguin: string;
    quantite: number;
    centre_nom?: string | null;
    ville?: string | null;
  }
  
  export interface StocksApiResponse {
    success?: boolean;
    data?: BloodStock[];
  }