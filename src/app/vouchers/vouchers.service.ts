import { Injectable } from '@angular/core';
import { BaseDataService } from '../core/services/base-data.service';
import { Observable } from 'rxjs';
import { Vouchers } from './vouchers.model';


@Injectable()
export class VouchersService {

  private apiTreatmentUrl = 'vouchers';

  constructor(
    private baseDataService: BaseDataService
  ) { }

  public getVoucherList(): Observable<Array<Vouchers>> {
    return this.baseDataService.makeGetCall(`${this.apiTreatmentUrl}`);
  }

  public getTreatment(treatmentId: number): Observable<Vouchers> {
    return this.baseDataService.makeGetCall(`${this.apiTreatmentUrl}/${treatmentId}`);
  }

  public addNewTreatment(body: Vouchers): Observable<Vouchers> {
    return this.baseDataService.makePostCall(`${this.apiTreatmentUrl}`, body);
  }

  public editTreatment(body: Vouchers): Observable<Vouchers> {
    return this.baseDataService.makePostCall(`${this.apiTreatmentUrl}/${'edit'}`, body);
  }

}
