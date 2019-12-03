import { DateTime } from 'luxon';

export class Invoices {
  invoiceNo: string;
  customerFullName: string;
  invoiceDate: DateTime;
  tax: number;
  subTotal: number;
  discount: number;
  dueAmount: number;
  invoiceProduct: InvoiceProduct[];
  invoiceTreatment: InvoiceTreatment[];
}

export interface InvoiceProduct {
  cipid: number;
  invoiceNo: string;
  productId: string;
  productName: number;
  empno: number;
  recomendedBy: string;
  price: number;
  cost: number;
  qty: number;
}

export interface InvoiceTreatment {
  citid: number;
  invoiceNo: string;
  treatmentTypeName: string;
  ttid: number;
  empno: number;
  employeeName: string;
  price: number;
  cost: number;
  qty: number;
  cstid: number;
}

export interface InvoiceFilterRequest {
  departmentId: number;
}

