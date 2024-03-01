import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { SignupModel } from '../../interfaces/signup-model copy';
import { SignupService } from '../../services/signup.service';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NavbarComponent, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  // userData = new FormGroup({
  //   email: new FormControl('', Validators.required),
  //   gymName: new FormControl('', Validators.required),
  //   password: new FormControl('', Validators.required)
  // })

  // handleSubmit(){
  //   if(this.userData.valid){
  //     const email = userData.value.email;
  //     const gymName = userData.value.gymName;
  //     const password = userData.value.password;

  //     if(
  //       typeof email === 'string' &&
  //       typeof gymName === 'string' &&
  //       typeof password === 'string'
  //     ) {
  //       const signupModel: SignupModel = {
  //         email,
  //         gymName,
  //         password
  //       };

  //       this.signupService.signUpNewUser(this.signupModel).subscribe((res)=>{
  //         console.log(res)
  //       })
  //     }
  //   }
  // }

  // Form Data
  signupModel: SignupModel = {
    email: '',
    gymName: '',
    password: '',
  };

  router = inject(Router);
  signupService = inject(SignupService);

  // get Email from owners for validation
  allOwnersEmails: any[] = [];
  getOwners() {
    this.signupService.getAllOwners().subscribe((res: any) => {
      res.forEach((user: any) => {
        this.allOwnersEmails.push(user.email);
      });
    });
  }

  ngOnInit() {
    this.getOwners();
  }

  invalidEmail: boolean = false;
  emailExists: boolean = false;
  handleSubmit() {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    // confirm all fields are complete
    if (
      this.signupModel.email ||
      this.signupModel.gymName ||
      this.signupModel.password
    ) {
      // check if email has a valid format
      if(emailRegex.test(this.signupModel.email)){
        this.invalidEmail = false;
        // Check if emails is already registered
        if (this.allOwnersEmails.includes(this.signupModel.email)) {
          this.emailExists = true; 
        } else {
          // handle successful sign up
          this.signupService
            .signUpNewUser(this.signupModel)
            .subscribe((res: any) => {
              if (res.status === 'success') {
                this.router.navigate(['/login']);
              }
            });
        }
      } else {
        this.invalidEmail = true;
        this.emailExists = false;
      }
    }
  }
}
