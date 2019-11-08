import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scheduler-list',
  templateUrl: './scheduler-list.component.html',
  styleUrls: ['./scheduler-list.component.scss']
})
export class SchedulerListComponent implements OnInit {
  schedulesList = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
  ]
  constructor() { }

  ngOnInit() {
  }

}
