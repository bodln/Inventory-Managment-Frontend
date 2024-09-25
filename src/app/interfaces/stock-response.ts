import { ItemRequestResponse } from './item-request-response';

export interface StockResponse {
  item: ItemRequestResponse;
  avilableAmount: number;
  overCapacity: boolean;
  underCapacity: boolean;
  moreInStorage: boolean;
}
