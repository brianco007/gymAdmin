import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms'; 
import { SignupModel } from '../../interfaces/signup-model copy'; 
import { SignupService } from '../../services/signup.service'; 
import { Router } from '@angular/router'; 
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NavbarComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
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

  signupModel: SignupModel = {
    email: '',
    gymName: '',
    password: ''
  }

  router = inject(Router)                  
  signupService = inject(SignupService)
  handleSubmit(){
    if(this.signupModel.email || this.signupModel.gymName || this.signupModel.password){
      this.signupService.signUpNewUser(this.signupModel).subscribe((res: any)=>{
        if(res.status === 'success'){
          console.log(res)
          this.router.navigate(['/login'])
        }
      })
    }
  }
}
