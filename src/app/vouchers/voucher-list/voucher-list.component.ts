import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Router, NavigationEnd } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import { Vouchers, VoucherFilterRequest } from '../vouchers.model';
import { VouchersService } from '../vouchers.service';
import { Location } from '@angular/common';
import { NewVoucherComponent } from '../new-voucher/new-voucher.component';
import { ToastrService } from 'ngx-toastr';
import { InputBoxComponent } from 'src/app/shared/components/input-box/input-box.component';
import { HelperService } from 'src/app/core/services/helper.service';

@Component({
  selector: 'app-voucher-list',
  templateUrl: './voucher-list.component.html',
  styleUrls: ['./voucher-list.component.scss']
})
export class VoucherListComponent implements OnInit {

  public selectedStatus = 1;
  public voucherList: Vouchers[];
  public date: string;

  //public module: string;

  // statusList = [
  //   "All", "Issued", "Redeemed", "Cancelled"
  // ];

  constructor(
    private data: DataService,
    private voucherService: VouchersService,
    private route: Router, private location: Location,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private helperService: HelperService,
  ) {
    this.routeReload();
  }

  ngOnInit() {
    //this.selectedStatus = 1;
    this.date = this.helperService.formatDate(new Date().toISOString(), 'yyyy-mm-dd');//set current date as initial date
    this.loadVouchers();
    //this.data.currentModule.subscribe(module => this.module = module);
    this.data.changeModule("Vouchers");
  }

  private routeReload() {
    this.route
      .events
      .subscribe((e: any) => {
        if (e instanceof NavigationEnd) {
          this.date = this.helperService.formatDate(new Date().toISOString(), 'yyyy-mm-dd');//set current date as initial date
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
      }, (error) => {
        this.toastr.error("Voucher List Loading Failed!");
      });
  }

  private generateVoucherFilterRequest() {
    return <VoucherFilterRequest>{
      status: this.selectedStatus,
      date: this.date
    }
  }

  onStatusChange(e: any) {
    this.selectedStatus = e.target.value;
    this.loadVouchers();
  }

  addNewVoucher(voucher) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    // dialogConfig.data = '';

    // if (voucher != null)
    dialogConfig.data = voucher;

    this.dialog.open(NewVoucherComponent, dialogConfig).afterClosed().subscribe(
      (response) => {
        if (!!response) {
          if (response.message == 'success') {
            this.route.navigate(['/home/vouchers']);
          }
        }
      }
    );
  }

  deleteVoucher(voucher: Vouchers) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = 'Do you want to delete ' + voucher.gvinvoiceNo + ' ?\nPlease insert a reason';
    // dialogConfig.width = "20%";
    let id = voucher.gvinvoiceNo;
    this.dialog.open(InputBoxComponent, dialogConfig).afterClosed().subscribe(
      (response) => {
        if (response.message) {
          this.voucherService.deleteVoucher(id, response.reason)
            .subscribe(
              (response) => {
                console.log(response);
                this.toastr.success('Deleted!');
                this.route.navigate(['/home/vouchers']);
              },
              (error) => {
                this.toastr.error("Not Deleted!");
                console.log(error);
              }
            );
          console.log(response);
        }
      }, (error) => {
        console.log(error);
      }
    );
  }
  onDateChange(e) {
    this.date = this.helperService.formatDate(new Date(e.target.value).toISOString(), 'yyyy-mm-dd');

    if (!this.selectedStatus) {
      this.toastr.error("Please select a status");
    } else {
      this.loadVouchers();
    }
  }
}
