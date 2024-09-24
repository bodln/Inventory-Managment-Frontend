import { ItemRequestResponse } from "./item-request-response";
import { UserData } from "./user-data";

export interface ShipmentOrderResponse {
    guid: string;
    item: ItemRequestResponse;
    quantity: number;
    manager: UserData;
    dateOfCreation: Date;
    dateOfArrival: Date;
    price: number;
    unloaded: boolean;
}
