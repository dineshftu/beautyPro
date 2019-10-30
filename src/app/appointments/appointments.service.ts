import { Injectable } from '@angular/core';
import { BaseDataService } from '../core/services/base-data.service';
import { Observable } from 'rxjs';
import { Appointments } from './appointments.model';


@Injectable()
export class AppointmentsService {

  private apiTreatmentUrl = 'appointments';

  constructor(
    private baseDataService: BaseDataService
  ) { }

  public getAppointmenttList(): Observable<Array<Appointments>> {
    return this.baseDataService.makeGetCall(`${this.apiTreatmentUrl}`);
  }

  public getTreatment(treatmentId: number): Observable<Appointments> {
    return this.baseDataService.makeGetCall(`${this.apiTreatmentUrl}/${treatmentId}`);
  }

  public addNewTreatment(body: Appointments): Observable<Appointments> {
    return this.baseDataService.makePostCall(`${this.apiTreatmentUrl}`, body);
  }

  public editTreatment(body: Appointments): Observable<Appointments> {
    return this.baseDataService.makePostCall(`${this.apiTreatmentUrl}/${'edit'}`, body);
  }

}

