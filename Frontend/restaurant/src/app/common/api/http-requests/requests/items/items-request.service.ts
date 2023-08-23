import { Injectable } from '@angular/core';
import { AuthenticatedRequest } from '../../authenticated-request';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { JwtService } from '../../../jwt/jwt.service';
import { UserPropertyService } from '../../../user-property/user-property.service';
import { MenuItemsResponse } from 'src/app/common/interfaces/api/items/items-api-interfaces';

@Injectable({
  providedIn: 'root'
})
export class ItemsRequestService extends AuthenticatedRequest{

  constructor(httpClient: HttpClient, jwtService : JwtService, private ups : UserPropertyService) {
    super(httpClient, jwtService)
  }


  addItem(newItem: any): Observable<void> {
    return this.httpClient.post<any>( this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/items', newItem, this.create_options())
  }

  getItems(): Observable<MenuItemsResponse> {
    return this.httpClient.get<MenuItemsResponse>( this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/items', this.create_options())
  }

  deleteItem(itemId: string): Observable<void> {
    return this.httpClient.delete<void>( this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/items/' + itemId, this.create_options())
  }
}
