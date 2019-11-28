import { Injectable } from '@angular/core';
import { BaseDataService } from '../core/services/base-data.service';
import { CheckoutTreatmentRequest, InvoiceableTreatment, Products } from './checkout.model';
import { Observable } from 'rxjs';

@Injectable()
export class CheckoutService {

  private apiInvoiceUrl = 'invoice';
  private apiProductUrl = 'products';

  constructor(
    private baseDataService: BaseDataService
  ) { }

  public getInvoiceTreatmentList(request: CheckoutTreatmentRequest): Observable<Array<InvoiceableTreatment>> {
    let queryString = `customerId=${request.customerId}`;
    return this.baseDataService.makeGetCall(`${this.apiInvoiceUrl}${'/treatments'}?${queryString}`);
  }

  public getProductList(): Observable<Array<Products>> {
    return this.baseDataService.makeGetCall(`${this.apiProductUrl}`);
  }

}
