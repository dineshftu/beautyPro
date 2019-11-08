import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { NewTreatmentComponent } from 'src/app/treatments/new-treatment/new-treatment.component';
import { Router } from '@angular/router';
import { ClientsService } from '../clients.service';

@Component({
  selector: 'app-client-registration',
  templateUrl: './client-registration.component.html',
  styleUrls: ['./client-registration.component.scss']
})
export class ClientRegistrationComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NewTreatmentComponent>,
    private route: Router,
    private clientService: ClientsService
  ) { }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close();
    // this.route.navigate(['home/treatments']);

  }

  save() {
    this.dialogRef.close();
    
  }

}
