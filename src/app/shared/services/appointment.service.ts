import { Injectable } from '@angular/core';
import { BaseDataService } from 'src/app/core/services/base-data.service';
import { NewAppointmentRequest } from '../models/appointment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private apiAppointmentUrl = 'appointments';

    constructor(
    private baseDataService: BaseDataService
  ) { }

  public addNewAppointment(request: NewAppointmentRequest): Observable<any> {
    return this.baseDataService.makePostCall(`${this.apiAppointmentUrl}`, request);
  }
}
