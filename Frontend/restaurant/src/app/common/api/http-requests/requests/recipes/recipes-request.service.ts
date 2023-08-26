import { Injectable } from '@angular/core';
import { AuthenticatedRequest } from '../../authenticated-request';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { JwtService } from '../../../jwt/jwt.service';
import { UserPropertyService } from '../../../user-property/user-property.service';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class RecipesRequestService extends AuthenticatedRequest{

  constructor(httpClient: HttpClient, jwtService : JwtService, private ups : UserPropertyService) {
    super(httpClient, jwtService)
  }

  calculateRecipe(tableId: string): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + '/restaurants/' + this.ups.getRestaurant() + '/tables/' + tableId + '/group/recipe', {}, this.create_options())
      .pipe(
        catchError((error) => {
          console.error('Errore durante il calcolo della ricetta:', error);
          return throwError(error);
        })
      );
  }

  getRecipes(): Observable<any> {
    return this.httpClient.get<any>( this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/recipes', this.create_options());
  }

  getRecipe(idRecipe : string): Observable<any> {
    return this.httpClient.get<any>( this.baseUrl + '/restaurants/' + this.ups.getRestaurant() +'/recipes/' + idRecipe, this.create_options());
  }
}
