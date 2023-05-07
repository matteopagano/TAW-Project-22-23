import passport = require('passport');           // authentication middleware for Express
import passportHTTP = require('passport-http');
import * as User from '../Model/User';
import { OwnerModel } from '../Model/Owner';
import { BartenderModel } from '../Model/Bartender';
import { CashierModel } from '../Model/Cashier';
import { CookModel } from '../Model/Cook';
import { WaiterModel } from '../Model/Waiter';
import { expressjwt as jwt } from 'express-jwt';  

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
            case 'owner' : user = new OwnerModel(user); break;
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
  console.log( "STAMPO SUER" )
  console.log(req.auth)
  //User.UserModel.find

  

  const user : User.User = new User.UserModel(req.auth)

  console.log("user :" + user)
  
  if(user.isOwner()){
    return next();
  }else{
    return next({ statusCode:404, error: true, errormessage: "You are not Owner" });
  }

}


export const basicAuthentication = passport.authenticate('basic', { session: false })