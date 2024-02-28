import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; 
import { LoginModel } from '../interfaces/login-model';

@Injectable({
  providedIn: 'root',
})
export class LoginServiceService {
  constructor() {}

  API_URL: string = 'https://gymowners.vercel.app/login';
  httpClient = inject(HttpClient);
  router = inject(Router)

  checkLogin(loginModel: LoginModel) {
    return this.httpClient.post(this.API_URL, loginModel);
  }

  validateToken(token: string) {
    return this.httpClient.get(`${this.API_URL}/${token}`);
  }

  isLoggedIn() {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      return false;
    }
  }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
