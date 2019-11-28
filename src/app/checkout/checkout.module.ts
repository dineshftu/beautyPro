import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { AddProductComponent } from './add-product/add-product.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ClientsService } from '../clients/clients.service';
import { MatDialogModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { CheckoutService } from './checkout.service';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [CheckoutComponent, AddProductComponent],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    AutocompleteLibModule,
    MatDialogModule,
    FormsModule,
    SharedModule
  ],
  providers: [
    CheckoutService,
    ClientsService
  ],
  entryComponents: [AddProductComponent]
})
export class CheckoutModule { }
