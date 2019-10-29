import { Injectable } from '@angular/core';
import { BaseDataService } from '../core/services/base-data.service';
import { Observable } from 'rxjs';
import { Clients } from './clients.model';

@Injectable()
export class ClientsService {
  private apiClientsUrl = 'clients';

  constructor(
    private baseDataService: BaseDataService
  ) { }

  public getTreatmentList(): Observable<Array<Clients>> {
    return this.baseDataService.makeGetCall(`${this.apiClientsUrl}`);
  }

  public getTreatment(treatmentId: number): Observable<Clients> {
    return this.baseDataService.makeGetCall(`${this.apiClientsUrl}/${treatmentId}`);
  }

  public addNewTreatment(body: Clients): Observable<Clients> {
    return this.baseDataService.makePostCall(`${this.apiClientsUrl}`, body);
  }

  public editTreatment(body: Clients): Observable<Clients> {
    return this.baseDataService.makePostCall(`${this.apiClientsUrl}/${'edit'}`, body);
  }
}
