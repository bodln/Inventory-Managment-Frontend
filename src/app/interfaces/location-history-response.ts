import { InventoryResponse } from "./inventory-response";
import { UserData } from "./user-data";

export interface LocationHistoryResponse {
    dateOfStoring: Date;
    warehouseman: UserData;
    inventory: InventoryResponse;
    locationName: string;
  }
  