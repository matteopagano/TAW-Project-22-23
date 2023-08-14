import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import jwt_decode from "jwt-decode";
import { Schema } from 'mongoose';

interface TokenData {
  username: string,
  role: string,
  email: string,
  _id: string,
  restaurantId : Schema.Types.ObjectId;
}

interface ReceivedToken {
  token: string
}


export interface User {
  mail:string,
  password:string,
  username:string,
  roles:string[]
};

@Injectable({
  providedIn: 'root'
})
export class UserHttpService {

  private token: string = '';
  public url = 'http://localhost:3000';

  constructor( private http: HttpClient ) {
    console.log('User service instantiated');

  }

  login( mail: string, password: string, remember: boolean ): Observable<any> {

    console.log('Login: ' + mail + ' ' + password );
    const options = {
      headers: new HttpHeaders({
        authorization: 'Basic ' + btoa( mail + ':' + password),
        'cache-control': 'no-cache',
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    };

    return this.http.get( this.url + '/login',  options).pipe(
      tap( (data) => {
        console.log(JSON.stringify(data));
        this.token = (data as ReceivedToken).token;
        if ( remember ) {
          localStorage.setItem('token_auth', this.token as string);
        }

      }));
  }
  logout() {
    console.log('Logging out');
    this.token = '';
    localStorage.removeItem('token_auth');
  }
  get_token() {
    return this.token;
  }
  is_logged(){
    return this.token !== '';
  }
  get_rule(){
    return (jwt_decode(this.token) as TokenData).role
  }

  get_restaurant(){
    console.log(jwt_decode(this.token) as TokenData)
    return (jwt_decode(this.token) as TokenData).restaurantId
  }



}
