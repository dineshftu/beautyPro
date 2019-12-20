import { Injectable } from '@angular/core';
import { BaseDataService } from '../core/services/base-data.service';
import { InvoiceFilterRequest, Invoices } from './invoices.model';
import { Observable } from 'rxjs';

@Injectable()
export class InvoiceService {
  private apiInvoiceUrl = 'invoice';

  constructor(
    private baseDataService: BaseDataService
  ) { }

  public getFilteredInvoiceList(request: InvoiceFilterRequest): Observable<Array<Invoices>> {
    let queryString =`request=${request}` ;
    return this.baseDataService.makeGetCall(`${this.apiInvoiceUrl}/filter/?${queryString}`);
  }

  public getInvoice(request: string): Observable<Invoices> {
    let queryString = `invoiceNo=${request}`;
    return this.baseDataService.makeGetCall(`${this.apiInvoiceUrl}${'/details'}?${queryString}`);
  }
  public cancelInvoice(invoice:Invoices): Observable<Invoices> {
    let queryString=`invoiceNo=${invoice.invoiceNo}`
    return this.baseDataService.makePostCall(`${this.apiInvoiceUrl}/${'cancel'}?${queryString}`, invoice);

  }
}
