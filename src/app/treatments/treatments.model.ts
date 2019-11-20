export class Treatment {
  id: string;
  ttname: string;
  department: string;
  duration: boolean;
  cost: string;
  price: string;
}

export interface TreatmentFilterRequest {
  departmentId: number;
}

export class NewTreatmentRequest {
  ttname: string;
  price: number;
  cost: number;
  duration: number;
  departmentId: number;
}
