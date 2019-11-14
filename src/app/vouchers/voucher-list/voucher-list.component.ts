import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { Router, NavigationEnd } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import { Vouchers, VoucherFilterRequest } from '../vouchers.model';
import { VouchersService } from '../vouchers.service';
import { Location } from '@angular/common';
import { NewVoucherComponent } from '../new-voucher/new-voucher.component';

@Component({
  selector: 'app-voucher-list',
  templateUrl: './voucher-list.component.html',
  styleUrls: ['./voucher-list.component.scss']
})
export class VoucherListComponent implements OnInit {

  public selectedStatus = 1;
  public voucherList: Vouchers[];

  //public module: string;

  // statusList = [
  //   "All", "Issued", "Redeemed", "Cancelled"
  // ];

  constructor(
    private data: DataService,
    private voucherService: VouchersService,
    private route: Router, private location: Location,
    public dialog: MatDialog
  ) {
    this.routeReload();
  }

  ngOnInit() {
    //this.selectedStatus = 1;
    this.loadVouchers();
    //this.data.currentModule.subscribe(module => this.module = module);
    this.data.changeModule("Vouchers");
  }

  private routeReload() {
    this.route
      .events
      .subscribe((e: any) => {
        if (e instanceof NavigationEnd) {
          this.loadVouchers();
        }
      })
  }

  loadVouchers() {
    this.voucherService
      .getFilteredVoucherList(this.generateVoucherFilterRequest())
      .subscribe((vouchers: Vouchers[]) => {
        this.voucherList = vouchers;
        this.voucherList.map(voucher => voucher.status = (voucher.isRedeem ? "Redeemed" : voucher.isCanceled ? "Cancelled" : "Issued"));
      });
  }

  private generateVoucherFilterRequest() {
    return <VoucherFilterRequest>{
      status: this.selectedStatus
    }
  }

  onStatusChange(e: any) {
    this.selectedStatus = e.target.value;
    this.loadVouchers();
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
