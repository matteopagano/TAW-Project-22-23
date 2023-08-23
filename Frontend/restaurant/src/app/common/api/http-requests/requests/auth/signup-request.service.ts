import { Injectable } from '@angular/core';
import { HttpClient, HttpParamsOptions } from '@angular/common/http';
import { BaseRequest } from '../../base-request';
import { Observable, catchError, tap } from 'rxjs';
import { JwtService } from '../../../jwt/jwt.service';
import { RequestOptions } from '../../base-request';
import { Credentials } from '../../auth-request';

@Injectable({
  providedIn: 'root'
})
export class SignupRequestService extends BaseRequest{

  constructor(httpClient: HttpClient) {
    super(httpClient)
  }

  signup(username : string, email:string, password:string, restaurantName:string) : Observable<any>{

    const url: string = `${this.baseUrl}/login`;

    const requestBody = {
      username: username,
      email: email,
      password: password,
      restaurantName : restaurantName
    }
    const reqOptions : RequestOptions = super.create_options()

    return this.httpClient.post( this.baseUrl + '/signup', requestBody, {headers : reqOptions.headers}).pipe(
      tap( (data) => {
        console.log(data)
      }));
  }
}
