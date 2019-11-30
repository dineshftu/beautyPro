import { Component, OnInit, Input } from '@angular/core';
import { ScheduleResponse } from '../scheduler.model';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { NewAppointmentComponent } from 'src/app/shared/new-appointments/new-appointments.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scheduler-item',
  templateUrl: './scheduler-item.component.html',
  styleUrls: ['./scheduler-item.component.scss']
})
export class SchedulerItemComponent implements OnInit {
  @Input() scheduleResponse: ScheduleResponse
  @Input() selectedDate: Date

  constructor(
    private route: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  onDivClick() {
    alert('hi');
  }

  addNewAppointment(selectedIndex: number) {
    console.log('scheduleResponse', this.scheduleResponse);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { selectedDate: this.selectedDate, selectedIndex: selectedIndex, scheduleResponse: this.scheduleResponse };
    this.dialog.open(NewAppointmentComponent, dialogConfig).afterClosed().subscribe(
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
