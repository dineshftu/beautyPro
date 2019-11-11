export interface Customer {
  id: string;
  name: string;
  contactNumber: string;
  address: string;
  email: string;
  gender: string;
  profession: string;
  loyaltyCardNo: string;
}

export interface CustomerSearchRequest {
  searchText: string;
}
