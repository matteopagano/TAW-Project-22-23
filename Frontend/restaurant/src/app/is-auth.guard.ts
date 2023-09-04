import { CanActivateFn, CanActivateChildFn } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { UserPropertyService } from './common/api/user-property/user-property.service';

export const isAuthGuard: CanActivateChildFn = (route, state) => {
  const bool : boolean = inject(UserPropertyService).isLogged()
  if(bool){

    console.log("è loggato")
    switch(inject(UserPropertyService).getRule()){
      case "owner":
        inject(Router).navigate(['/owner-dashboard/users/visualize'])
        break;
      case "cashier":
        inject(Router).navigate(['/cashier-dashboard/tables'])
        break;
      case "bartender":
        inject(Router).navigate(['/bartender-dashboard/queue'])
        break;
      case "cook":
        inject(Router).navigate(['/cooker-dashboard/queue'])
        break;

      case "waiter":
        inject(Router).navigate(['/waiter-dashboard/tables'])
        break;
      default:
    }

    return false
  }else{
    console.log("non è loggato")
    return true
  }
};

