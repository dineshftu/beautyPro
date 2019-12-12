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

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})

export class InvoiceListComponent implements OnInit {
  module: string;
  invoiceList: Invoices[];
  public selectedDepartment = 1;
  private ngUnSubscription = new Subject();
  departments: Department[];

  constructor(
    private invoiceService: InvoiceService,
    private departmentService: DepartmentService,
    private route: Router,
    public dialog: MatDialog,
    private data: DataService,
    private toastr: ToastrService
  ) { }

  ngAfterViewInit() {
    this.departmentService
      .getAllDepartments()
      .pipe(takeUntil(this.ngUnSubscription))
      .subscribe((departments: Department[]) => {
        this.departments = departments;
      })
  }

  ngOnInit() {
    this.loadInvoices();
    this.data.currentModule.subscribe(module => this.module = module);
    this.data.changeModule("Invoices");
  }


  onDepartmentChange(e: any) {
    this.selectedDepartment = e.target.value;
    this.loadInvoices();
  }

  loadInvoices() {
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
      departmentId: this.selectedDepartment
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
  cancelInvoice() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = 'Are you sure you want to cancel?';
    // dialogConfig.width = "20%";
    this.dialog.open(DiologBoxComponent, dialogConfig).afterClosed().subscribe(
      (response) => {
        if (response.message) {
          this.toastr.warning("still developing server api part");
        }
      }, (error) => {
        console.log(error);
      }
    );
  }
}

