import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VouchersRoutingModule } from './vouchers-routing.module';
import { VoucherListComponent } from './voucher-list/voucher-list.component';
import { VouchersService } from './vouchers.service';
import { NewVoucherComponent } from './new-voucher/new-voucher.component';

@NgModule({
  declarations: [
    VoucherListComponent,
    NewVoucherComponent
  ],
  imports: [
    CommonModule,
    VouchersRoutingModule
  ],
  providers: [
    VouchersService
  ],
  entryComponents: [
    NewVoucherComponent
  ]
})
export class VouchersModule { }
