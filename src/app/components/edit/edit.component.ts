import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { GymUsersService } from '../../services/gym-users.service'; 
import { UserModel } from '../../interfaces/user-model'; 
import { ActivatedRoute } from '@angular/router'; 
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent {
  gymUsersService = inject(GymUsersService);
  userData: UserModel = {
    fullName: "",
    startDate: "",
    endDate: "",
    idNumber: "",
    createdBy: "" ,
    phone: "",
    email: "",
    notes: "",
    datesToShow: {
      daysLeft: 0,
      end: '',
      start: ''
    }
  }

  router = inject(Router)
  editUser(id: string){
    this.gymUsersService.editUser(id, this.userData).subscribe((res: any)=>{
      this.router.navigate(["/users"]);
    })
  }

  // Show a user's previous details
  pastUserInfo: any;
  getOneUser(id: string) {
    this.gymUsersService.showOneUser(id).subscribe((res: any) => {
      this.pastUserInfo = res
      this.userData = res // This line shows the old info in the inputs
    });
  }
  
  // Acces to the id from the URL route
  route = inject(ActivatedRoute)
  id: string = '';
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id']; // Asign the 'id' parameter from the URL
      this.getOneUser(this.id)
    });
  }
}
