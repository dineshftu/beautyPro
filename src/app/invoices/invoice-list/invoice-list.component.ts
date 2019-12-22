import { Component, OnInit } from '@angular/core';
import { Invoices, InvoiceFilterRequest } from '../invoices.model';
import { Subject } from 'rxjs';
import { Department } from 'src/app/shared/models/department.model';
import { InvoiceService } from '../invoice.service';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DataService } from 'src/app/core/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { InvoiceViewComponent } from '../invoice-view/invoice-view.component';
import { DiologBoxComponent } from 'src/app/shared/components/diolog-box/diolog-box.component';
import { HelperService } from 'src/app/core/services/helper.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})

export class InvoiceListComponent implements OnInit {
  module: string;
  invoiceList: Invoices[];
  selectedDepartment = 0;
  private ngUnSubscription = new Subject();
  departments: Department[];
  date: string;
  status: number;

  public user: any;
  public isSuperUser: boolean = false;

  constructor(
    private invoiceService: InvoiceService,
    private departmentService: DepartmentService,
    private route: Router,
    public dialog: MatDialog,
    private data: DataService,
    private toastr: ToastrService,
    private helperService: HelperService,
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngAfterViewInit() {
    this.departmentService
      .getAllDepartments()
      .pipe(takeUntil(this.ngUnSubscription))
      .subscribe((departments: Department[]) => {
        this.departments = departments;
      })
  }

  ngOnInit() {
    this.isSuperUser = (this.user.userType == "GeneralManager" || this.user.userType == "SystemAdmin" || this.user.userType == "Director");
    this.date = this.helperService.formatDate(new Date().toISOString(), 'yyyy-mm-dd');//set current date as initial date
    this.status = 1;//default value

    if (!this.selectedDepartment && this.isSuperUser) {
      this.toastr.error("Please Select a Department!");
    } else {
      this.loadInvoices();
    }

    this.data.currentModule.subscribe(module => this.module = module);
    this.data.changeModule("Invoices");
  }


  onDepartmentChange(e: any) {
    this.selectedDepartment = e.target.value;
    if (!this.selectedDepartment && this.isSuperUser) {
      this.toastr.error("Please Select a Department!");
    } else {
      this.loadInvoices();
    }
  }
  onDateChange(e) {

    this.date = this.helperService.formatDate(new Date(e.target.value).toISOString(), 'yyyy-mm-dd');
    if (!this.selectedDepartment && this.isSuperUser) {
      this.toastr.error("Please Select a Department!");
    } else {
      this.loadInvoices();
    }
  }

  loadInvoices() {
    console.log(this.date);
    this.invoiceService
      .getFilteredInvoiceList(this.generateInvoiceFilterRequest())
      .subscribe((invoices: Invoices[]) => {
        this.invoiceList = invoices;
      }, (error) => {
        this.toastr.error("Invoice List Loading Failed!");
      }
      );

  }

  private generateInvoiceFilterRequest() {
    return <InvoiceFilterRequest>{
      departmentId: this.selectedDepartment,
      date: this.date,
      status: this.status
    }
  }

  viewInvoice(invoice: Invoices) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { invoiceNo: invoice.invoiceNo };
    this.dialog.open(InvoiceViewComponent, dialogConfig).afterClosed().subscribe(
      (response) => {
        //console.log(response);
        if (!!response) {
          if (response.message == 'success') {
            this.route.navigate(['home/invoices']);
          }
        }
      }, (error) => {
        console.log(error);
      }
    );
  }
  cancelInvoice(invoice: Invoices) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = 'Are you sure you want to cancel?';
    // dialogConfig.width = "20%";
    this.dialog.open(DiologBoxComponent, dialogConfig).afterClosed().subscribe(
      (response) => {
        if (response.message) {
          this.invoiceService
            .cancelInvoice(invoice)
            .subscribe((invoices: Invoices) => {
              this.toastr.success("Invoiced Cancelled", "Success");
            }, (error) => {
              this.toastr.error("Invoice cancel Failed!");
            });
        }
      }, (error) => {
        console.log(error);
      }
    );
  }
}

