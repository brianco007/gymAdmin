import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { NavbarComponent } from './navbar.component';

// for services
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginServiceService } from '../../services/login-service.service';
import { LoginModel } from '../../interfaces/login-model';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({ template: '' })
class DummyComponent {}

describe('NavbarComponent', () => {
  // global variables
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let service: LoginServiceService;
  let httpMock: HttpTestingController;
  let router: Router;

  // All imports including mock dependencies
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NavbarComponent, 
        RouterTestingModule.withRoutes([
          {path: 'home', component: DummyComponent},
        ]), 
        HttpClientTestingModule],
      providers: [LoginServiceService]
    }).compileComponents();

    service = TestBed.inject(LoginServiceService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  }));

  // to avoid writing fixture everywhere
  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify(); 
  });


  it('component should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should get auth response from API', () => {
    const credentials: LoginModel = {email: 'musclemania@gmail.com', password: 'musclemania'};
    const mockResponse = { status: 'success', token: 'AnyToken' };

    // Subscribe to the HTTP request made by the service
    service.checkLogin(credentials).subscribe(res => {
      expect(res).toEqual(mockResponse); // Assert that the data returned by the service matches the expected data
    });

    // Expect a single HTTP request to a specific URL
    const req = httpMock.expectOne('https://gymowners.vercel.app/login');

    // Expect the request to be a GET request
    expect(req.request.method).toBe('POST');

    // Respond to the request with mock data
    req.flush(mockResponse);
  });

  it('navbar should have 4 links', () => {
    const ulElement = fixture.debugElement.query(By.css('ul')); 
    const liElements = ulElement.queryAll(By.css('li')); 
    expect(liElements.length).toBe(4); 
  });


});
