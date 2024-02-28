import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; 
import { GymUsersService } from '../../services/gym-users.service'; 
import { RouterLink, Router } from '@angular/router'; 

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.css'
})
export class DeleteComponent {

  // Acces to the id from the URL route
  route = inject(ActivatedRoute)
  id: string = '';
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id']; // Asign the 'id' parameter from the URL
    });

    this.getOneUser(this.id)
  }

  userInfo: any;
  getOneUser(id: string) {
    this.gymUsersService.showOneUser(id).subscribe((res: any) => {
      this.userInfo = res
    })
  }

  // Handle Delete
  gymUsersService = inject(GymUsersService)
  router = inject(Router)
  handleDelete(id: string){
    this.gymUsersService.deleteUser(id).subscribe((res: any)=>{
      this.userInfo = res;
      this.router.navigate(["/users"])
    })
  }

}
