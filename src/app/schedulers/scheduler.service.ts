import { Injectable } from '@angular/core';
import { BaseDataService } from '../core/services/base-data.service';
import { Observable } from 'rxjs';
import { ScheduleResponse, SchedulerFilterRequest } from './scheduler.model';

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {

  //private apiTreatmentUrl = 'http://localhost:3000/shedules';
  private apiSchedulerUrl = 'schedulers';

  constructor(
    private baseDataService: BaseDataService
  ) { }

  public getFilteredScheduleList(request: SchedulerFilterRequest): Observable<Array<ScheduleResponse>> {
    let queryString = `departmentId=${request.departmentId}`;
    return this.baseDataService.makeGetCall(`${this.apiSchedulerUrl}${'/filter'}?${queryString}`);
    // return this.baseDataService.makeGetCallTemp(`${this.apiTreatmentUrl}`);
  }

}
