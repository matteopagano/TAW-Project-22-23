import { Schema, model, Document} from 'mongoose';
import * as Cook from '../Model/Cook'
import * as User from '../Model/User'
import * as Restaurant from '../Model/Restaurant';

export function generateRandomString(n) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < n; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

export function createCook(username : string, email : string, password : string, idRestaurant : Schema.Types.ObjectId) : Promise<Cook.Cook> {
    const newCook : Cook.Cook =  new Cook.CookModel({
        username : username,
        email : email,
        role : User.RoleType.COOK,
        dishesCooked : [],
        idRestaurant : Schema.Types.ObjectId
    });
    newCook.setPassword(password);
    return newCook.save();
}

