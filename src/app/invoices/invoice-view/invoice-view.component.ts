import { Component, OnInit, Inject } from '@angular/core';
import { InvoiceService } from '../invoice.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Invoices } from '../invoices.model';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.scss']
})
export class InvoiceViewComponent implements OnInit {
  invoiceList: Invoices[];


  constructor(
    private invoiceService: InvoiceService,
    public dialogRef: MatDialogRef<InvoiceViewComponent>,
    private route: Router,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.loadInvoice();
  }
  loadInvoice() {
    this.invoiceService
      .getInvoice(this.data.invoiceNo)
      .subscribe((invoices: Invoices[]) => {
        this.invoiceList = invoices;
        console.log(this.invoiceList)
      }, (error) => {
        this.toastr.error("Invoice Not Loaded!");
      }
      );

  }

}
