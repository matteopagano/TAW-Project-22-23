import { Injectable } from '@angular/core';
import { AuthenticatedRequest } from '../../authenticated-request';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { JwtService } from '../../../jwt/jwt.service';
import { UserPropertyService } from '../../../user-property/user-property.service';


@Injectable({
  providedIn: 'root'
})
export class RecipesRequestService extends AuthenticatedRequest{

  constructor(httpClient: HttpClient, jwtService : JwtService, private ups : UserPropertyService) {
    super(httpClient, jwtService)
  }

  calculateRecipe(tableId: string): Observable<any> {
    return this.httpClient.post<any>( this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/tables/' + tableId + '/group/recipe',{}, this.create_options())
  }

  getRecipes(): Observable<any> {
    return this.httpClient.get<any>( this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/recipes', this.create_options());
  }
}
