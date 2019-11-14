import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { AppointmentService } from '../services/appointment.service';
import { Router } from '@angular/router';
import { NewAppointmentRequest } from '../models/appointment.model';

@Component({
  selector: 'app-new-appointments',
  templateUrl: './new-appointments.component.html',
  styleUrls: ['./new-appointments.component.scss']
})
export class NewAppointmentComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NewAppointmentComponent>,
    private appointmentService: AppointmentService,
    private route: Router,
  ) { }

  public model = new NewAppointmentRequest();

  ngOnInit() {
  }

  saveAppointment() {
    this.appointmentService
      .addNewAppointment(this.generateAppointmentRequest())
      .subscribe((result: any) => {
        console.log(result);
      }, (error: any) => {

      }, () => {
        this.route.navigate(['home/appointments']);
        this.dialogRef.close();
      });
  }

  private generateAppointmentRequest(): NewAppointmentRequest {
    return <NewAppointmentRequest> {

    };
  }

}
