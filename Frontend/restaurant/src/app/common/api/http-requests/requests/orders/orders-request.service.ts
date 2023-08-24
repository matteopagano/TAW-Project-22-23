import { Injectable } from '@angular/core';
import { AuthenticatedRequest } from '../../authenticated-request';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { JwtService } from '../../../jwt/jwt.service';
import { UserPropertyService } from '../../../user-property/user-property.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersRequestService extends AuthenticatedRequest{

  constructor(httpClient: HttpClient, jwtService : JwtService, private ups : UserPropertyService) {
    super(httpClient, jwtService)
  }


  getOrdersByTable(tableId: string): Observable<any> {
    return this.httpClient.get<any>( this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/tables/' + tableId + '/group/orders', this.create_options())
  }

  getOrdersDishNotStartedByTable(tableId: string): Observable<any> {
    return this.httpClient.get<any>( this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/tables/' + tableId + '/group/orders?type=dish&notStarted=true', this.create_options())
  }

  getOrdersDrinkNotStartedByTable(tableId: string): Observable<any> {
    return this.httpClient.get<any>( this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/tables/' + tableId + '/group/orders?type=drink&notStarted=true', this.create_options())
  }

  createGroupOrder(tableId: string, order : any): Observable<any> {
    return this.httpClient.post<any>( this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/tables/' + tableId + '/group/orders', order, this.create_options())
  }

  modifyItemOfOrderCompleted(tableId: string, orderId: string, itemId: string): Observable<any> {
    return this.httpClient.put<any>( this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/tables/' + tableId + '/group/orders/' + orderId + '/items/' + itemId, {status : "completed", completedBy : this.ups.getId()},this.create_options())
  }

  modifyOrderReady(tableId: string, orderId: string): Observable<any> {
    return this.httpClient.put<any>( this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/tables/' + tableId + '/group/orders/' + orderId, {status : "ready"},this.create_options())
  }

  modifyOrderServed(tableId: string, orderId: string): Observable<any> {
    return this.httpClient.put<any>( this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/tables/' + tableId + '/group/orders/' + orderId, {status : "served"},this.create_options())
  }
}
