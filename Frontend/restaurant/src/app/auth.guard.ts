import { CanActivateFn } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserPropertyService } from './common/api/user-property/user-property.service';


export const authGuard: CanActivateFn = (route : ActivatedRouteSnapshot, state : RouterStateSnapshot) => {

  const bool : boolean = inject(UserPropertyService).isLogged()
  if(bool){

    return bool
  }else{
    inject(Router).navigate(['/authentication/login'])
    return bool
  }


};
