import { Component, inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt'; // decode token
import { TicketsService } from '../../services/tickets-service';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { ticketsModel } from '../../interfaces/tickets-model';
import Swal from 'sweetalert2'

const jwtHelperService = new JwtHelperService();

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css',
})
export class TicketsComponent {
  ticketsService = inject(TicketsService);
  ticketsData: any[] = [];
  contentToShow: any[] = [];
  months: string[] = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  getAllTickets() {
    //function to show GymName
    this.showGymName();

    // Using the Service
    this.ticketsService.getTickets().subscribe((res: any) => {
      this.ticketsData = res;
      this.contentToShow = res;

      //show ONLY your users
      const filteredData = this.ticketsData.filter((user) => {
        const tokenFromDom: any = localStorage.getItem('token');
        const owner = jwtHelperService.decodeToken(tokenFromDom).id;
        return user.createdBy === owner;
      });
      this.ticketsData = filteredData;
      this.contentToShow = filteredData.reverse();

      //show CURRENT Month data
      const currentMonthIndex = new Date().getMonth()+1
      const formatedMonth = ('0' + currentMonthIndex).slice(-2)
      
      const sortedByCurrentMonth = this.contentToShow.filter((ticket: any)=>{
        const ticketDate = ticket.startDate.slice(5, 7)
        return ticketDate === formatedMonth
      })
      this.contentToShow = sortedByCurrentMonth;
      
    });

    
  }

  ngOnInit() {
    this.getAllTickets();
  }

  // ---------- Extra Functions ---------- //

  gymName: string = '';
  // Show Gym Name
  showGymName() {
    const tokenFromDom: any = localStorage.getItem('token');
    this.gymName = jwtHelperService
      .decodeToken(tokenFromDom)
      .gymName.toUpperCase();
  }

  // Assign Gym Admin/Owner
  assignOwner() {
    const tokenFromDom: any = localStorage.getItem('token');
    const owner = jwtHelperService.decodeToken(tokenFromDom).id;
    return owner;
  }

  // CREATE
  message: string = "";
  approve: string = "";

  formData: ticketsModel = {
    fullName: '',
    userId: '',
    startDate: '',
    endDate: '',
    numberOfDays: '',
    createdBy: this.assignOwner(),
    phone: '',
    email: '',
  };
  addNewMember() {
    const addBtn = document.getElementById('add-btn')!
    this.ticketsService.createTicket(this.formData).subscribe((res) => {
      if(this.formData.fullName && this.formData.userId && this.formData.startDate && this.formData.endDate && this.formData.numberOfDays){
        this.message = ""
        this.getAllTickets();
        // reset values
        this.formData = {
          fullName: '',
          userId: '',
          startDate: '',
          endDate: '',
          numberOfDays: '',
          createdBy: this.assignOwner(),
          phone: '',
          email: '',
        }
      } else {
        this.noti();
      }
    });
  }

  // DETAILS
  detailsInfo: any = {};
  seeDetails(id: string) {
    this.ticketsService.showOneTicket(id).subscribe((res: any) => {
      this.detailsInfo = res;
      // For the DELETE Fn
      this.userToDeleteId = res._id;
      this.userNameToDelete = res.fullName;
      // For the EDIT Fn
      this.prevNewInfo = res;
      this.userIdToEdit = res._id;
    });
  }

  //EDIT
  prevNewInfo: any = {
    fullName: '',
    userId: '',
    startDate: '',
    endDate: '',
    numberOfDays: '',
    phone: '',
    email: '',
    createdBy: this.assignOwner(),
  };
  userIdToEdit: string = '';
  editInfo(id: string) {
    this.ticketsService.editTicket(id, this.prevNewInfo).subscribe((res) => {
      this.getAllTickets();
    });
  }

  // DELETE
  userToDeleteId: string = '';
  userNameToDelete: string = '';
  deleteUser(id: string) {
    this.ticketsService.deleteTicket(id).subscribe((res: any) => {
      console.log(res);
      this.getAllTickets();
    });
  }

  // REMOVE ONE DAY
  userToRemoveDays: string = ''
  infoMinusOneDay: any = {
    fullName: '',
    userId: '',
    startDate: '',
    endDate: '',
    numberOfDays: '',
    phone: '',
    email: '',
    createdBy: this.assignOwner(),
  };
  removeOneDay(id: string){
    // get the details
    this.ticketsService.showOneTicket(id).subscribe((res: any)=>{
      this.infoMinusOneDay = res;
      // minus 1 day
      this.infoMinusOneDay.numberOfDays = Number(this.infoMinusOneDay.numberOfDays - 1).toString();
      // Post New Info
      this.ticketsService.editTicket(id, this.infoMinusOneDay).subscribe((res: any)=>{
        this.getAllTickets()
      })
    })

  }

  
  //FILTERS
  aToZ() {
    const sortedNames = this.contentToShow.sort((a, b) => {
      if (a.fullName < b.fullName) return -1;
      if (a.fullName > b.fullName) return 1;
      return 0;
    });
    this.contentToShow = sortedNames
  }

  zToA() {
    const sortedNames = this.contentToShow.sort((a, b) => {
      if (a.fullName > b.fullName) return -1;
      if (a.fullName < b.fullName) return 1;
      return 0;
    });
    this.contentToShow = sortedNames
  }

  selectedMonth: string = ''
  byMonth(){
    const filteredData = this.ticketsData.filter(user=> user.startDate.slice(5, 7) === this.selectedMonth)
    this.contentToShow = filteredData;
  }

  wantedId: string = '';
  byUserId(){
    const sortedData = this.ticketsData.filter(user => user.userId === this.wantedId)
    this.contentToShow = sortedData
  }

  nameOrLastName: string = '';
  byNameLastname(){
    if(!this.nameOrLastName){
      this.getAllTickets();
    }
    const sortedData = this.ticketsData.filter(user => user.fullName.toLowerCase().indexOf(this.nameOrLastName.toLowerCase()) > -1)
    this.contentToShow = sortedData;
  }

  noti(){
    Swal.fire({
      title: 'No se creó registro.',
      text: 'Por favor, complete todos los campos obligatorios marcados con *.',
      icon: 'error',
      confirmButtonText: 'Entendido',
      background: 'rgba(0, 0, 0, .8)',
      color: '#fff',
      confirmButtonColor: '#c64242',
      width: '20rem'
    })
  }
}
