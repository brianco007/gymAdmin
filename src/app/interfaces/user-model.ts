export interface UserModel {
  fullName: string;
  idNumber: string;
  startDate: string;
  endDate: string; 
  datesToShow: {daysLeft: number, start: string, end: string};
  createdBy: string
  phone: string;
  email?: string;
  notes?: string;
  _id?: string
}



