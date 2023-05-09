import { Schema, model, Document} from 'mongoose';

import * as User from '../Model/User';
import * as Cook from '../Model/Cook';
import * as Waiter from '../Model/Waiter';
import * as Cashier from '../Model/Cashier';
import * as Bartender from '../Model/Bartender';
import * as Restaurant from '../Model/Restaurant';

export function generateRandomString(n) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < n; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

export async function createCook(username : string, email : string, password : string, idRestaurant : Schema.Types.ObjectId) : Promise<Cook.Cook> {
    const newCook : Cook.Cook =  new Cook.CookModel({
        username : username,
        email : email,
        role : User.RoleType.COOK,
        dishesCooked : [],
        idRestaurant : idRestaurant
    });
    newCook.setPassword(password);
    return await newCook.save();
}

export async function createWaiter(username : string, email : string, password : string, idRestaurant : Schema.Types.ObjectId) : Promise<Waiter.Waiter> {
  const newWaiter : Waiter.Waiter =  new Waiter.WaiterModel({
      username : username,
      email : email,
      role : User.RoleType.WAITER,
      ordersTaken : [],
      tablesObservered : [],
      idRestaurant : idRestaurant
  });
  newWaiter.setPassword(password);
  return await newWaiter.save();
}

export async function createCashier(username : string, email : string, password : string, idRestaurant : Schema.Types.ObjectId) : Promise<Cashier.Cashier> {
  const newCashier : Cashier.Cashier =  new Cashier.CashierModel({
      username : username,
      email : email,
      role : User.RoleType.CASHIER,
      receiptsPrinted : [],
      idRestaurant : idRestaurant
  });
  newCashier.setPassword(password);
  return await newCashier.save();
}
export async function createBartender(username : string, email : string, password : string, idRestaurant : Schema.Types.ObjectId) : Promise<Bartender.Bartender> {
  const newBartender : Bartender.Bartender =  new Bartender.BartenderModel({
      username : username,
      email : email,
      role : User.RoleType.BARTENDER,
      drinkPrepared : [],
      idRestaurant : idRestaurant
  });
  newBartender.setPassword(password);
  return await newBartender.save();
}


export async function addCookToARestaurant(user : User.User, restaurant : Restaurant.Restaurant){
  restaurant.cookList.push(user._id); 
  await restaurant.save() 
}

export async function addWaiterToARestaurant(user : User.User, restaurant : Restaurant.Restaurant){
  restaurant.waiterList.push(user._id); 
  await restaurant.save() 
}

export async function addCashierToARestaurant(user : User.User, restaurant : Restaurant.Restaurant){
  restaurant.cashierList.push(user._id); 
  await restaurant.save() 
}

export async function addBartenderToARestaurant(user : User.User, restaurant : Restaurant.Restaurant){
  restaurant.bartenderList.push(user._id); 
  await restaurant.save() 
}

export async function deleteEmployeeFromRestaurant(idUser : Schema.Types.ObjectId, idRestaurant : Schema.Types.ObjectId){
  /*const restaurantFound : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(idRestaurant.toString())
  const index = restaurantFound.employeesList.indexOf(idUser);
  if (index !== -1) {
    restaurantFound.employeesList.splice(index, 1);
  }
  await restaurantFound.save() 
  */
}


