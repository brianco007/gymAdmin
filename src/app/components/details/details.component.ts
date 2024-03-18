import { Component, inject} from '@angular/core';
import { GymUsersService } from '../../services/gym-users.service';
import { ActivatedRoute } from '@angular/router'; // to take info from routes
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent{ 

  // Show one user details
  gymUsersService = inject(GymUsersService)
  
  userInfo: any;
  daysLeft: number = 0;
  getOneUser(id: string) {
    this.gymUsersService.showOneUser(id).subscribe((res: any) => {
      this.userInfo = res
      this.daysLeft = res.datesToShow.daysLeft;
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

  daysLeftColor(days: any){
    if(days <= 0){
      return 'data text-danger h1 d-flex'
    } else {
      return 'data text-success h1 d-flex'
    }
  }

  router = inject(Router);
  goBackBtn(){
    this.router.navigate(["/users"])
  }
  
}
