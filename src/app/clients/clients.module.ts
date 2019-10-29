import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { ClientRegistrationComponent } from './client-registration/client-registration.component';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientsService } from './clients.service';


@NgModule({
  declarations: [
    ClientRegistrationComponent,
    ClientListComponent
  ],
  imports: [
    CommonModule,
    ClientsRoutingModule
  ],
  providers: [
    ClientsService
  ]

})
export class ClientsModule { }
