import { Component, inject } from '@angular/core';
import { GymUsersService } from '../../services/gym-users.service';
import { RouterLink,  ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt'; // decode token
import { FormsModule } from '@angular/forms';
import { LoginServiceService } from '../../services/login-service.service';
import { DetailsComponent } from '../details/details.component';
import { NotificationsComponent } from '../notifications/notifications.component';
import { UserModel } from '../../interfaces/user-model';

// NGRX 
import { Store, select } from '@ngrx/store';
import { AppState } from '../../ngrx-notifications/app.state';
import * as UsersActions from '../../ngrx-notifications/users.actions';


const jwtHelperService = new JwtHelperService();

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterLink, FormsModule, DetailsComponent, NotificationsComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {

  constructor (
    private store: Store<AppState>
  ) {}

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
  ngrxUsers: UserModel[] = [];
  contentToShow: UserModel[] = [];
  showAllUsers() {
    this.gymUsersService.getUsers().subscribe(users => {
      //NGRX
      // updating my state with info from the api
      this.store.dispatch(UsersActions.fillInfo({users}));
      // using the info in my state here
      this.store.pipe(select('listadoDeUsuarios')).subscribe((users: UserModel[])=>{
        this.ngrxUsers = users
      });
      //show the name of the gym on top
      const tokenFromDom: any = localStorage.getItem('token');
      this.gymName = jwtHelperService
        .decodeToken(tokenFromDom)
        .gymName.toUpperCase();

      //show ONLY one GYM Users
      const filteredData = this.ngrxUsers.filter((user) => {
        const tokenFromDom: any = localStorage.getItem('token');
        const owner = jwtHelperService.decodeToken(tokenFromDom).id;
        return user.createdBy === owner;
      });
      this.contentToShow = filteredData;
      this.ngrxUsers = filteredData;
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
    console.log(this.ngrxUsers)
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
    const filteredData = this.ngrxUsers.filter(
      (user) => user.datesToShow.start.slice(3, 6) === this.selectedMonth
    );
    this.contentToShow = filteredData;
  }

  wantedId: string = '';
  byUserId() {
    if (!this.wantedId) {
      this.showAllUsers();
    }
    const sortedData = this.ngrxUsers.filter(
      (user) => user.idNumber.indexOf(this.wantedId) > -1
    );
    this.contentToShow = sortedData;
  }

  nameOrLastName: string = '';
  byNameLastname() {
    if (!this.nameOrLastName) {
      this.showAllUsers();
    }
    const sortedData = this.ngrxUsers.filter(
      (user) =>
        user.fullName.toLowerCase().indexOf(this.nameOrLastName.toLowerCase()) >
        -1
    );
    this.contentToShow = sortedData;
  }

  // Users whose membership expires in 3 days
  aboutToExpire() {
    const sortedData = this.ngrxUsers.filter(
      (user) => user.datesToShow.daysLeft <= 3 && user.datesToShow.daysLeft >= 0
    );
    this.contentToShow = sortedData;
  }

  // Users whose membership expires in 3 days
  expiredMemberships() {
    const sortedData = this.ngrxUsers.filter(
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
