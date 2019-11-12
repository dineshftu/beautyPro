import { Injectable } from '@angular/core';
import { BaseDataService } from '../core/services/base-data.service';
import { Observable } from 'rxjs';
import { Appointments } from './appointments.model';


@Injectable()
export class AppointmentsService {

  private apiAppointmentUrl = '/appointments';

  constructor(
    private baseDataService: BaseDataService
  ) { }

  public getAppointmenttList(): Observable<Array<Appointments>> {
    return this.baseDataService.makeGetCall(`${this.apiAppointmentUrl}`);
  }

  public getAppointment(treatmentId: number): Observable<Appointments> {
    return this.baseDataService.makeGetCall(`${this.apiAppointmentUrl}/${treatmentId}`);
  }

  public addNewAppointment(body: Appointments): Observable<Appointments> {
    return this.baseDataService.makePostCall(`${this.apiAppointmentUrl}`, body);
  }

  public editAppointment(body: Appointments): Observable<Appointments> {
    return this.baseDataService.makePostCall(`${this.apiAppointmentUrl}/${'edit'}`, body);
  }

}

