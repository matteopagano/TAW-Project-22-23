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

  constructor() { }

  getRule(){
    const rule : string | null = localStorage.getItem(environment.localStorageRule);
    if(rule === null){
      throw new Error("Rule is not set")
    }
    return rule
  }

  getId(){
    const id : string | null = localStorage.getItem(environment.localStorageId);
    if(id === null){
      throw new Error("Id is not set")
    }
    return id
  }

  getRestaurant(){
    const restaurant : string | null = localStorage.getItem(environment.localStorageRestaurant);
    if(restaurant === null){
      throw new Error("Id is not set")
    }
    return restaurant
  }

  storeRule(rule : string): void{
    localStorage.setItem(environment.localStorageRule, rule);
  }

  storeId(id : string): void {
    localStorage.setItem(environment.localStorageId, id);
  }

  storeRestaurant(restaurant : string){
    localStorage.setItem(environment.localStorageRestaurant, restaurant);
  }

  storeAllProperty(token : string) : void{
    const tokenData = jwt_decode(token) as TokenData
    this.storeRule(tokenData.role)
    this.storeRestaurant(tokenData.restaurantId.toString())
    this.storeId(tokenData._id)
  }

  isLogged() : boolean {
    const rule : string | null = localStorage.getItem(environment.localStorageRule);
    if(rule === null){
      return false
    }else{
      return true
    }
  }

  logout() : void {
    localStorage.removeItem(environment.localStorageTokenKey);
    localStorage.removeItem(environment.localStorageRestaurant);
    localStorage.removeItem(environment.localStorageRule);
    localStorage.removeItem(environment.localStorageId);
  }

}
