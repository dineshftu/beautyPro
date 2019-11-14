export class NewAppointmentRequest {
    customerId: string;
    bookedDate: Date;
    status: string;
    departmentId: number;
    branchId: number;
    treatments = new Array<AppointmentTreatment>();
}

export class AppointmentTreatment {
    treatmentTypeId: number;
    empNo: number;
    startTime: Date;
    duration: number;
}
