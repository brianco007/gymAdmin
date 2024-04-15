import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('HomeComponent', () => {
  // global variables
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  // All imports including mock dependencies
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule.withRoutes([])],
    }).compileComponents();
  });

  // to avoid writing fixture everywhere
  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('component should be created', () => {
    expect(component).toBeTruthy();
  });

  it("component should render a CTA Button", (() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('a').textContent).toContain('Comenzar Ahora');
  }));

  it("CTA Button must have a Bootstrap class for a red background.", ()=>{
    const buttonElement = fixture.debugElement.query(By.css('a'));
    expect(buttonElement).toBeTruthy(); 
    expect(buttonElement.nativeElement.classList.contains('bg-danger')).toBeTruthy();
  })
});
