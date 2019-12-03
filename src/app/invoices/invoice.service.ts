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
    let queryString = `departmentId=${request.departmentId}`;
    return this.baseDataService.makeGetCall(`${this.apiInvoiceUrl}?${queryString}`);
  }

  public getInvoice(request: string): Observable<Invoices> {
    let queryString = `invoiceNo=${request}`;
    return this.baseDataService.makeGetCall(`${this.apiInvoiceUrl}${'/details'}?${queryString}`);
  }
}
