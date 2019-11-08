import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import { Vouchers } from '../vouchers.model';
import { VouchersService } from '../vouchers.service';
import { Location } from '@angular/common';
import { NewVoucherComponent } from '../new-voucher/new-voucher.component';

@Component({
  selector: 'app-voucher-list',
  templateUrl: './voucher-list.component.html',
  styleUrls: ['./voucher-list.component.scss']
})
export class VoucherListComponent implements OnInit {
  module: string;
  voucherList: Vouchers[];
  statusList = [
    "Status 1", "Status 2", "Status 3"
  ];

  constructor(
    private data: DataService,
    private voucherService: VouchersService,
    private route: Router, private location: Location,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadVouchers();
    this.data.currentModule.subscribe(module => this.module = module);
    this.data.changeModule("Vouchers");
  }

  loadVouchers() {
    this.voucherService.getVoucherList().subscribe((vouchers: Vouchers[]) => {
      this.voucherList = vouchers;
    });
  }

  addNewVoucher() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = '';
    this.dialog.open(NewVoucherComponent, dialogConfig).afterClosed().subscribe(
      (response) => {
        //console.log(response);
        if (!!response) {
          if (response.message == 'success') {
            this.route.navigate(['']);
          }
        }
      }, (error) => {
        console.log(error);
      }
    );
  }

}
