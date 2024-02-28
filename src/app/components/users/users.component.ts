import { Component, inject } from '@angular/core';
import { GymUsersService } from '../../services/gym-users.service';
import { RouterLink } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt'; // decode token
import { FormsModule } from '@angular/forms'; 
import { LoginServiceService } from '../../services/login-service.service'; 

const jwtHelperService = new JwtHelperService();

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  gymUsersService = inject(GymUsersService);
  loginService = inject(LoginServiceService);
  gymName: string = '';
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
 
  // Show users
  users: any[] = [];
  contentToShow: any[] = [];
  showAllUsers() {
    this.gymUsersService.getUsers().subscribe((res: any) => {
      this.users = res.reverse();

      //show the name of the gym on top
      const tokenFromDom: any = localStorage.getItem('token');
      this.gymName = jwtHelperService.decodeToken(tokenFromDom).gymName.toUpperCase();

      //show ONLY your users
      const filteredData = this.users.filter(user => {
        const tokenFromDom: any = localStorage.getItem('token');
        const owner = jwtHelperService.decodeToken(tokenFromDom).id;
        return user.createdBy === owner
      })
      this.contentToShow = filteredData
      this.users = filteredData


      //format date 01/02/2024 for 01-Feb-2024
      this.contentToShow.forEach((obj) => {
  
        obj.dateStart = new Date(obj.dateStart);
        obj.dateStart = obj.dateStart.getTime() + 1 * 24 * 60 * 60 * 1000;
        obj.dateStart = new Date(obj.dateStart);
        obj.dateStart =
          ('0' + obj.dateStart.getDate()).slice(-2) +
          ' ' +
          this.months[obj.dateStart.getMonth()] +
          ', ' +
          obj.dateStart.getFullYear();
      });

      // show only current month data
      const currentMonthIndex = new Date().getMonth();
      const currentMonth = this.months[currentMonthIndex];
      const sortedByCurrentMonth = this.users.filter(user=>{
        const date = user.dateStart;
        const slicedDate = date.slice(2, 6).trim()
        return slicedDate === currentMonth;
      })
      this.contentToShow = sortedByCurrentMonth;
    });
  }
  
  // Token validation 
  ngOnInit() {
    const token = localStorage.getItem('token');
    if(token){
      if (token) {
        this.loginService.validateToken(token).subscribe((res: any) => {
          if(res.message === 'Token is valid'){
            this.showAllUsers();       
          } else {
            this.loginService.logOut()      
          }
        })
      }  else {
      this.loginService.logOut()
    }   
  }
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
    const filteredData = this.users.filter(user=> user.dateStart.slice(3, 6) === this.selectedMonth)
    this.contentToShow = filteredData;
  }

  wantedId: string = '';
  byUserId(){
    const sortedData = this.users.filter(user => user.idNumber === this.wantedId)
    this.contentToShow = sortedData
  }

  nameOrLastName: string = '';
  byNameLastname(){
    if(!this.nameOrLastName){
      this.showAllUsers()
    }
    const sortedData = this.users.filter(user => user.fullName.toLowerCase().indexOf(this.nameOrLastName.toLowerCase()) > -1)
    this.contentToShow = sortedData;
  }
}
