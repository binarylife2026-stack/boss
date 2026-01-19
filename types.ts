
export interface PredictionItem {
  marketName: string;
  probability: number;
  explanation: string;
}

export interface CategoryData {
  categoryName: string;
  items: PredictionItem[];
}

export interface MatchAnalysisResponse {
  matchInfo: {
    homeTeam: string;
    awayTeam: string;
    predictionConfidence: string;
    summary: string;
  };
  categories: CategoryData[];
}

export enum AnalyticsState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
