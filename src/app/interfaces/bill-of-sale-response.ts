import { ItemRequestResponse } from "./item-request-response";
import { UserData } from "./user-data";

export interface BillOfSaleResponse {
    guid: string;
    item: ItemRequestResponse;
    quantity: number;
    warehouseman: UserData;
    dateOfSale: Date;
    nameOfBuyer: string;
    contactInfo: string;
    deliveryAddress: string;
}
