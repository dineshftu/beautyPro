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
import { DiologBoxComponent } from 'src/app/shared/components/diolog-box/diolog-box.component';

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
  public isEmployeeNotSelected: boolean = true;
  public isCustomerNotSelected: boolean = true;
  public employeesList: Employees[];
  public keywordEmployee = 'name';

  public products: Products[];
  isNotValidQty: boolean = true;
  isProductNotSelected: boolean = true;
  isProductNotDuplicated: boolean = true;
  public keywordProduct = 'itemName';

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

  public productName;
  public therapistName;

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

    setTimeout(() => {
      this.getCustomerList();
      this.getProductList();
      this.getEmployees();
    }, 0);
  }

  addProduct(isFormValid: boolean) {
    if (!this.isCustomerNotSelected) {
      if (isFormValid && this.validateAddProduct()) {
        if (this.checkProductExist()) {
          this.invoiceableProduct.push(this.newInvoiceableProduct);
          this.newInvoiceableProduct = new InvoiceableProduct();
          this.therapistName = null;
          this.productName = null;
        } else {
          this.toastr.warning("Product is already in list");
        }
      } else {
        this.toastr.warning("Please fill required field");
      }
    } else {
      this.validateAddProduct();
      this.toastr.warning("Select a customer available for invoicing!");
    }
  }
  checkProductExist() {
    var i = this.invoiceableProduct.findIndex(
      product => product.productId == this.newInvoiceableProduct.productId
    );

    if (i != -1)
      return false
    return true;
  }

  validateAddProduct(): boolean {
    let isValid = true;
    if (!this.newInvoiceableProduct.recomendedBy) {
      this.isEmployeeNotSelected = true;
      isValid = false;
    } else {
      this.isEmployeeNotSelected = false;
    }

    if (!this.newInvoiceableProduct.quantity) {
      this.isNotValidQty = true;
      isValid = false;
    } else {
      if (this.newInvoiceableProduct.quantity <= 0) {
        isValid = false;
        this.isNotValidQty = true;

      } else {
        this.isNotValidQty = false;
      }
    }

    return isValid;

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

  removeProduct(index: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = 'Do you want to remove ' + this.invoiceableProduct[index].productName + '?';
    this.dialog.open(DiologBoxComponent, dialogConfig).afterClosed().subscribe(
      (response) => {
        if (response.message) {
          this.products.push(this.invoiceableProduct[index].product);
          this.invoiceableProduct.splice(index, 1);
          this.toastr.success('Removed!');
          this.calculateProduct();
        }
      }, (error) => {
        console.log(error);
      }
    );
  }

  getCustomerList() {
    this.clientsService
      .getScheduleCustomerList(this.createCustomerRequest())
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
    if (this.invoiceableTreatment.length > 0) {
      this.isCustomerNotSelected = false;
    }
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

  onQtyChange(event: any) {
    if (this.newInvoiceableProduct.quantity) {

    }

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
