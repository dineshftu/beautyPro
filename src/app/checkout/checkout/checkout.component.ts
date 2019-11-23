import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { Customer, CustomerSearchRequest } from 'src/app/clients/clients.model';
import { CheckoutTreatmentRequest } from '../checkout.model';
import { ClientsService } from 'src/app/clients/clients.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { AddProductComponent } from '../add-product/add-product.component';

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

  public treatments = ['sf', 'sf', 'sdfs', 'sdf', 'sdfs'];

  constructor(
    public clientsService: ClientsService,
    private data: DataService,
    private toastr: ToastrService,
    public dialog: MatDialog,
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
  addProduct() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    // dialogConfig.data = ;
    this.dialog.open(AddProductComponent, dialogConfig).afterClosed().subscribe(
      (response) => {
        console.log(response);
      }, (error) => {
        console.log(error);
      }
    );
  }
}
