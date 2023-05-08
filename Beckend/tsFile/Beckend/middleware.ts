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
    function(username : string, password : string, done : Function) {
  
      console.log("New login attempt from " + username );
      User.UserModel.findOne( {email: username})
        .then ((user) => {
        
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
          console.log(user)
          return done(null, user);
        }
  
        return done(null,false,{statusCode: 500, error: true, errormessage:"Invalid password"});
      })
      .catch((err) => {
        return done( {statusCode: 500, error: true, errormessage:err} );
      })
    }
));

export const verifyJWT = jwt({
  secret: process.env.JWT_SECRET, 
  algorithms: ["HS256"]
});

export function isOwnerMiddleware(req , res , next){
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

export function hasNotAlreadyARestaurant(req , res , next){
  console.log("sono in hasAlreadyARestaurant e provo a capire se ha gia un ristorante")
  Owner.OwnerModel.findById(req.auth._id)
        .then((owner) => {
            if(!owner.hasAlreadyARestaurant()){
                console.log("non ha gia ristoranti")
                next();
            }else{
                console.log("ha gia ristoranti")
                return next({statusCode : 404, error: true, errormessage: "Owner: " + owner._id + " has already a restaurant. restaurantId:" + owner.restaurantOwn.toString()})
            }
        })
        .catch(() => {
            return next({statusCode : 404, error: true, errormessage: "error while searching owner ownerId:" + req.auth._id});
        })
}

export function hasAlreadyARestaurant(req , res , next){
  console.log("sono in hasAlreadyARestaurant e provo a capire se ha gia un ristorante")
  Owner.OwnerModel.findById(req.auth._id)
        .then((owner) => {
            if(owner.hasAlreadyARestaurant()){
                console.log("ha gia ristoranti")
                next();
            }else{
                console.log("non ha gia ristoranti")
                return next({statusCode : 404, error: true, errormessage: "Owner: " + owner._id + " has already a restaurant. restaurantId:" + owner.restaurantOwn.toString()})
            }
        })
        .catch(() => {
            return next({statusCode : 404, error: true, errormessage: "error while searching owner ownerId:" + req.auth._id});
        })
}



export const basicAuthentication = passport.authenticate('basic', { session: false })