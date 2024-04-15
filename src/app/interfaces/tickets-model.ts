export interface ticketsModel {
  fullName: string;
  userId: string;
  startDate: string; 
  endDate: string; 
  numberOfDays: string;
  createdBy: string;
  phone?: string;
  email?: string;
  datesToShow?: {daysLeft: number, start: string, end: string};
}
