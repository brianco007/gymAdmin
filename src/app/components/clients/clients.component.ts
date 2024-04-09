import { Component, inject } from '@angular/core';
import { GymUsersService } from '../../services/gym-users.service';
import { TicketsService } from '../../services/tickets-service';  
import { ShowGymOwnersService } from '../../services/show-gym-owners.service'; 
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms'; 

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent {
  gymService = inject(GymUsersService);
  gymOwnerService = inject(ShowGymOwnersService);

  allUsers: any[] = [];
  id: string = '';
  start: string = '';
  end: string = '';
  daysLeft: number = 0;
  gymId: string = '';

  foundInMembers: boolean = true;
  foundInTickets: boolean = true;


  //handle form Data
  clientForm = new FormGroup({
    userId: new FormControl(''),
  });

  // GET Monthly membership users
  getAllUsers(){
    this.gymService.getUsers().subscribe((res: any)=>{
      const userId = this.clientForm.value.userId; // get value form FORM
      const sortedData = res.filter((user: any) => user.idNumber === userId)
      this.allUsers = sortedData;
      if(this.allUsers.length){
        this.start = this.calculateExpiryDate(this.allUsers[0].dateStart).start;
        this.end = this.calculateExpiryDate(this.allUsers[0].dateStart).end;
        this.daysLeft = this.calculateExpiryDate(this.allUsers[0].dateStart).daysLeft;
        this.gymId = this.allUsers[0].createdBy;
        this.showGymName()
        this.foundInMembers = true;
      } else {
        this.foundInMembers = false;     
      }
    })
  }

  dataFromGym : any;
  showGymName(){
    this.gymOwnerService.getOwner(this.gymId).subscribe((res: any)=>{
      this.dataFromGym = res;
    })
  }
  
  calculateExpiryDate (startDate: string){
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Deciembre']

    // START DATE
    const newStartDate = new Date(startDate);
    // add more day
    const newStartDate2 = newStartDate.getTime() + (1 * 24 * 60 * 60 * 1000)
    const newStartDate3 = new Date(newStartDate2)
    // formating the date
    const formatedStartDate = ("0" + newStartDate3.getDate()).slice(-2) + " " + months[newStartDate3.getMonth()] + ", " + newStartDate3.getFullYear()

    //END DATE
    const startDateObejct = new Date(startDate)
    // add 30 days
    const expiryDate = new Date(startDateObejct.getTime() + (30 * 24 * 60 * 60 * 1000)) 
    // formating the date
    const formatedExpiryDate = ("0" + (expiryDate.getDate())).slice(-2) + " " + months[expiryDate.getMonth()] + ", " + expiryDate.getFullYear()

    //DAYS LEFT
    const today = new Date();
    const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 ));
      
    return {
      start: formatedStartDate,
      end: formatedExpiryDate,
      daysLeft,
    }
  }

  // GET tickets users
  ticketService = inject(TicketsService);
  ticketInfo: any = []
  getAllTickets(){
    this.ticketService.getTickets().subscribe((res: any)=>{
      const userId = this.clientForm.value.userId; // get value from FORM
      const filteredData = res.filter((user: any) => user.userId === userId)
      this.ticketInfo = filteredData
      console.log(this.ticketInfo)
      if(this.ticketInfo.length){       
        this.gymId = this.ticketInfo[0].createdBy;
        this.showGymName()
        this.foundInTickets = true;
      } else {
        this.foundInTickets = false;
      }
    })
  }

  handleSubmit(){
    this.getAllUsers()
    this.getAllTickets()
  }

  activateMessage(yesNo: boolean){
    if(yesNo){
      return 'No se encontró ningún registro.'
    } else {
      return ''
    }
  }
  

}
