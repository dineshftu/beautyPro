import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoicesRoutingModule } from './invoices-routing.module';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceViewComponent } from './invoice-view/invoice-view.component';
import { InvoiceService } from './invoice.service';


@NgModule({
  declarations: [InvoiceListComponent, InvoiceViewComponent],
  imports: [
    CommonModule,
    InvoicesRoutingModule
  ],
  providers: [
    InvoiceService
  ]
})
export class InvoicesModule { }
