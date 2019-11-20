import { Component, OnInit, Input } from '@angular/core';
import { ScheduleResponse } from '../scheduler.model';

@Component({
  selector: 'app-scheduler-item',
  templateUrl: './scheduler-item.component.html',
  styleUrls: ['./scheduler-item.component.scss']
})
export class SchedulerItemComponent implements OnInit {
  @Input() scheduleResponse: ScheduleResponse

  constructor() { }

  ngOnInit() {
  }

}
