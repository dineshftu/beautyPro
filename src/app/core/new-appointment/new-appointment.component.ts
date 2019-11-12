import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-new-appointment',
  templateUrl: './new-appointment.component.html',
  styleUrls: ['./new-appointment.component.scss']
})
export class NewAppointmentComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NewAppointmentComponent>
  ) { }

  ngOnInit() {
  }

}
