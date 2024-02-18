import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignupModel } from '../interfaces/signup-model copy'; 

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  constructor() {}

  API_URL: string = 'http://localhost:5555/signup/';
  httpClient = inject(HttpClient);

  signUpNewUser(loginModel: SignupModel) {
    return this.httpClient.post(this.API_URL, loginModel);
  }
}
