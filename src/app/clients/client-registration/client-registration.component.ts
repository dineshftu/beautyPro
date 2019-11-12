import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { NewTreatmentComponent } from 'src/app/treatments/new-treatment/new-treatment.component';
import { Router } from '@angular/router';
import { ClientsService } from '../clients.service';
import { Customer, Client } from '../clients.model';

@Component({
  selector: 'app-client-registration',
  templateUrl: './client-registration.component.html',
  styleUrls: ['./client-registration.component.scss']
})
export class ClientRegistrationComponent implements OnInit {

  public client: Client;
  public address = '';
  public mobileNo = '';
  public fullName = '';
  public loyaltyCardNo = '';
  public email = '';
  public gender = '';

  constructor(
    public dialogRef: MatDialogRef<NewTreatmentComponent>,
    private route: Router,
    private clientService: ClientsService
  ) { }

  ngOnInit() {
    this.client = new Client();
    this.gender = "M";
  }

  onGenderChange(event: any) {
    this.gender = event.target.value;
  }

  cancel() {
    this.dialogRef.close();
    // this.route.navigate(['home/treatments']);
  }

  save() {
    this.clientService
      .addNewCustomer(<Client>{
        name: this.fullName,
        address: this.address,
        contactNo: this.mobileNo,
        email: this.email,
        gender: this.gender,
        loyaltyCardNo: this.loyaltyCardNo
      })
      .subscribe((value: any) => {
        this.dialogRef.close();
      }, (error: any) => {

      }, () => {
        this.route.navigate(['home/clients']);
      });
  }

}
