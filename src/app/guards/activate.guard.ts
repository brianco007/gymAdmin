import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core'; 
import { LoginServiceService } from '../services/login-service.service'; 

export const activateGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginServiceService);
  const router = inject(Router)

  if(loginService.isLoggedIn()){
    
    return true ;

  } else {
    router.navigate(['/login'])
    return false ;
  }
};
