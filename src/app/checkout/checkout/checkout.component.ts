import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { Customer, CustomerSearchRequest } from 'src/app/clients/clients.model';
import { CheckoutTreatmentRequest } from '../checkout.model';
import { ClientsService } from 'src/app/clients/clients.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  module: string;
  public customers: Customer[];
  public keyword = 'fullName';
  public checkoutTreatmentRequest = new CheckoutTreatmentRequest();

  constructor(
    public clientsService: ClientsService,
    private data: DataService
  ) { }

  ngOnInit() {
    this.data.currentModule.subscribe(module => this.module = module);
    this.data.changeModule("Checkout");
    this.getCustomerList();
  }

  getCustomerList() {
    this.clientsService
      .getCustomerList(this.createCustomerRequest())
      .subscribe((customers: Customer[]) => {
        this.customers = customers
      });
  }

  createCustomerRequest() {
    return <CustomerSearchRequest>{
      searchText: ''
    };
  }

  selectCustomerEvent(e: any) {
    this.checkoutTreatmentRequest.customerId = e.customerId;

  }
}
