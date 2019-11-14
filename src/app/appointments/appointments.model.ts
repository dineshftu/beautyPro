export class Appointments {
  id: number;
  client: string;
  treatment: string;
  date: string;
  time: string;
  duration: string;
  therapist: string;
  price: number;
}

export class AppointmentFilterRequest {
  departmentId: number;
}
