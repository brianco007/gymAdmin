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

  // // show date
  // todaysDate: any = this.showDate()
  // showDate(){
  //   const daysArr = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  //   const monthsArr = [
  //     'Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dec'];
  //   const today = new Date();
  //   const day =  daysArr[today.getDay()-1];
  //   const month =  monthsArr[today.getMonth()];
  //   const date = today.getDate()
  //   const fullDate = `- ${day}, ${date} de ${month}`
  //   return fullDate
  // }
  
  // Show users
  users: any[] = [];
  otherUsers: any[] = [];
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
      this.users = filteredData

      //format date 01/02/2024 for 01-Feb-2024
      this.users.forEach((obj) => {
        const months = [
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
          'Dec',
        ];

        obj.dateStart = new Date(obj.dateStart);
        obj.dateStart = obj.dateStart.getTime() + 1 * 24 * 60 * 60 * 1000;
        obj.dateStart = new Date(obj.dateStart);
        obj.dateStart =
          ('0' + obj.dateStart.getDate()).slice(-2) +
          ' ' +
          months[obj.dateStart.getMonth()] +
          ', ' +
          obj.dateStart.getFullYear();
      });
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
    const sortedNames = this.users.sort((a, b) => {
      if (a.fullName < b.fullName) return -1;
      if (a.fullName > b.fullName) return 1;
      return 0;
    });
  }

  zToA() {
    const sortedNames = this.users.sort((a, b) => {
      if (a.fullName > b.fullName) return -1;
      if (a.fullName < b.fullName) return 1;
      return 0;
    });
  }

  selectedMonth: string = ''
  byMonth(){
    let data = this.users
    data = data.filter(user=> user.dateStart.slice(3, 6) === this.selectedMonth)
    this.users = data
  }

  wantedId: string = '';
  byUserId(){
    const data = this.users.filter(user => user.idNumber === this.wantedId)
    this.users = data
    this.wantedId = ''
  }
}
