export interface SchedulerFilterRequest {
    departmentId: number;
}

export class ScheduleResponse {
    employeeName: string;
    designation: string;
    schedules = new Array<Schedules>();
}

export class Schedules {
    clientName: string;
    scheduleStatus: string;
    treatmentType: string;
    startTime: string;
    endTime: string;
    timeIndexes: Array<string>;
}