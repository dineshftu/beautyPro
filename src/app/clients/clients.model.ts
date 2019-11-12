export interface Customer {
  id: string;
  fullName: string;
  mobileNo: string;
  address: string;
  email: string;
  gender: string;
  profession: string;
  loyaltyCardNo: string;
}

export interface CustomerSearchRequest {
  searchText: string;
}

export class Client {
  name: string;
  address: string;
  contactNo: string;
  email: string;
  gender: string;
  loyaltyCardNo: string;
}