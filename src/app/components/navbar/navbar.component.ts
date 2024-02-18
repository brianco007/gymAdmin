import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginServiceService } from '../../services/login-service.service'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  loginService = inject(LoginServiceService);
}
