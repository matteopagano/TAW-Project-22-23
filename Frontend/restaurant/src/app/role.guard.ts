import { ActivatedRoute, ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { UserPropertyService } from './common/api/user-property/user-property.service';
import { Router } from '@angular/router';


export const roleGuard: CanActivateFn = (route : ActivatedRouteSnapshot, state : RouterStateSnapshot) => {
  const rule : string = inject(UserPropertyService).getRule()
  const rolePermitted = route.data['rolePermitted'];
  if(rule === rolePermitted){
    return true
  }else{
    inject(Router).navigate(['/permission-denied'])
    return false
  }
};

export const roleChildGuard: CanActivateChildFn = (route : ActivatedRouteSnapshot, state : RouterStateSnapshot) => {
  const rule : string = inject(UserPropertyService).getRule()
  const rolePermitted = route.data['rolePermitted'];
  if(rule === rolePermitted){
    return true
  }else{
    inject(Router).navigate(['/permission-denied'])
    return false
  }
};
