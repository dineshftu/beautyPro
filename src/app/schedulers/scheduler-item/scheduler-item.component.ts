import { Component, OnInit, Input } from '@angular/core';
import { ScheduleResponse } from '../scheduler.model';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { NewAppointmentComponent } from 'src/app/shared/new-appointments/new-appointments.component';
import { Router } from '@angular/router';
import { Appointments, AppointmentStatusRequest } from 'src/app/appointments/appointments.model';
import { DiologBoxComponent } from 'src/app/shared/components/diolog-box/diolog-box.component';
import { AppointmentsService } from 'src/app/appointments/appointments.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-scheduler-item',
  templateUrl: './scheduler-item.component.html',
  styleUrls: ['./scheduler-item.component.scss']
})
export class SchedulerItemComponent implements OnInit {
  @Input() scheduleResponse: ScheduleResponse
  @Input() selectedDate: Date
  @Input() selectedDepartment: number


  appointmentList: Appointments[];
  // appointmentStatus = ["pending", "confirmed", "cancelled"];

  constructor(
    private appoinmentService: AppointmentsService,
    private toastr: ToastrService,
    private route: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  onDivClick() {
    alert('hi');
  }

  addEditAppointment(selectedIndex: number, selectedSchedule: any) {
    console.log('scheduleResponse', this.scheduleResponse);
    console.log('selectedSchedule', selectedSchedule);

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    if (selectedSchedule != undefined && selectedSchedule != null) {
      dialogConfig.data = {
        selectedDate: selectedSchedule.scheduledDate,
        selectedIndex: selectedIndex,
        scheduleResponse: this.scheduleResponse,
        selectedDepartment: selectedSchedule.departmentId,
        selectedSchedule: selectedSchedule,
        isEdit: true
      };
    } else {
      dialogConfig.data = {
        selectedDate: this.selectedDate,
        selectedIndex: selectedIndex,
        scheduleResponse: this.scheduleResponse,
        selectedDepartment: this.selectedDepartment,
        isEdit: false
      };
    }



    this.dialog.open(NewAppointmentComponent, dialogConfig).afterClosed().subscribe(
      (response) => {
        console.log('in response', !!response);
        if (!!response) {
          if (response.message == 'success') {
            console.log('in success');
            this.route.navigate(['/home/scheduler']);
          }
        } else {
          this.route.navigate(['/home/scheduler']);
        }
      }, (error) => {
        console.log('in error', error);
      }
    );
    //this.route.navigate(['/home/scheduler']);
  }

  onStatusChange(e: any, appointment: Appointments) {
    let appointmentStatusRequest = new AppointmentStatusRequest();
    appointmentStatusRequest.status = e.target.value;
    appointmentStatusRequest.csId = appointment.csId;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = 'Do you want to change the status?';
    // dialogConfig.width = "20%";
    this.dialog.open(DiologBoxComponent, dialogConfig).afterClosed().subscribe(
      (response) => {
        if (response.message) {
          this.appoinmentService.changeStatusOfAppointment(appointmentStatusRequest)
            .subscribe(
              (response) => {
                this.toastr.success('Status Updated!');
                this.route.navigate(['/home/appointments']);
              },
              (error) => {
                this.toastr.error("Status Not Updated!");
                console.log(error);
              }
            );
        }
      }, (error) => {
        console.log(error);
      }
    );
  }


}
