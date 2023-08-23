import { Injectable } from '@angular/core';
import { environment } from 'src/env/enviroment';

@Injectable({
  providedIn: 'root'
})
export class JwtService {


  constructor() { }


  public getToken() : string {
    const token : string | null = localStorage.getItem(environment.localStorageTokenKey);
    if(token === null){
      throw new Error("Token is not set")
    }
    return token
  }

  public storeToken(token : string) :void {
    localStorage.setItem(environment.localStorageTokenKey, token);
  }
}
