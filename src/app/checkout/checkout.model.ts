
export class CheckoutTreatmentRequest {
  CustomerId: string;
  DepartmentId: number;
}

export class InvoiceSaveRequest {
  CustomerId: string;
  DepartmentId: number;
  Treatments: InvoiceableTreatment[];
  Products: InvoiceableProduct[];
}

export class InvoiceableProduct {
  ProductId: string;
  Quantity: number;
  Price: number;
  RecomendedBy: number;
}

export class InvoiceableTreatment {
  CustomerScheduleTreatmentId: number;
  TreatmentTypeId: number;
  Quantity: number;
  Price: number;
  Discount: number;
  EmployeeNo: number;
}
