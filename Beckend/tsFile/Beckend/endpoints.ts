
import { Response, Request, NextFunction } from 'express';
import {AllergeneModel} from '../Model/Allergene';
import {DayModel} from '../Model/Day';
import {ItemModel , ItemType, Item} from '../Model/Item';
import {OrderModel} from '../Model/Order';
import {RecipeModel} from '../Model/Recipe';
import {RestaurantModel} from '../Model/Restaurant';
import {TableModel} from '../Model/Table';
import * as User from '../Model/User';
import { ObjectId } from 'mongoose';
import jsonwebtoken = require('jsonwebtoken'); //For sign the jwt data
import { OwnerModel } from '../Model/Owner';

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
    res.status(200).json( { api_version: "1.0", endpoints: [ "any endpoints" ] } ); // json method sends a JSON response (setting the correct Content-Type) to the client
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
    OwnerModel.findById(req.auth._id)
        .then((user)=>{
            if(user.isOwnerOf(req.params.idr)){
                RestaurantModel.findById(req.params.idr)
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
    console.log("cciaooooo")
    OwnerModel.findById(req.auth._id)
        .then((user)=>{
            if(user.isOwnerOf(req.params.idr)){
                RestaurantModel.findById(req.params.idr)
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
    OwnerModel.findById(req.auth._id)
        .then((user) => {
            const newRestaurant = new RestaurantModel({
                restaurantName : req.body.restaurantName,
                employeesList : req.body.employeesList,
                ownerId : user._id,
                tablesList : [],
                daysList : [],
                itemsList : []
            })
            newRestaurant.save()
            .then(() => {
                user.restaurantOwn = newRestaurant._id;
                user.save()
                    
                }).then((restaurant)=>{
                    return res.status(200).json(newRestaurant._id)
                })
            }).catch(()=>{
                console.log("error")
            })
}

export function getTablesByRestaurant(req : Request, res : Response, next : NextFunction) : void {
}
export function getDaysByRestaurant(req : Request, res : Response, next : NextFunction) : void {
}
export function getOrdersByRestaurantAndDay(req : Request, res : Response, next : NextFunction) : void {
}





