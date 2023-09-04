import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";
import { JwtService } from '../jwt/jwt.service';
import { Schema } from 'mongoose';
import { environment } from 'src/env/enviroment';

interface TokenData {
  username: string,
  role: string,
  email: string,
  _id: string,
  restaurantId : Schema.Types.ObjectId;
}

@Injectable({
  providedIn: 'root'
})
export class UserPropertyService {

  constructor(private jwts : JwtService) { }

  getRule(){
    const token : string = this.jwts.getToken();

    const tokenData = (jwt_decode(token) as TokenData)
    if(token === null){
      throw new Error("User not authenticated")
    }
    return tokenData.role
  }

  getId(){
    const token : string = this.jwts.getToken();

    const tokenData = (jwt_decode(token) as TokenData)
    if(token === null){
      throw new Error("User not authenticated")
    }
    return tokenData._id
  }

  getRestaurant(){
    const token : string = this.jwts.getToken();

    const tokenData = (jwt_decode(token) as TokenData)
    if(token === null){
      throw new Error("User not authenticated")
    }
    return tokenData.restaurantId.toString()
  }


  getEmail(){
    const token : string = this.jwts.getToken();

    const tokenData = (jwt_decode(token) as TokenData)
    if(token === null){
      throw new Error("User not authenticated")
    }
    return tokenData.email.toString()
  }

  getUsername(){
    const token : string = this.jwts.getToken();

    const tokenData = (jwt_decode(token) as TokenData)
    if(token === null){
      throw new Error("User not authenticated")
    }
    return tokenData.username.toString()
  }

  isLogged() : boolean {
    const rule : string | null = localStorage.getItem(environment.localStorageTokenKey);
    if(rule === null){
      return false
    }else{
      return true
    }
  }

  logout() : void {
    console.log("removing")
    localStorage.removeItem(environment.localStorageTokenKey);
    console.log("removed")
  }

}
