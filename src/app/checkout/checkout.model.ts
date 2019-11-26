
export class CheckoutTreatmentRequest {
  customerId: string;
  departmentId: number;
}

export class InvoiceSaveRequest {
  customerId: string;
  departmentId: number;
  treatments: InvoiceableTreatment[];
  products: InvoiceableProduct[];
}

export class InvoiceableProduct {
  productId: string;
  quantity: number;
  price: number;
  recomendedBy: number;
}

export class InvoiceableTreatment {
  treatmentName: string;
  amount: number;
  quantity: number;
  price: number;
  //discount: number;
  employeeNo: number;
  employeeName: string;
}
