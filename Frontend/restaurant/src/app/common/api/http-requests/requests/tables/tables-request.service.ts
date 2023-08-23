import { Injectable } from '@angular/core';
import { AuthenticatedRequest } from '../../authenticated-request';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { JwtService } from '../../../jwt/jwt.service';
import { UserPropertyService } from '../../../user-property/user-property.service';

@Injectable({
  providedIn: 'root'
})
export class TablesRequestService extends AuthenticatedRequest{

  constructor(httpClient: HttpClient, jwtService : JwtService, private ups : UserPropertyService) {
    super(httpClient, jwtService)
  }


  getTables(): Observable<any>{
    return this.httpClient.get<any>( this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/tables', this.create_options())
  }

  deleteTable(tableId : string): Observable<any>{
    return this.httpClient.delete<any>( this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/tables/' + tableId, this.create_options())
  }

  addTable(tableData: { tableNumber: string; maxSeats: number }): Observable<any> {
    return this.httpClient.post<any>( this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/items', tableData, this.create_options())
  }

  getTablesNotEmpty(): Observable<any> {
    return this.httpClient.get<any>( this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/tables?isFull=True', this.create_options())
  }
}
