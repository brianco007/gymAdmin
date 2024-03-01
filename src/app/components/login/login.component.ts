import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
} from '@angular/forms';
import { LoginServiceService } from '../../services/login-service.service';
import { LoginModel } from '../../interfaces/login-model';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router'; // navigate through pages
import { NavbarComponent } from '../navbar/navbar.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  userData: LoginModel = {
    email: '',
    password: '',
  };

  router = inject(Router);
  loginService = inject(LoginServiceService);
  message: string = '';
  handleSubmit() {
    if (this.userData.email || this.userData.password) {
      // won't send anything until there's something
      this.loginService.checkLogin(this.userData).subscribe((res: any) => {
        if (res.status === 'success') {
          localStorage.setItem('token', res.token)
          this.router.navigate(['/users']);
        } else {
          this.message = res.message;
        }
      });
    }
  }
}
