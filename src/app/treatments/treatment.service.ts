import { Injectable } from '@angular/core';
import { BaseDataService } from '../core/services/base-data.service';
import { Observable } from 'rxjs';
import { Treatments } from './treatments.model';


@Injectable()
export class TreatmentService {

  private apiTreatmentUrl = '/treatments';

  constructor(
    private baseDataService: BaseDataService
  ) { }

  public getTreatmentList(): Observable<Array<Treatments>> {
    return this.baseDataService.makeGetCall(`${this.apiTreatmentUrl}`);
  }

  public getTreatment(treatmentId: number): Observable<Treatments> {
    return this.baseDataService.makeGetCall(`${this.apiTreatmentUrl}/${treatmentId}`);
  }

  public addNewTreatment(body: Treatments): Observable<Treatments> {
    return this.baseDataService.makePostCall(`${this.apiTreatmentUrl}`, body);
  }

  public editTreatment(body: Treatments): Observable<Treatments> {
    return this.baseDataService.makePostCall(`${this.apiTreatmentUrl}/${'edit'}`, body);
  }

}
