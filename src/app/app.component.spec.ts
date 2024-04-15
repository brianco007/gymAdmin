import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {Component, DebugElement} from "@angular/core";
import SpyObj = jasmine.SpyObj;
import { LoginServiceService } from './services/login-service.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';


@Component({
  selector: "app-nav-bar",
  template: "<p>Mock app navbar</p>"
})
class MockAppNavBar {}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockLoginService: SpyObj<LoginServiceService>
  let element: DebugElement;
  let activatedRoute: ActivatedRoute

  beforeEach(() => {
    mockLoginService = jasmine.createSpyObj("LoginServiceService", ["isLoggedIn"]);
    TestBed.configureTestingModule({
      declarations: [
      ],
      providers: [
        {
          provide: LoginServiceService,
          useValue: mockLoginService,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap( {'isLogged':true} )
            
          }}
        }
      ]

    });
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement;

    const answer: boolean = true
    mockLoginService.isLoggedIn.and.returnValue(answer)

    fixture.detectChanges();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Brian Córdoba'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Brian Córdoba');
  });

});
