export interface AdminStatistics {
    totalCentres: number;
    totalDonors: number;
    totalDons: number;
    totalDemandes: number;
    totalCollectes: number;
    totalAlertes: number;
    totalParticipations: number;
    totalStock: number;
  }
  
  export interface CentreStatistics {
    totalDonors: number;
    verifiedUsers: number;
    totalDons: number;
    totalDemandes: number;
    totalCollectes: number;
    totalAlertes: number;
    totalParticipations: number;
    totalStock: number;
  }
  
  export type StatisticsData =
    | AdminStatistics
    | CentreStatistics;