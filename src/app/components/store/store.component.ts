import { Component, inject } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginServiceService } from '../../services/login-service.service';
import { Store } from '../../interfaces/store';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2'


const jwtHelperService = new JwtHelperService();

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css',
})
export class StoreComponent {
  storeService = inject(StoreService);
  loginService = inject(LoginServiceService);
  router = inject(Router);

  // GET all products and show them in charts
  gymName: string = '';
  grandTotal: string = '';
  allProducts: any[] = [];
  contentToShow: any[] = [];
  showAllProducts() {
    this.storeService.getProducts().subscribe((res: any) => {
      this.allProducts = res;
      // show gym name on top
      const tokenFromDom: any = localStorage.getItem('token');
      this.gymName = jwtHelperService
        .decodeToken(tokenFromDom)
        .gymName.toUpperCase();

      // filtered data by gym
      const filteredData = this.allProducts.filter((product) => {
        const tokenFromDom: any = localStorage.getItem('token');
        const owner = jwtHelperService.decodeToken(tokenFromDom).id;
        return product.createdBy === owner;
      });
      this.allProducts = filteredData.reverse();

      // show only today's sales
      const sortedData = this.allProducts.filter((product) => {
        const today = new Date().toString().split('').slice(0, 15).join('');
        const productDate = new Date(product.createdAt)
          .toString()
          .split('')
          .slice(0, 15)
          .join('');

        return today === productDate;
      });
      this.contentToShow = sortedData;

      // get Total $$
      this.getTotal('Total de hoy: $', this.contentToShow);
    });
  }

  ngOnInit() {
    this.showAllProducts();
  }

  // CREATE NEW PRODUCT
  assignOwner() {
    const tokenFromDom: any = localStorage.getItem('token');
    const owner = jwtHelperService.decodeToken(tokenFromDom).id;
    return owner;
  }
  productData: Store = {
    concept: '',
    value: NaN,
    quantity: 1,
    notes: '',
    createdBy: this.assignOwner(),
  };
  addNewProduct() {
    if(this.productData.concept && this.productData.value && this.productData.quantity){

      this.storeService.postProduct(this.productData).subscribe((res: any) =>
      {
        this.showAllProducts();
        //Reset form values
        this.productData = {
          concept: '',
          value: NaN,
          quantity: 1,
          notes: '',
          createdBy: this.assignOwner(),
        }
      });
    } else {
      this.noti();
    }
  }

  // DETAILS
  productDetails: any = {
    concept: '',
    value: '',
    quantity: '',
    notes: '',
    createdAt: '',
  };

  //EDIT PRODUCT
  editID: string = '';
  previousData: Store = {
    concept: '',
    value: 0,
    quantity: 0,
    notes: '',
    createdBy: this.assignOwner(),
  };
  getOneProduct(id: string) {
    // function for DETAILS, EDIT and DELETE
    this.storeService.getOneProduct(id).subscribe((res: any) => {
      // EDIT
      this.previousData = res; // This line shows the old info in the inputs
      this.editID = res._id;
      // DETAILS
      this.productDetails = res;
      // DELETE
      this.productName = res.concept;
      this.productID = res._id;
    });


  }
  editProduct(id: string) {
    this.storeService
      .updateProduct(id, this.previousData)
      .subscribe((res: any) => {
        this.showAllProducts();
      });
  }

  // DELETE PRODUCT
  productName: string = '';
  productID: string = '';
  deleteProduct(id: string) {
    this.storeService.deleteProduct(id).subscribe((res: any) => {
      this.showAllProducts();
    });
  }

  // ------- EXTRA FUNCTIONS --------
  // Format prices to COP currency
  currency(num: number) {
    let COP = new Intl.NumberFormat('co-CO');
    return COP.format(num);
  }
  // show total $$
  getTotal(str: string, arr: any) {
    let total = 0;
    arr.forEach((p: any) => {
      total += p.value * p.quantity;
    });
    this.grandTotal = str + this.currency(total);
  }

  // FILTERS
  today() {
    const filteredData = this.allProducts.filter((product) => {
      const today = new Date().toString().split('').slice(0, 15).join('');
      const productDate = new Date(product.createdAt)
        .toString()
        .split('')
        .slice(0, 15)
        .join('');

      return today === productDate;
    });
    this.contentToShow = filteredData;
    // get Total $$
    this.getTotal('Total de hoy: $', this.contentToShow);
  }

  yesterday() {
    const filteredData = this.allProducts.filter((product) => {
      //yesterday to string format
      const today = new Date().getTime();
      const yesterdayInMili = today - 24 * 60 * 60 * 1000;
      const yesterday = new Date(yesterdayInMili)
        .toString()
        .split('')
        .slice(0, 15)
        .join('');

      //product date to string format
      const productDate = new Date(product.createdAt)
        .toString()
        .split('')
        .slice(0, 15)
        .join('');

      return yesterday === productDate;
    });
    this.contentToShow = filteredData;
    // get Total $$
    this.getTotal('Total de ayer: $', this.contentToShow);
  }

  lastWeek() {
    const filteredData = this.allProducts.filter((product) => {
      const todayInMili = new Date().getTime();
      const sevenDaysAgoInMili = todayInMili - 24 * 60 * 60 * 1000 * 7;

      const productInMili = new Date(product.createdAt).getTime();

      return productInMili >= sevenDaysAgoInMili;
    });
    this.contentToShow = filteredData;
    // get Total $$
    this.getTotal('Total en la última semana: $', this.contentToShow);
  }

  lastMonth() {
    const filteredData = this.allProducts.filter((product) => {
      const todayInMili = new Date().getTime();
      const thirtyDaysAgoInMili = todayInMili - (24 * 60 * 60 * 1000) * 30;
      const productInMili = new Date(product.createdAt).getTime();

      return productInMili >= thirtyDaysAgoInMili;
    });
    this.contentToShow = filteredData;
    // get Total $$
    this.getTotal('Total en el último mes: $', this.contentToShow);
  }

  myDate: string = '';
  chooseDate(){
    const sortedData = this.allProducts.filter(product => {
      const stringToDate = new Date(this.myDate).getTime() + (24 * 60 * 60 * 1000);
      const formatedDate = new Date(stringToDate).toString().split('').slice(0, 15).join('');

      const productDate = new Date(product.createdAt)
        .toString()
        .split('')
        .slice(0, 15)
        .join('');
      
      return formatedDate === productDate;
    })
    this.contentToShow = sortedData;

    // get Total $$
    this.getTotal('Total en este día: $', this.contentToShow);
  }

  noti(){
    Swal.fire({
      title: 'No se creó registro.',
      text: 'Por favor, complete todos los campos obligatorios marcados con *',
      icon: 'error',
      confirmButtonText: 'Entendido',
      background: 'rgba(0, 0, 0, .8)',
      color: '#fff',
      confirmButtonColor: '#c64242',
      width: '20rem'
    })
  }
}
