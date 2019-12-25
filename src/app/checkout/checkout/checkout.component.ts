import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
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
import { Department } from 'src/app/shared/models/department.model';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AddDiscountComponent } from '../add-discount/add-discount.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, AfterViewInit, OnDestroy {
  private ngUnSubscription = new Subject();

  public user: any;
  public isSuperUser: boolean = false;
  public selectedCustomer: Customer;

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
  public discount = 0;
  public discountAmount = 0;
  public treatmentsTax = 0.06;
  public treatmentsTaxAmount = 0;


  public productSubTotal = 0;
  public productDueAmount = 0;
  public productsTax = 0.06;
  public productsTaxAmount = 0;

  public productName;
  public therapistName;

  departments: Department[];
  selectedDepartment;


  constructor(
    public clientsService: ClientsService,
    public checkoutService: CheckoutService,
    private data: DataService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private appointmentService: AppointmentService,
    private departmentService: DepartmentService,
    private route: Router,
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.data.currentModule.subscribe(module => this.module = module);
    this.data.changeModule("Checkout");

    this.isSuperUser = (this.user.userType == "GeneralManager" || this.user.userType == "SystemAdmin" || this.user.userType == "Director");

    setTimeout(() => {
      this.getProductList();
      this.getEmployees();
    }, 0);


    if (!this.selectedDepartment && this.isSuperUser) {
      this.toastr.error("Please Select a Department!");
    } else {
      this.getCustomerList();
    }
  }

  addProduct(isFormValid: boolean) {
    if (!this.isCustomerNotSelected) {
      if (isFormValid && this.validateAddProduct()) {
        if (this.checkProductExist()) {
          this.invoiceableProduct.push(this.newInvoiceableProduct);
          this.calculateProduct();
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

    this.discountAmount = this.treatmentSubTotal * (this.discount / 100.00);
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

    if (!this.selectedDepartment && this.isSuperUser) {
      this.toastr.error("Please Select a Department!");
      return;
    }

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
      searchText: '',
      departmentId: this.selectedDepartment
    };
  }

  selectCustomerEvent(e: any) {
    this.checkoutTreatmentRequest.customerId = e.customerId;
    this.checkoutTreatmentRequest.departmentId = this.selectedDepartment;
    this.invoiceSaveRequest.customerId = e.customerId;
    this.invoiceSaveRequest.departmentId = this.selectedDepartment;
    this.getInvoiceTreatmentList();
  }

  saveInvoice() {
    if (!this.selectedDepartment && this.isSuperUser && this.invoiceableTreatment.length > 0) {
      this.toastr.error("Please Select a Customer!");
      return;
    }

    this.invoiceSaveRequest.products = this.invoiceableProduct;
    this.invoiceSaveRequest.treatments = this.invoiceableTreatment;
    this.invoiceSaveRequest.discount = this.discount;

    this.checkoutService
      .saveInvoice(this.invoiceSaveRequest)
      .subscribe((response: any[]) => {
        this.toastr.success("Invoice Saved!");
        this.route.navigate(['home/checkout']);
      }, (error) => {
        this.toastr.error("Invoice Failed!");
      });
  }

  getInvoiceTreatmentList() {

    if (!this.selectedDepartment && this.isSuperUser) {
      this.toastr.error("Please Select a Department!");
      return;
    }

    this.checkoutService
      .getInvoiceTreatmentList(this.checkoutTreatmentRequest)
      .subscribe((treatments: InvoiceableTreatment[]) => {
        this.invoiceableTreatment = treatments;
        this.isCustomerNotSelected = false;
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


  addDiscount() {
    if (!this.isCustomerNotSelected) {

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.data = { isAdmin: this.isSuperUser };

      // dialogConfig.data = Object.assign([], this.products);
      this.dialog.open(AddDiscountComponent, dialogConfig).afterClosed().subscribe(
        (response) => {
          if (response.discount) {
            console.log(response.discount);

            this.discount = response.discount;
            this.calculate();
            console.log(this.discount);

          }
          // console.log(response);
        }, (error) => {
          console.log(error);
        }
      );

    } else {
      this.toastr.warning("Select a customer available for invoicing!");
    }
  }

  onDepartmentChange(e: any) {
    this.selectedDepartment = e.target.value;

    if (!this.selectedDepartment && this.isSuperUser) {
      this.toastr.error("Please Select a Department!");
    } else {
      this.getCustomerList();
      this.isCustomerNotSelected = true;
      this.invoiceableTreatment = new Array<InvoiceableTreatment>();
      this.invoiceableProduct = new Array<InvoiceableProduct>();
      this.selectedCustomer = null;
      this.treatmentSubTotal = 0;
      this.treatmentNetAmount = 0;
      this.treatmentDueAmount = 0;
      this.discount = 0;
      this.discountAmount = 0;
      this.treatmentsTax = 0.06;
      this.treatmentsTaxAmount = 0;


      this.productSubTotal = 0;
      this.productDueAmount = 0;
      this.productsTax = 0.06;
      this.productsTaxAmount = 0;
    }
  }


  ngAfterViewInit() {
    this.departmentService
      .getAllDepartments()
      .pipe(takeUntil(this.ngUnSubscription))
      .subscribe((departments: Department[]) => {
        this.departments = departments;
      })
  }


  ngOnDestroy() {
    this.ngUnSubscription.next(true);
    this.ngUnSubscription.complete();
  }
}
