import passport = require('passport');           // authentication middleware for Express
import passportHTTP = require('passport-http');
import * as User from '../Model/User';
import * as Owner from '../Model/Owner';
import { BartenderModel } from '../Model/Bartender';
import { CashierModel } from '../Model/Cashier';
import { CookModel } from '../Model/Cook';
import { WaiterModel } from '../Model/Waiter';
import { expressjwt as jwt } from 'express-jwt';  
import { Schema, model, Document} from 'mongoose';
import * as Restaurant from '../Model/Restaurant';

passport.use( new passportHTTP.BasicStrategy(
    async function(username : string, password : string, done : Function) {
  
      let user : User.User = await User.UserModel.findOne( {email: username})
      
        
      if( !user ) {
        return done(null,false,{statusCode: 500, error: true, errormessage:"Invalid user"});
      }
      console.log(user)
  
      if(user.isPasswordCorrect(password)){

        switch (user.role){
          case 'owner' : user = new Owner.OwnerModel(user); break;
          case 'bartender' : user = new BartenderModel(user); break;
          case 'cashier' : user = new CashierModel(user); break;
          case 'cook' : user = new CookModel(user); break;
          case 'waiter' : user = new WaiterModel(user); break;
        }
        return done(null, user);
      }else{
  
        return done(null,false,{statusCode: 500, error: true, errormessage:"Invalid password"});
      }
    }
));

export const verifyJWT = jwt({
  secret: process.env.JWT_SECRET, 
  algorithms: ["HS256"]
});

export function isOwner(req , res , next){
  console.log("Printo i params : ")
  console.log(req.params)
  const user : User.User = new User.UserModel(req.auth)
  if(user.isOwner()){
    return next();
  }else{
    return next({ statusCode:404, error: true, errormessage: "You are not Owner" });
  }
}

export async function isOwnerOfThisRestaurant(req , res , next){
  const owner : Owner.Owner = await Owner.OwnerModel.findById(req.auth._id)

  if(owner){
    if(owner.restaurantOwn === null){
      return next({ statusCode:404, error: true, errormessage: "owner:" + owner._id + " has  non restaurant" })
    }else{
      if(owner.isOwnerOf(req.params.idr)){
          return next();
        }else{
          next({ statusCode:404, error: true, errormessage: "You are not owner of id: " + req.params.idr  + " restaurant."})
        }
      }
  }else{
    next({ statusCode:404, error: true, errormessage: "User not found" })
  }

  
}

export async function hasNotAlreadyARestaurant(req , res , next){
  const owner : Owner.Owner = await Owner.OwnerModel.findById(req.auth._id)
  if(owner){
    if(!owner.hasAlreadyARestaurant()){
      next();
    }else{
      return next({statusCode : 404, error: true, errormessage: "Owner: " + owner._id + " has already a restaurant. restaurantId:" + owner.restaurantOwn.toString()})
    }
  }else{
    return next({statusCode : 404, error: true, errormessage: "Owner with id: " + req.auth._id + " doesn't exist"})
  }
  
}

export async function hasAlreadyARestaurant(req , res , next){
  const owner : Owner.Owner = await Owner.OwnerModel.findById(req.auth._id)
  if(owner){
    if(owner.hasAlreadyARestaurant()){
      next();
    }else{
      return next({statusCode : 404, error: true, errormessage: "Owner: " + owner._id + " doesn't have already a restaurant."})
    }
  }else{
    return next({statusCode : 404, error: true, errormessage: "Owner with id: " + req.auth._id + " doesn't exist"})
  }
  
}

export async function isCookMemberOfThatRestaurant(req , res , next){

  console.log("debug 2")
  const cookIdToRemove = req.params.idu;
  const restaurantIdInWhichRemoveCook = req.params.idr
  const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(restaurantIdInWhichRemoveCook)
  if(restaurant.isCookPresent(cookIdToRemove)){
    next();
  }else{
    next({ statusCode:404, error: true, errormessage: "cook " + cookIdToRemove + " is not member of " + restaurantIdInWhichRemoveCook })
  }
}

export async function isWaiterMemberOfThatRestaurant(req , res , next){

  const waiterIdToRemove = req.params.idu;
  const restaurantIdInWhichRemoveWaiter = req.params.idr
  const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(restaurantIdInWhichRemoveWaiter)

  if(restaurant.isWaiterPresent(waiterIdToRemove)){
    next();
  }else{
    next({ statusCode:404, error: true, errormessage: "waiter " + waiterIdToRemove + " is not member of " + restaurantIdInWhichRemoveWaiter })
  }
}

export async function isCashierMemberOfThatRestaurant(req , res , next){

  const cashierIdToRemove = req.params.idu;
  const restaurantIdInWhichRemoveCashier = req.params.idr
  const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(restaurantIdInWhichRemoveCashier)

  if(restaurant.isCashierPresent(cashierIdToRemove)){
    next();
  }else{
    next({ statusCode:404, error: true, errormessage: "cashier " + cashierIdToRemove + " is not member of " + restaurantIdInWhichRemoveCashier })
  }
}

export async function isBartenderMemberOfThatRestaurant(req , res , next){

  const bartenderIdToRemove = req.params.idu;
  const restaurantIdInWhichRemoveBartender = req.params.idr
  const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(restaurantIdInWhichRemoveBartender)

  if(restaurant.isBartenderPresent(bartenderIdToRemove)){
    next();
  }else{
    next({ statusCode:404, error: true, errormessage: "bartender " + bartenderIdToRemove + " is not member of " + restaurantIdInWhichRemoveBartender })
  }
}

export const basicAuthentication = passport.authenticate('basic', { session: false })