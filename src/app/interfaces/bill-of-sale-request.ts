export interface BillOfSaleRequest {
    itemGUID: string; 
    quantity: number;
    dateOfSale: Date; 
    nameOfBuyer: string;
    contactInfo: string;
    deliveryAddress: string;
}
