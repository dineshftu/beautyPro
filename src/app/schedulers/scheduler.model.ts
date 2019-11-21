export interface SchedulerFilterRequest {
  departmentId: number;
}

export class ScheduleResponse {
  employeeName: string;
  designation: string;
  schedules = new Array<Schedules>();
  timeIndexes: Array<string>;
}

export class Schedules {
  clientName: string;
  scheduleStatus: string;
  treatmentType: string;
  startTime: string;
  endTime: string;
  startIndex: number;
  // timeIndexes: Array<string>;
}
