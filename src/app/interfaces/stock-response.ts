import { ItemRequestResponse } from './item-request-response';

export interface StockResponse {
  item: ItemRequestResponse;
  availableAmount: number;
  overCapacity: boolean;
  underCapacity: boolean;
  moreInStorage: boolean;
}
