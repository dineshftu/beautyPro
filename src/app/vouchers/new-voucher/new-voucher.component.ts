import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { NewTreatmentComponent } from 'src/app/treatments/new-treatment/new-treatment.component';
import { Router } from '@angular/router';
import { VouchersService } from '../vouchers.service';

@Component({
  selector: 'app-new-voucher',
  templateUrl: './new-voucher.component.html',
  styleUrls: ['./new-voucher.component.scss']
})
export class NewVoucherComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NewTreatmentComponent>,
    private route: Router,
    private voucherService: VouchersService
  ) { }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close();
    // this.route.navigate(['home/treatments']);

  }

  save() {

  }

}
