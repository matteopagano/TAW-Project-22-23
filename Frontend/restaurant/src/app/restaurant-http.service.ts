import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import jwt_decode from "jwt-decode";
import { UserHttpService } from './user-http.service';


interface Cashier {
  _id: string;
  recipesPrinted: string[];
  username: string;
  email: string;
  role: string;
  idRestaurant: string;
  salt: string;
  digest: string;
  __v: number;
}

interface CashiersResponse {
  error: boolean;
  errormessage: string;
  cashiers: Cashier[];
}

interface Waiter {
  _id: string;
  ordersAwaiting: string[];
  ordersServed: string[];
  username: string;
  email: string;
  role: string;
  idRestaurant: string;
  salt: string;
  digest: string;
  __v: number;
}

interface WaitersResponse {
  error: boolean;
  errormessage: string;
  waiters: Waiter[];
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  // Aggiungi altre proprietà se necessario
}

@Injectable({
  providedIn: 'root'
})
export class RestaurantHttpService {

  private token: string = '';
  public url = 'http://localhost:3000';

  constructor( private http: HttpClient, private us: UserHttpService) {
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        'body was: ' + JSON.stringify(error.error));
    }

    return throwError(() => new Error('Something bad happened; please try again later.') );
  }

  private create_options( params = {} ) {
    return  {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + this.us.get_token(),
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
      }),
      params: new HttpParams( {fromObject: params} )
    };

  }

  get_cashiers(): Observable<CashiersResponse> {
    console.log(this.us.get_restaurant())
    console.log(this.us.url + '/restaurants/' + this.us.get_restaurant() +'/cashiers')
    const prova = this.http.get<CashiersResponse>( this.us.url + '/restaurants/' + this.us.get_restaurant() +'/cashiers', this.create_options())
    console.log(prova)
    return prova
  }

  get_waiters(): Observable<WaitersResponse> {
    console.log(this.us.get_restaurant())
    console.log(this.us.url + '/restaurants/' + this.us.get_restaurant() +'/waiters')
    const prova = this.http.get<WaitersResponse>( this.us.url + '/restaurants/' + this.us.get_restaurant() +'/waiters', this.create_options())
    console.log(prova)
    return prova
  }

  delete_cashier(cashierId: string): Observable<any> {
    return this.http.delete<any>(this.us.url + '/restaurants/' + this.us.get_restaurant() +'/cashiers/' + cashierId, this.create_options());
  }

  delete_waiter(waiterId: string): Observable<any> {
    return this.http.delete<any>(this.us.url + '/restaurants/' + this.us.get_restaurant() +'/waiters/' + waiterId, this.create_options());
  }

  create_user(user: User): Observable<any> {
    let endpoint: string;

    if (user.role === 'cashier') {
      endpoint = `${this.url}/restaurants/${this.us.get_restaurant()}/cashiers`;
    } else {
      endpoint = `${this.url}/restaurants/${this.us.get_restaurant()}/waiters`;
    }

    const options = this.create_options();

    return this.http.post<any>(endpoint, user, options);
  }
}
