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
export class GroupsRequestService extends AuthenticatedRequest{

  constructor(httpClient: HttpClient, jwtService : JwtService, private ups : UserPropertyService) {
    super(httpClient, jwtService)
  }

  getGroupFromTable(tableId: string): Observable<any> {
    return this.httpClient.get<any>( this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/tables/' + tableId + '/group', this.create_options())
  }

  removeGroupFromTable(tableId: string): Observable<any> {
    return this.httpClient.delete<any>( this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/tables/' + tableId + '/group', this.create_options())
  }

  addGroupToTable(tableId: string, newCustomerGroup: any): Observable<any> {
    return this.httpClient.post<any>( this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/tables/' + tableId + '/group', newCustomerGroup, this.create_options())
  }

  getGroups(): Observable<any> {
    return this.httpClient.get<any>( this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/groups', this.create_options())
  }
}
