import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { UserModel } from '../interfaces/user-model';


@Injectable({
  providedIn: 'root'
})
export class GymUsersService {
  constructor() { }

  API_URL: string = 'https://clientsdata.vercel.app/users/'
  httpClient = inject(HttpClient)

  // GET REQUESTS
  getUsers(){
    return this.httpClient.get(this.API_URL)
  }
  showOneUser(id: string){
    return this.httpClient.get(`${this.API_URL}${id}`)
  }

  // CREATE USER
  createUser(userModel: UserModel){
    return this.httpClient.post(this.API_URL, userModel)
  }

  // EDIT USER
  editUser(id: string, userModel: UserModel){
    return this.httpClient.put(`${this.API_URL}${id}`, userModel)
  }

  // DELETE 
  deleteUser(id: string){
    return this.httpClient.delete(`${this.API_URL}${id}`)
  }
}
