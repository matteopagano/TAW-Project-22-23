import { Injectable } from '@angular/core';
import { AuthenticatedRequest } from '../../authenticated-request';
import { HttpClient } from '@angular/common/http';
import { JwtService } from '../../../jwt/jwt.service';
import { UserPropertyService } from '../../../user-property/user-property.service';


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

}
