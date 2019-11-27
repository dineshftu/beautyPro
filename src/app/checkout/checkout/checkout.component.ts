import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { Customer, CustomerSearchRequest } from 'src/app/clients/clients.model';
import { CheckoutTreatmentRequest, InvoiceableTreatment, Products } from '../checkout.model';
import { ClientsService } from 'src/app/clients/clients.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { AddProductComponent } from '../add-product/add-product.component';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  module: string;
  public customers: Customer[];
  public invoiceableTreatment: InvoiceableTreatment[];
  public keyword = 'fullName';
  public checkoutTreatmentRequest = new CheckoutTreatmentRequest();
  public treatmentSubTotal = 0;
  public treatmentNetAmount = 0;
  public treatmentDueAmount = 0;
  public discount = 100;
  public treatmentsTax = 0.06;
  public treatmentsTaxAmount = 0;

  public treatments = ['sf', 'sf', 'sdfs', 'sdf', 'sdfs'];
  public products: Products[];

  constructor(
    public clientsService: ClientsService,
    public checkoutService: CheckoutService,
    private data: DataService,
    private toastr: ToastrService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.data.currentModule.subscribe(module => this.module = module);
    this.data.changeModule("Checkout");
    this.getCustomerList();
  }

  calculate() {
    this.treatmentSubTotal = this.invoiceableTreatment.reduce(
      (acc, ele) => acc + (ele.price * ele.quantity), 0
    );

    this.treatmentNetAmount = (this.treatmentSubTotal - this.discount);
    this.treatmentsTaxAmount = (this.treatmentNetAmount * this.treatmentsTax);
    this.treatmentDueAmount = (this.treatmentNetAmount - this.treatmentsTaxAmount);
  }

  getCustomerList() {
    this.clientsService
      .getCustomerList(this.createCustomerRequest())
      .subscribe((customers: Customer[]) => {
        this.customers = customers
      });
  }

  getProductList() {
    this.checkoutService
      .getProductList()
      .subscribe((products: Products[]) => {
        this.products = products
      });
  }

  createCustomerRequest() {
    return <CustomerSearchRequest>{
      searchText: ''
    };
  }

  selectCustomerEvent(e: any) {
    this.checkoutTreatmentRequest.customerId = e.customerId;
    this.getInvoiceTreatmentList();
  }

  getInvoiceTreatmentList() {
    this.checkoutService
      .getInvoiceTreatmentList(this.checkoutTreatmentRequest)
      .subscribe((treatments: InvoiceableTreatment[]) => {
        this.invoiceableTreatment = treatments;
        this.calculate();
      });
  }

  addProduct() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = Object.assign([], this.products);
    this.dialog.open(AddProductComponent, dialogConfig).afterClosed().subscribe(
      (response) => {
        if (response!=undefined&&!!response.data)
          this.products = response.data;
        // console.log(response);
      }, (error) => {
        console.log(error);
      }
    );
  }
}
