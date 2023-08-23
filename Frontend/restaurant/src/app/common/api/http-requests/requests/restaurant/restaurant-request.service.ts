import { Injectable } from '@angular/core';
import { AuthenticatedRequest } from '../../authenticated-request';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { JwtService } from '../../../jwt/jwt.service';
import { UserPropertyService } from '../../../user-property/user-property.service';

@Injectable({
  providedIn: 'root'
})
export class RestaurantRequestService extends AuthenticatedRequest{

  constructor(httpClient: HttpClient, jwtService : JwtService, private ups : UserPropertyService) {
    super(httpClient, jwtService)
  }

  createRestaurant(restaurantName : string): Observable<any> {
    return this.httpClient.post<any>( this.baseUrl + '/restaurants',{restaurantName : restaurantName}, this.create_options())
  }
}
