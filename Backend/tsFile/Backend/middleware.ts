import passport = require('passport');           // authentication middleware for Express
import passportHTTP = require('passport-http');
import * as User from '../Model/User';
import * as Owner from '../Model/Owner';
import { BartenderModel } from '../Model/Bartender';
import { CashierModel } from '../Model/Cashier';
import { CookModel } from '../Model/Cook';
import * as Waiter from '../Model/Waiter';
import { expressjwt as jwt } from 'express-jwt';  
import { Schema, model, Document} from 'mongoose';
import * as Restaurant from '../Model/Restaurant';
import * as Group from '../Model/Group';

passport.use( new passportHTTP.BasicStrategy(
    async function(username : string, password : string, done : Function) {
  
      let user : User.User = await User.UserModel.findOne( {email: username})
      
        
      if( !user ) {
        return done(null,false,{statusCode: 500, error: true, errormessage:"Invalid user"});
      }
  
      if(user.isPasswordCorrect(password)){

        switch (user.role){
          case 'owner' : user = new Owner.OwnerModel(user); break;
          case 'bartender' : user = new BartenderModel(user); break;
          case 'cashier' : user = new CashierModel(user); break;
          case 'cook' : user = new CookModel(user); break;
          case 'waiter' : user = new Waiter.WaiterModel(user); break;
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
  const user : User.User = new User.UserModel(req.auth)
  if(user.isOwner()){
    return next();
  }else{
    return next({ statusCode:404, error: true, errormessage: "You are not Owner" });
  }
}

export function isWaiter(req , res , next){
  const user : User.User = new User.UserModel(req.auth)
  if(user.isWaiter()){
    return next();
  }else{
    return next({ statusCode:404, error: true, errormessage: "You are not Waiter" });
  }
}

export async function isOwnerOfThisRestaurant(req , res , next){
  const idOwnerAuthenticated = req.auth._id
  const idRistoranteParameter = req.params.idr ;
  const ownerAuthenticated : Owner.Owner = await Owner.OwnerModel.findById(idOwnerAuthenticated)

  if(ownerAuthenticated !== null){
    if(ownerAuthenticated.hasAlreadyARestaurant()){
      if(ownerAuthenticated.isOwnerOf(idRistoranteParameter)){
        return next();
      }else{
        next({ statusCode:404, error: true, errormessage: "You are not owner of id: " + idRistoranteParameter  + " restaurant."})
      }
    }else{
      return next({ statusCode:404, error: true, errormessage: "owner:" + ownerAuthenticated._id + " has not restaurant" })
    }
  }else{
    next({ statusCode:404, error: true, errormessage: "User not found" })
  }
}

export async function isCustomerRestaurantTheSameAsWaiter(req , res , next){

  const idWaiterAuthenticated = req.auth._id
  const idRistoranteParameter = req.params.idr ;
  const idCustomerGroup = req.params.idc


  const customerGroup : Group.Group = await Group.GroupModel.findById(idCustomerGroup)
  const waiterAuthenticated : Waiter.Waiter = await Waiter.WaiterModel.findById(idWaiterAuthenticated)


  if(waiterAuthenticated !== null){
    if(customerGroup !== null){
      if(waiterAuthenticated.idRestaurant.toString() === customerGroup.idRestaurant.toString()){
        return next();
      }else{
        return next({ statusCode:404, error: true, errormessage: customerGroup._id + " is not customergroup of the waiter " + waiterAuthenticated._id})
      }
    }else{
      next({ statusCode:404, error: true, errormessage: "customerGroup not found not found" })
    }
    
  }else{
    next({ statusCode:404, error: true, errormessage: "Waiter not found" })
  }
}



export async function hasNotAlreadyARestaurant(req , res , next){
  const idOwner = req.auth._id;
  const owner : Owner.Owner = await Owner.OwnerModel.findById(idOwner)

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


export async function isCookMemberOfThatRestaurant(req , res , next){

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

export async function isDayOfThatRestaurant(req , res , next){

  const idDayToRemove = req.params.idd;
  const restaurantIdInWhichRemoveDay = req.params.idr
  const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(restaurantIdInWhichRemoveDay)

  if(restaurant.isDayPresent(idDayToRemove)){
    next();
  }else{
    next({ statusCode:404, error: true, errormessage: "day " + idDayToRemove + " is not day of " + restaurantIdInWhichRemoveDay })
  }
}

export function isValidRestaurantInput(req , res , next){
  const restaurantNameBody = req.body.restaurantName
  if(Restaurant.checkNameCorrectness(restaurantNameBody)){
    next()
  }else{
    return next({statusCode:404, error: true, errormessage: "Restaurant name not valid. Name's length must be less than 16. restaurant name : " + restaurantNameBody})
  }
}

export async function isUserAlreadyExist(req , res , next){
  const emailBody = req.body.email
  const userFind = await User.UserModel.findOne({email : emailBody})

  if(!userFind){
    next()
  }else{
    return next({statusCode:404, error: true, errormessage: "User : " + emailBody + " already exist."})
  }
}

export async function isTableOfThatRestaurant(req , res , next){

  const tableIdToRemove = req.params.idt;
  const restaurantIdInWhichRemoveTable = req.params.idr
  const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(restaurantIdInWhichRemoveTable)

  if(restaurant.isTablePresent(tableIdToRemove)){
    next();
  }else{
    next({ statusCode:404, error: true, errormessage: "table " + tableIdToRemove + " is not table of " + restaurantIdInWhichRemoveTable })
  }
}

export async function isItemOfThatRestaurant(req , res , next){

  const itemIdToRemove = req.params.idi;
  const restaurantIdInWhichRemoveTable = req.params.idr
  const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(restaurantIdInWhichRemoveTable)

  if(restaurant.isItemPresent(itemIdToRemove)){
    next();
  }else{
    next({ statusCode:404, error: true, errormessage: "item " + itemIdToRemove + " is not item of " + restaurantIdInWhichRemoveTable })
  }
}

export const basicAuthentication = passport.authenticate('basic', { session: false })
