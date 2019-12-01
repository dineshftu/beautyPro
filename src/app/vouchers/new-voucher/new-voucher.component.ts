import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { VouchersService } from '../vouchers.service';
import { ClientsService } from '../../clients/clients.service';
import { Customer, CustomerSearchRequest, Client } from 'src/app/clients/clients.model';
import { NewVoucherRequest, PaymentType } from '../vouchers.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Treatment, TreatmentFilterRequest } from 'src/app/treatments/treatments.model';
import { TreatmentService } from '../../treatments/treatment.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-voucher',
  templateUrl: './new-voucher.component.html',
  styleUrls: ['./new-voucher.component.scss']
})

export class NewVoucherComponent implements OnInit {

  private ngUnSubscription = new Subject();
  public customers: Customer[]
  public paymentTypes: PaymentType[];
  public treatmentList: Treatment[];
  public newVoucherRequest = new NewVoucherRequest();
  public isPaymentTypeNotSelected: boolean = false;
  public keyword = 'fullName';
  public keywordTreatment = 'ttname';
  public editMode: boolean = false;

  public customerName: string;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewVoucherComponent>,
    private route: Router,
    private voucherService: VouchersService,
    private treatmentService: TreatmentService,
    public clientsService: ClientsService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    if (this.data != null) {
      this.editMode = true;
      this.newVoucherRequest = this.data;
      // this.newVoucherRequest.customerId="sdf34";
      this.customerName = this.data.customerName;
    }
    // console.log(this.data);
  }

  ngAfterViewInit() {
    this.getCustomerList();
    this.getPaymentTypes();
    this.getTreatments();
  }

  numericOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 101 || charCode == 69 || charCode == 45 || charCode == 43) {
      return false;
    }
    return true;
  }

  getPaymentTypes() {
    this.voucherService
      .getAllPaymentTypes()
      .pipe(takeUntil(this.ngUnSubscription))
      .subscribe((paymentTypes: PaymentType[]) => {
        this.paymentTypes = paymentTypes;
      });
  }

  getTreatments() {
    this.treatmentService
      .getFilteredTreatmentList(this.generateTreatmentFilterRequest())
      .subscribe((treatments: Treatment[]) => {
        this.treatmentList = treatments;
      });
  }

  private generateTreatmentFilterRequest() {
    return <TreatmentFilterRequest>{
      departmentId: 0
    }
  }

  onPaymentTypeChange(e: any) {
    this.isPaymentTypeNotSelected = false;
    this.newVoucherRequest.ptid = e.target.value;
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
    this.newVoucherRequest.customerId = e.customerId;
  }

  selectTreatmentEvent(e: any) {
    this.newVoucherRequest.ttid = e.ttid;
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {

    if (!this.newVoucherRequest.ptid) {
      this.isPaymentTypeNotSelected = true;
      return;
    }

    this.voucherService
      .addNewVoucher(this.newVoucherRequest)
      .pipe(takeUntil(this.ngUnSubscription))
      .subscribe((result: any) => {
        console.log(result);
        this.toastr.success("New Voucher Added", "Success");
      }, (error: any) => {

      }, () => {
        this.route.navigate(['home/vouchers']);
        this.dialogRef.close();
      })

  }

}
