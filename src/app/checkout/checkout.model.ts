
export class CheckoutTreatmentRequest {
  customerId: string;
  departmentId: number;
}

export class InvoiceSaveRequest {
  customerId: string;
  departmentId: number;
  discount: number;
  treatments = new Array<InvoiceableTreatment>();
  products = new Array<InvoiceableProduct>();
  ptid:number;
  transType:string;
}

export class InvoiceableProduct {
  productId: string;
  quantity: number;
  price: number;
  productName: string;
  recomendedBy: number;
  recomendedByName: string;
  product: Products;
}

export class InvoiceableTreatment {
  treatmentName: string;
  amount: number;
  quantity: number;
  price: number;
  //discount: number;
  employeeNo: number;
  employeeName: string;
  customerScheduleTreatmentId: number;
  treatmentTypeId: number;
}

export class Products {
  itemId: string;
  itemName: string;
  description: string;
  isValid = false;
  sellingPrice: number;
  maxQty: number;
}


export class DiscountRequest {
  user: string;
  otp: string;
  discount: number;
}
