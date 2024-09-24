import { ItemRequestResponse } from './item-request-response'; 

export interface InventoryResponse {
  guid: string;
  item: ItemRequestResponse; 
  availableAmount: number;
  lastShipment: Date;
  currentLocationName: string;
}
