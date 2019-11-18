export class NewAppointmentRequest {
    customerId: string;
    bookedDate: Date;
    status: string;
    departmentId: number;
    branchId: number;
    treatments = new Array<AppointmentTreatment>();
}

export class AppointmentTreatment {
    ttid: number;
    empNo: number;
    startTime: string;
    endTime: string;
}

export class Employees {
    empno: number;
    name: string;
}

export interface EmployeeFilterRequest {
    departmentId: number;
}
