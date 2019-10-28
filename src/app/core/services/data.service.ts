import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private moduleSource = new BehaviorSubject('Fuck');
  currentModule = this.moduleSource.asObservable();

  constructor() { }

  changeModule(module: string) {
    this.moduleSource.next(module);
  }

}
