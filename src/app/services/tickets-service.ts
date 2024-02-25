import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ticketsModel } from '../interfaces/tickets-model'; 


@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  constructor() { }

  API_URL: string = 'https://gymusersdata-405b6a41e1bf.herokuapp.com/tickets/'
  httpClient = inject(HttpClient)

  // GET REQUESTS
  getTickets(){
    return this.httpClient.get(this.API_URL)
  }
  showOneTicket(id: string){
    return this.httpClient.get(`${this.API_URL}${id}`)
  }

  // CREATE Ticket
  createTicket(ticketModel: ticketsModel){
    return this.httpClient.post(this.API_URL, ticketModel)
  }

  // EDIT USER
  editTicket(id: string, ticketModel: ticketsModel){
    return this.httpClient.put(`${this.API_URL}${id}`, ticketModel)
  }

  // DELETE 
  deleteTicket(id: string){
    return this.httpClient.delete(`${this.API_URL}${id}`)
  }
}
