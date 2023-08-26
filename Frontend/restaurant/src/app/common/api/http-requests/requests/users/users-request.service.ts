import { Injectable } from '@angular/core';
import { AuthenticatedRequest } from '../../authenticated-request';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { JwtService } from '../../../jwt/jwt.service';
import { CashiersResponse, WaitersResponse, CookersResponse, BartendersResponse, User, UserCreateResponse} from 'src/app/common/interfaces/api/users/users-api-interfaces';
import { UserPropertyService } from '../../../user-property/user-property.service';


@Injectable({
  providedIn: 'root'
})
export class UsersRequestService extends AuthenticatedRequest{

  constructor(httpClient: HttpClient, jwtService : JwtService, private ups : UserPropertyService) {
    super(httpClient, jwtService)
   }


  get_cashiers(): Observable<CashiersResponse> {
    return this.httpClient.get<CashiersResponse>( this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/cashiers', this.create_options())
  }

  get_waiters(): Observable<WaitersResponse> {
    return this.httpClient.get<WaitersResponse>( this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/waiters', this.create_options())
  }

  delete_cashier(cashierId: string): Observable<any> {
    return this.httpClient.delete<any>(this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/cashiers/' + cashierId, this.create_options());
  }

  delete_waiter(waiterId: string): Observable<any> {
    return this.httpClient.delete<any>(this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/waiters/' + waiterId, this.create_options());
  }

  get_cooks(): Observable<CookersResponse> {
    return this.httpClient.get<CookersResponse>( this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/cooks', this.create_options())
  }

  get_bartenders(): Observable<BartendersResponse> {
    return this.httpClient.get<BartendersResponse>( this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/bartenders', this.create_options())
  }

  delete_cook(cookerId: string): Observable<any> {
    return this.httpClient.delete<any>(this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/waiters/' + cookerId, this.create_options());
  }

  delete_bartender(bartenderId: string): Observable<any> {
    return this.httpClient.delete<any>(this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/waiters/' + bartenderId, this.create_options());
  }

  create_user(user: User): Observable<UserCreateResponse> {
    let endpoint: string;

    switch (user.role) {
      case "cashier":
        endpoint = this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/cashiers'
        break;
      case "bartender":
        endpoint = this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/bartenders'
        break;
      case "cooker":
        endpoint = this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/cooks'
        break;
      case "waiter":
        endpoint = this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/waiters'
        break;
      default:
        throw new Error("role not known")
    };

    return this.httpClient.post<any>(endpoint, user, this.create_options());
  }
}
