import { Injectable } from '@angular/core';
import { AuthenticatedRequest } from '../../authenticated-request';
import { HttpClient } from '@angular/common/http';
import { JwtService } from '../../../jwt/jwt.service';
import { UserPropertyService } from '../../../user-property/user-property.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SelfUserRequestService extends AuthenticatedRequest{

  constructor(httpClient: HttpClient, jwtService : JwtService, private ups : UserPropertyService) {
    super(httpClient, jwtService)
  }


  getMySelf(){
    return this.httpClient.get<any>( this.baseUrl + '/users/' + this.ups.getId(), this.create_options())
  }

  modifyPassword(passwordToChange: string, passwordNew: string) {
    return this.httpClient.put<any>(this.baseUrl + '/users/' + this.ups.getId(), { passwordToChange : passwordToChange, newPassword : passwordNew }, this.create_options())
      .pipe(
        catchError((error) => {
          console.error('An error occurred:', error);
          return throwError(error);
        })
      );
  }

}
