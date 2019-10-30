import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { Vouchers } from '../vouchers.model';
import { VouchersService } from '../vouchers.service';

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
    private voucherService: VouchersService
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

}
