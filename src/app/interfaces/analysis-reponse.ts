import { ItemRequestResponse } from './item-request-response';
import { LocationHistoryResponse } from './location-history-response';

export interface AnalysisResponse {
  item: ItemRequestResponse;
  unitsSold: number;
  totalProfit: number;
  locations: LocationHistoryResponse[];
}
