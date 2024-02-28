import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '../interfaces/store';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor() {}

  API_URL: string = 'https://clientsdata.vercel.app/store';
  httpClient = inject(HttpClient);

  // GET REQUESTS
  getProducts() {
    return this.httpClient.get(this.API_URL);
  }
  getOneProduct(id: string) {
    return this.httpClient.get(`${this.API_URL}/${id}`);
  }

  // CREATE Product
  postProduct(productDetails: Store) {
    return this.httpClient.post(this.API_URL, productDetails);
  }

  // EDIT Product
  updateProduct(id: string, productDetails: Store) {
    return this.httpClient.put(`${this.API_URL}/${id}`, productDetails);
  }

  // DELETE
  deleteProduct(id: string) {
    return this.httpClient.delete(`${this.API_URL}/${id}`);
  }
}
