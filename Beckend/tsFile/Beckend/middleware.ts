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

export function isOwnerMiddleware(req , res , next){
  console.log("Printo i params : ")
  console.log(req.params)
  const user : User.User = new User.UserModel(req.auth)
  if(user.isOwner()){
    return next();
  }else{
    return next({ statusCode:404, error: true, errormessage: "You are not Owner" });
  }
}

export function isOwnerOfThisRestaurant(req , res , next){
  Owner.OwnerModel.findById(req.auth._id)
    .then((ownerFind) => {
      if(ownerFind){
        if(ownerFind.isOwnerOf(req.params.idr)){
          return next();
        }else{
          next({ statusCode:404, error: true, errormessage: "You are not owner of id: " + req.params.idr  + " restaurant."})
        }
      }else{
        next({ statusCode:404, error: true, errormessage: "User not found" })
      }
      const idRestaurant : Schema.Types.ObjectId = new Schema.Types.ObjectId(req.params.idr)

    }).catch((error)=>{
      next({ statusCode:404, error: true, errormessage: "error in the DB" })
    })
}

export async function hasNotAlreadyARestaurant(req , res , next){
  const owner : Owner.Owner = await Owner.OwnerModel.findById(req.auth._id)
  if(!owner.hasAlreadyARestaurant()){
    next();
  }else{
    return next({statusCode : 404, error: true, errormessage: "Owner: " + owner._id + " has already a restaurant. restaurantId:" + owner.restaurantOwn.toString()})
  }
}

export async function hasAlreadyARestaurant(req , res , next){
  const owner : Owner.Owner = await Owner.OwnerModel.findById(req.auth._id)
  if(owner.hasAlreadyARestaurant()){
    next();
  }else{
    return next({statusCode : 404, error: true, errormessage: "Owner: " + owner._id + " has already a restaurant. restaurantId:" + owner.restaurantOwn.toString()})
  }
}

export const basicAuthentication = passport.authenticate('basic', { session: false })