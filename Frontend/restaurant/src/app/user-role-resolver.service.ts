import { Injectable } from '@angular/core';
import { UserPropertyService } from './common/api/user-property/user-property.service';
import { JwtService } from './common/api/jwt/jwt.service';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserRoleResolverService {

  constructor(
    private userPropertyService: UserPropertyService,
    private jwtService: JwtService
  ) {}

  resolve(route: ActivatedRouteSnapshot): string | null {
    try {
      const userRole = this.userPropertyService.getRule();
      return userRole;
    } catch {
      return null;
    }
  }
}
