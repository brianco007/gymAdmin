import { Component, inject} from '@angular/core';
import { GymUsersService } from '../../services/gym-users.service';
import { ActivatedRoute } from '@angular/router'; // to take info from routes
import { RouterLink } from '@angular/router';

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
  dateStart: string = '';
  dateEnd: string = '';
  daysLeft: number = 0;
  getOneUser(id: string) {
    this.gymUsersService.showOneUser(id).subscribe((res: any) => {
      this.userInfo = res
      this.dateStart = this.calculateExpiryDate(this.userInfo.dateStart).start;
      this.dateEnd = this.calculateExpiryDate(this.userInfo.dateStart).end
      this.daysLeft = this.calculateExpiryDate(this.userInfo.dateStart).daysLeft
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

  calculateExpiryDate (startDate: string){
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Deciembre']

    // START
    const newStartDate = new Date(startDate);
    // add more day
    const newStartDate2 = newStartDate.getTime() + (1 * 24 * 60 * 60 * 1000)
    const newStartDate3 = new Date(newStartDate2)
    // formating the date
    const formatedStartDate = ("0" + newStartDate3.getDate()).slice(-2) + " " + months[newStartDate3.getMonth()] + ", " + newStartDate3.getFullYear()

    //END
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

  daysLeftColor(days: any){
    if(days <= 0){
      return 'data text-dark d-flex'
    } else {
      return 'data text-dark d-flex'
    }
  }
  
}
