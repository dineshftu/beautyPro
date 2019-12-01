import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { Customer, CustomerSearchRequest } from 'src/app/clients/clients.model';
import { CheckoutTreatmentRequest, InvoiceableTreatment, Products, InvoiceableProduct, InvoiceSaveRequest } from '../checkout.model';
import { ClientsService } from 'src/app/clients/clients.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { AddProductComponent } from '../add-product/add-product.component';
import { CheckoutService } from '../checkout.service';
import { Employees, EmployeeFilterRequest } from 'src/app/shared/models/appointment.model';
import { AppointmentService } from 'src/app/shared/services/appointment.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  module: string;
  public customers: Customer[];
  public invoiceableTreatment = new Array<InvoiceableTreatment>();
  public invoiceableProduct = new Array<InvoiceableProduct>();
  public keyword = 'fullName';
  public checkoutTreatmentRequest = new CheckoutTreatmentRequest();
  public isEmployeeNotSelected: boolean = false;
  public employeesList: Employees[];
  public keywordEmployee = 'name';

  public invoiceSaveRequest = new InvoiceSaveRequest();
  public newInvoiceableProduct = new InvoiceableProduct();


  public treatmentSubTotal = 0;
  public treatmentNetAmount = 0;
  public treatmentDueAmount = 0;
  public discount = 0.125;
  public discountAmount = 0;
  public treatmentsTax = 0.06;
  public treatmentsTaxAmount = 0;


  public productSubTotal = 0;
  public productDueAmount = 0;
  public productsTax = 0.06;
  public productsTaxAmount = 0;

  public products: Products[];
  isProductNotSelected: boolean = false;
  public keywordProduct = 'itemName';

  constructor(
    public clientsService: ClientsService,
    public checkoutService: CheckoutService,
    private data: DataService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private appointmentService: AppointmentService,

  ) { }

  ngOnInit() {
    this.data.currentModule.subscribe(module => this.module = module);
    this.data.changeModule("Checkout");

    this.getCustomerList();
    this.getProductList();
    this.getEmployees();
  }

  addProduct() {
    // let duplicate = this.invoiceableProduct.filter(function (value: InvoiceableProduct) {
    //   return
    // });

    this.invoiceableProduct.push(this.newInvoiceableProduct);
    this.calculateProduct();

    this.newInvoiceableProduct = new InvoiceableProduct();


  }

  calculate() {
    this.treatmentSubTotal = this.invoiceableTreatment.reduce(
      (acc, ele) => acc + (ele.price * ele.quantity), 0
    );

    this.discountAmount = this.treatmentSubTotal * this.discount;
    this.treatmentNetAmount = (this.treatmentSubTotal - this.discountAmount);
    this.treatmentsTaxAmount = (this.treatmentNetAmount * this.treatmentsTax);
    this.treatmentDueAmount = (this.treatmentNetAmount + this.treatmentsTaxAmount);
  }

  calculateProduct() {
    this.productSubTotal = this.invoiceableProduct.reduce(
      (acc, ele) => acc + (ele.price * ele.quantity), 0
    );

    this.productsTaxAmount = (this.productSubTotal * this.productsTax);
    this.productDueAmount = (this.productSubTotal + this.productsTaxAmount);
  }

  getCustomerList() {
    this.clientsService
      .getCustomerList(this.createCustomerRequest())
      .subscribe((customers: Customer[]) => {
        this.customers = customers
      }, (error) => {
        this.toastr.error("Client List Loading Failed!");
      });
  }

  getProductList() {
    this.checkoutService
      .getProductList()
      .subscribe((products: Products[]) => {
        this.products = products;
        // this.newInvoiceableProduct.product = products[0];
      }, (error) => {
        this.toastr.error("Product List Loading Failed!");
      });
  }

  createCustomerRequest() {
    return <CustomerSearchRequest>{
      searchText: ''
    };
  }

  selectCustomerEvent(e: any) {
    this.checkoutTreatmentRequest.customerId = e.customerId;
    this.invoiceSaveRequest.customerId = e.customerId;
    this.getInvoiceTreatmentList();
  }

  getInvoiceTreatmentList() {
    this.checkoutService
      .getInvoiceTreatmentList(this.checkoutTreatmentRequest)
      .subscribe((treatments: InvoiceableTreatment[]) => {
        this.invoiceableTreatment = treatments;
        this.calculate();
      }, (error) => {
        this.toastr.error("Treatment List Loading Failed!");
      });
  }

  onQtyChange(event: any) {
    // this.treatmentQty = Number(event.target.value);

    // if (this.startTimespan) {
    //   this.setEndTime(this.startTimespan.split(":")[0], this.startTimespan.split(":")[1]);
    // }

  }


  getEmployees() {
    this.appointmentService
      .getFilteredEmployees(this.generateEmployeeFilterRequest())
      .subscribe((employees: Employees[]) => {
        this.employeesList = employees;
      }, (error) => {
        this.toastr.error("Therapist List Loading Failed!");
      });
  }

  private generateEmployeeFilterRequest() {
    return <EmployeeFilterRequest>{
      departmentId: 1
      // departmentId: this.departmentId
    }
  }

  numericOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 101 || charCode == 69 || charCode == 45 || charCode == 43) {
      return false;
    }
    return true;
  }

  selectEmployeeEvent(e: any) {
    this.isEmployeeNotSelected = false;
    this.newInvoiceableProduct.recomendedBy = e.empno;
    this.newInvoiceableProduct.recomendedByName = e.name;
  }

  selectProductEvent(e: any) {
    this.isProductNotSelected = false;
    this.newInvoiceableProduct.productId = e.itemId;
    this.newInvoiceableProduct.productName = e.itemName;
    this.newInvoiceableProduct.price = e.sellingPrice;
  }


  addProductPop() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = Object.assign([], this.products);
    this.dialog.open(AddProductComponent, dialogConfig).afterClosed().subscribe(
      (response) => {
        if (response != undefined && !!response.data)
          this.products = response.data;
        // console.log(response);
      }, (error) => {
        console.log(error);
      }
    );
  }
}
