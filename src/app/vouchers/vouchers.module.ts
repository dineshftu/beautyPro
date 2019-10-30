import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VouchersRoutingModule } from './vouchers-routing.module';
import { VoucherListComponent } from './voucher-list/voucher-list.component';
import { VouchersService } from './vouchers.service';

@NgModule({
  declarations: [
    VoucherListComponent
  ],
  imports: [
    CommonModule,
    VouchersRoutingModule
  ],
  providers: [
    VouchersService
  ]
})
export class VouchersModule { }
