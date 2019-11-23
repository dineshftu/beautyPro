import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { AddProductComponent } from './add-product/add-product.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ClientsService } from '../clients/clients.service';


@NgModule({
  declarations: [CheckoutComponent, AddProductComponent],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    AutocompleteLibModule
  ],
  providers: [
    ClientsService
  ]
})
export class CheckoutModule { }
