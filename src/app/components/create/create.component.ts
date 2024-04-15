import { Component, inject } from '@angular/core';
import { UserModel } from '../../interfaces/user-model';
import { GymUsersService } from '../../services/gym-users.service';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt'; // decode token

const jwtHelperService = new JwtHelperService();


@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  gymUsersService = inject(GymUsersService);

  assignOwner(){
    const tokenFromDom: any = localStorage.getItem('token');
    const owner = jwtHelperService.decodeToken(tokenFromDom).id
    return owner
  }

  userData: UserModel = {
    fullName: "",
    idNumber: "",
    startDate: "",
    endDate: "",
    createdBy: this.assignOwner(),  
    phone: "",
    email: "",
    notes: "", 
    datesToShow: {
      daysLeft: 0,
      end: '',
      start: ''
    },
    _id: ''
  }

  userInfo: any;
  popupMessage: string = ''
  router = inject(Router);
  createUser(){
    this.gymUsersService.createUser(this.userData).subscribe((res: any)=>{
      if(this.userData.fullName && this.userData.idNumber && this.userData.startDate && this.userData.endDate){
        this.userInfo = res;
        this.router.navigate(["/users"])
      } else {
        this.popupMessage = 'Nombre, identificación y las fechas son campos obligatorios.'
      }
    })

  }
}
