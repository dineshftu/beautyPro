export class Vouchers {
  gvinvoiceNo: string;
  customerName: string;
  enteredBy: string;
  enteredDate: Date;
  isRedeem: boolean;
  isCanceled: boolean;
  dueAmount: number;
  status: string;
}

export interface VoucherFilterRequest {
  status: number;
}

export class NewVoucherRequest {
  customerId: string;
  voucherNo: string;
  dueAmount: number;
  ptid: number;
  ttid: number;
}

export interface PaymentType {
  ptid: number;
  ptname: string;
}
