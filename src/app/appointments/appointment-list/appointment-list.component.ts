import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { Appointments } from '../appointments.model';
import { AppointmentsService } from '../appointments.service';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit {
  module: string;
  appointmentList: Appointments[];
  departmentList = [
    "Spa Care", "Salon Care", "Skin Care"
  ];

  appointmentStatus = [
    "New", "Confirmed"
  ];

  constructor(
    private data: DataService,
    private appoinmentService: AppointmentsService
  ) { }

  ngOnInit() {
    this.loadVouchers();
    this.data.currentModule.subscribe(module => this.module = module);
    this.data.changeModule("Appointments");
  }

  loadVouchers() {
    this.appoinmentService.getAppointmenttList().subscribe((vouchers: Appointments[]) => {
      this.appointmentList = vouchers;
    });
  }

}
