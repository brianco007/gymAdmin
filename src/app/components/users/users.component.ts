import { Component, inject } from '@angular/core';
import { GymUsersService } from '../../services/gym-users.service';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt'; // decode token
import { FormsModule } from '@angular/forms';
import { LoginServiceService } from '../../services/login-service.service';
import { DetailsComponent } from '../details/details.component';
import { NotificationsComponent } from '../notifications/notifications.component';

// ngrx
import { Store } from '@ngrx/store';
import { AppState } from '../../ngrx-notifications/app.state';
import * as NotificationActions from '../../ngrx-notifications/notifications.actions';
import { Notification } from '../../ngrx-notifications/notifications.model';

const jwtHelperService = new JwtHelperService();

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterLink, FormsModule, DetailsComponent, NotificationsComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  constructor(private store: Store) {}

  addNotification(id: string, name: string, whatsApp: string){
    const notification: Notification = {id: id, name: name, whatsApp: whatsApp}
    this.store.dispatch(NotificationActions.addNotification({notification}))
  }

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
    'Dec',
  ];

  // Show users
  users: any[] = [];
  contentToShow: any[] = [];
  showAllUsers() {
    this.gymUsersService.getUsers().subscribe((res: any) => {
      this.users = res.reverse();
      //show the name of the gym on top
      const tokenFromDom: any = localStorage.getItem('token');
      this.gymName = jwtHelperService
        .decodeToken(tokenFromDom)
        .gymName.toUpperCase();

      //show ONLY your users
      const filteredData = this.users.filter((user) => {
        const tokenFromDom: any = localStorage.getItem('token');
        const owner = jwtHelperService.decodeToken(tokenFromDom).id;
        return user.createdBy === owner;
      });
      this.contentToShow = filteredData;
      this.users = filteredData;

      // // show only current month data
      // const currentMonthIndex = new Date().getMonth();
      // const currentMonth = this.months[currentMonthIndex];
      // const sortedByCurrentMonth = this.users.filter(user=>{
      //   const date = user.datesToShow.start;
      //   const slicedDate = date.slice(2, 6).trim()
      //   return slicedDate === currentMonth;
      // })
      // this.contentToShow = sortedByCurrentMonth;

      const respuesta = localStorage.getItem('terminado')
      if(respuesta !== 'si'){
        const sortedData = this.users.filter(
          (user) => user.datesToShow.daysLeft === 0 
        );
        sortedData.map(user => {
          this.addNotification(user._id, user.fullName, user.phone)
        })
      }
    });
  }

  // Token validation
  actRoute = inject(ActivatedRoute);
  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      if (token) {
        this.loginService.validateToken(token).subscribe((res: any) => {
          if (res.message === 'Token is valid') {
            this.showAllUsers();
          } else {
            this.loginService.logOut();
          }
        });
      } else {
        this.loginService.logOut();
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
    this.contentToShow = sortedNames;
  }

  zToA() {
    const sortedNames = this.contentToShow.sort((a, b) => {
      if (a.fullName > b.fullName) return -1;
      if (a.fullName < b.fullName) return 1;
      return 0;
    });
    this.contentToShow = sortedNames;
  }

  selectedMonth: string = '';
  byMonth() {
    const filteredData = this.users.filter(
      (user) => user.datesToShow.start.slice(3, 6) === this.selectedMonth
    );
    this.contentToShow = filteredData;
  }

  wantedId: string = '';
  byUserId() {
    if (!this.wantedId) {
      this.showAllUsers();
    }
    const sortedData = this.users.filter(
      (user) => user.idNumber.indexOf(this.wantedId) > -1
    );
    this.contentToShow = sortedData;
  }

  nameOrLastName: string = '';
  byNameLastname() {
    if (!this.nameOrLastName) {
      this.showAllUsers();
    }
    const sortedData = this.users.filter(
      (user) =>
        user.fullName.toLowerCase().indexOf(this.nameOrLastName.toLowerCase()) >
        -1
    );
    this.contentToShow = sortedData;
  }

  // Users whose membership expires in 3 days
  aboutToExpire() {
    const sortedData = this.users.filter(
      (user) => user.datesToShow.daysLeft <= 3 && user.datesToShow.daysLeft >= 0
    );
    this.contentToShow = sortedData;
  }

  // Users whose membership expires in 3 days
  expiredMemberships() {
    const sortedData = this.users.filter(
      (user) => user.datesToShow.daysLeft <= 0
    );
    this.contentToShow = sortedData;
  }

  // toggle tools menu
  toggleToolsMenu() {
    const sideFilters = document.querySelector('.az-btn')!;

    sideFilters.classList.toggle('active');
  }
}
