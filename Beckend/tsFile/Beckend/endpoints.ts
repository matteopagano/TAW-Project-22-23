
import { Response, Request, NextFunction } from 'express';
import {AllergeneModel} from '../Model/Allergene';
import {DayModel} from '../Model/Day';
import {ItemModel , ItemType, Item} from '../Model/Item';
import {OrderModel} from '../Model/Order';
import {RecipeModel} from '../Model/Recipe';
import * as Restaurant from '../Model/Restaurant';
import {TableModel} from '../Model/Table';
import * as User from '../Model/User';
import { Schema, model, Document} from 'mongoose';
import jsonwebtoken = require('jsonwebtoken'); //For sign the jwt data
import * as Owner from '../Model/Owner';
import * as Utilities from './utilities';

const result = require('dotenv').config({ path: './compiledSourceJS/Beckend/.env' })

if (result.error) {
    console.log(process.cwd())
    console.log("Unable to load \".env\" file. Please provide one to store the JWT secret key");
    process.exit(-1);
    
}

if( !process.env.JWT_SECRET ) {
    console.log("\".env\" file find but unable to locate JET_SECRET.");
}

export function root(req : Request, res : Response) : void {
    res.status(200).json( { api_version: "1.0", endpoints: [ "/", "login", "/restaurants/:idr", "/restaurants/:idr/employees", "/restaurants", "" ] } ); // json method sends a JSON response (setting the correct Content-Type) to the client
}

export function login(req : Request, res : Response, next : NextFunction) {
    // If it's reached this point, req.user has been injected.

    const authenticatedUser : User.User = new User.UserModel(req.user);

    const token = {
        username: authenticatedUser.username,
        role: authenticatedUser.role,
        email: authenticatedUser.email,
        _id: authenticatedUser._id
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT secret is not defined');
    }
    
    const options = {
        expiresIn: '5h'
    }
    const tokenSigned = jsonwebtoken.sign(token, secret, options );

    return res.status(200).json( {error:false, errormessage:"", token: tokenSigned} );
}

export function getRestaurantById(req, res , next ) : void {
    Owner.OwnerModel.findById(req.auth._id)
        .then((user)=>{
            if(user.isOwnerOf(req.params.idr)){
                Restaurant.RestaurantModel.findById(req.params.idr)
                    .then((restaurant) => {
                        if(restaurant){
                            return res.status(200).json(restaurant)
                        }else{
                            return next({statusCode:404, error: true, errormessage: "Any restaurant found"})
                        }
                    })
                    .catch((error)=>{
                        return next({statusCode:404, error: true, errormessage: "DB error"})
                    })
    
            }else{
                return next({statusCode:404, error: true, errormessage: "Not your restaurant"})
            }   
        })
}

export function getEmployeesByRestaurant(req, res , next ) : void {
    
    Owner.OwnerModel.findById(req.auth._id)
        .then((user)=>{
            if(user.isOwnerOf(req.params.idr)){
                Restaurant.RestaurantModel.findById(req.params.idr)
                    .then((restaurant) => {
                        if(restaurant){

                            console.log(restaurant.employeesList)
                            return res.status(200).json(restaurant.employeesList)
                        }else{
                            return next({statusCode:404, error: true, errormessage: "Any restaurant found"})
                        }
                    })
                    .catch((error)=>{
                        return next({statusCode:404, error: true, errormessage: "DB error"})
                    })
    
            }else{
                return next({statusCode:404, error: true, errormessage: "Not your restaurant"})
            }   
        })
}

export function createRestaurant(req, res , next) : void {
    console.log("sono nel createRestaurant e vuol dire che l'owner non ha gia un restaurant se sono arrivato qua")
    Owner.OwnerModel.findById(req.auth._id)
        .then((owner) => {
            const newRestaurant = new Restaurant.RestaurantModel({
                restaurantName : req.body.restaurantName,
                employeesList : [],
                ownerId : owner._id,
                tablesList : [],
                daysList : [],
                itemsList : []
            })
            newRestaurant.save()
                .then(() => {
                    owner.restaurantOwn = newRestaurant._id;
                    owner.save()
                })
                .then(() => {
                        return res.status(200).json(newRestaurant._id)
                })
                .catch(() => {
                    return next({statusCode : 404, error: true, errormessage: "DB error while posting new restaurant"})
                })
        }
        )
        .catch(() => {
            return next({statusCode : 404, error: true, errormessage: "error while searching owner ownerId:" + req.auth._id});
        })
            
}

export function createStaffMember(req, res , next) : void {
    const username = req.params.username;
    const email = req.params.email;
    const role = req.params.role;
    console.log(username + " " +email+ " "+ role )
    console.log("provo a creare")
    Owner.OwnerModel.findById(req.auth._id)
    .then((owner) => {
        if(owner){
            console.log(req.params.role)
            switch(req.params.role){
                case User.RoleType.COOK : 
                    const newPassword = Utilities.generateRandomString(8)
                    return Utilities.createCook(username, email, newPassword, owner.restaurantOwn)
                    .then((cook) => {
                        Restaurant.RestaurantModel.findById(cook.idRestaurant)
                        .then((restaurant) => {
                            restaurant.employeesList.push(cook._id)
                            restaurant.save();
                        })
                        .then(() => {
                            return res.status(200).json({ error: false, errormessage: "", newCook : {username : username, email : email, newPassword : newPassword} })
                        })
                        .catch((error) => {
                            return next({statusCode : 404, error: true, errormessage: error});
                        })
                    })
                    .catch((error) => {
                        return next({statusCode : 404, error: true, errormessage: "error while creating new cook"});
                    });
                    break;
            }
        }else{
            return next({statusCode : 404, error: true, errormessage: "no owner find ownerId:" + req.auth._id});
        }
        
    })
    .catch((error) => {
        return next({statusCode : 404, error: true, errormessage: error});
    })
}



export function getTablesByRestaurant(req : Request, res : Response, next : NextFunction) : void {
}
export function getDaysByRestaurant(req : Request, res : Response, next : NextFunction) : void {
}
export function getOrdersByRestaurantAndDay(req : Request, res : Response, next : NextFunction) : void {
}





