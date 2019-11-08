import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { ClientsService } from '../clients.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ClientRegistrationComponent } from '../client-registration/client-registration.component';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  module: string;
  clientList: any[];
  departmentList = [
    "Spa Care", "Salon Care", "Skin Care"
  ];

  constructor(
    private route: Router,
    private clientsService: ClientsService,
    public dialog: MatDialog,
    private data: DataService
  ) {
  }

  ngOnInit() {
    // this.loadTreatments();
    this.data.currentModule.subscribe(module => this.module = module);
    this.data.changeModule("Clients");
  }

  addNewClient() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = '';
    this.dialog.open(ClientRegistrationComponent, dialogConfig).afterClosed().subscribe(
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
