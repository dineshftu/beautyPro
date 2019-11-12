import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { ClientsService } from '../clients.service';
import { Client } from '../clients.model';

@Component({
  selector: 'app-client-registration',
  templateUrl: './client-registration.component.html',
  styleUrls: ['./client-registration.component.scss']
})
export class ClientRegistrationComponent implements OnInit {

  public client = new Client();

  constructor(
    public dialogRef: MatDialogRef<ClientRegistrationComponent>,
    private route: Router,
    private clientService: ClientsService
  ) { }

  ngOnInit() {
    this.client.gender = "M";
  }

  onGenderChange(event: any) {
    this.client.gender = event.target.value;
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    this.clientService
      .addNewCustomer(this.client)
      .subscribe((result: any) => {
        console.log(result);
      }, (error: any) => {

      }, () => {
        this.route.navigate(['home/clients']);
        this.dialogRef.close();
      });
  }

}
