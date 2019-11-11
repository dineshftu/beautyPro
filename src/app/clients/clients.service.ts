import { Injectable } from '@angular/core';
import { BaseDataService } from '../core/services/base-data.service';
import { Observable } from 'rxjs';
import { Customer, CustomerSearchRequest } from './clients.model';

@Injectable()
export class ClientsService {
  private apiClientsUrl = 'customers';

  constructor(
    private baseDataService: BaseDataService
  ) { }

  public getCustomerList(request: CustomerSearchRequest): Observable<Array<Customer>> {
    let queryString = `searchText=${request.searchText}`;
    return this.baseDataService.makeGetCall(`${this.apiClientsUrl}?${queryString}`);
  }

  public getTreatment(treatmentId: number): Observable<Customer> {
    return this.baseDataService.makeGetCall(`${this.apiClientsUrl}/${treatmentId}`);
  }

  public addNewCustomer(body: Customer): Observable<Customer> {
    return this.baseDataService.makePostCall(`${this.apiClientsUrl}`, body);
  }

  public editTreatment(body: Customer): Observable<Customer> {
    return this.baseDataService.makePostCall(`${this.apiClientsUrl}/${'edit'}`, body);
  }
}
