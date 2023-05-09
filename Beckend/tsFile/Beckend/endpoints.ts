

import { Request, Response, NextFunction } from 'express';
import {Types} from 'mongoose'
import {AllergeneModel} from '../Model/Allergene';
import {DayModel} from '../Model/Day';
import {ItemModel , ItemType, Item} from '../Model/Item';
import {OrderModel} from '../Model/Order';
import {RecipeModel} from '../Model/Recipe';
import * as Restaurant from '../Model/Restaurant';
import {TableModel} from '../Model/Table';

import * as User from '../Model/User';
import * as Cook from '../Model/Cook';
import * as Waiter from '../Model/Waiter';
import * as Cashier from '../Model/Cashier';
import * as Bartender from '../Model/Bartender';

import { Schema, model, Document} from 'mongoose';
import jsonwebtoken = require('jsonwebtoken'); //For sign the jwt data
import * as Owner from '../Model/Owner';
import * as Utilities from './utilities';

const result = require('dotenv').config({ path: './compiledSourceJS/Beckend/.env' })

if (result.error) {
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

export async function getRestaurantById(req : Request, res : Response , next : NextFunction ){
    const customRequest = req as Request & { auth: any }; // For error type at compile time

    const owner : Owner.Owner = await Owner.OwnerModel.findById(customRequest.auth._id)
    if(owner.isOwnerOf(req.params.idr)){
        const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(req.params.idr)
        
        if(restaurant){
            return res.status(200).json(restaurant)
        }else{
            return next({statusCode:404, error: true, errormessage: "Any restaurant found"})
        } 
    }else{
        return next({statusCode:404, error: true, errormessage: "Not your restaurant"})
    }
}

export async function getCooksByRestaurant(req : Request, res : Response , next : NextFunction ){
    const customRequest = req as Request & { auth: any }; // For error type at compile time

    const owner : Owner.Owner = await Owner.OwnerModel.findById(customRequest.auth._id)
    
    
    const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(req.params.idr)
    await restaurant.populate('cookList')
    if(restaurant){
        return res.status(200).json(restaurant.cookList)
    }else{
        return next({statusCode:404, error: true, errormessage: "Any restaurant found"})
    }
}

export async function getWaitersByRestaurant(req : Request, res : Response , next : NextFunction ){
    const customRequest = req as Request & { auth: any }; // For error type at compile time

    const owner : Owner.Owner = await Owner.OwnerModel.findById(customRequest.auth._id)
    
    if(owner.isOwnerOf(req.params.idr)){
        const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(req.params.idr)
        await restaurant.populate('waiterList')
        if(restaurant){
            return res.status(200).json(restaurant.waiterList)
        }else{
            return next({statusCode:404, error: true, errormessage: "Any restaurant found"})
        }
    }else{
        return next({statusCode:404, error: true, errormessage: "Not your restaurant"})
    }
}
export async function getCashiersByRestaurant(req : Request, res : Response , next : NextFunction ){
    const customRequest = req as Request & { auth: any }; // For error type at compile time

    const owner : Owner.Owner = await Owner.OwnerModel.findById(customRequest.auth._id)
    
    if(owner.isOwnerOf(req.params.idr)){
        const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(req.params.idr)
        await restaurant.populate('cashierList')
        if(restaurant){
            return res.status(200).json(restaurant.cashierList)
        }else{
            return next({statusCode:404, error: true, errormessage: "Any restaurant found"})
        }
    }else{
        return next({statusCode:404, error: true, errormessage: "Not your restaurant"})
    }
}
export async function getBartenderByRestaurant(req : Request, res : Response , next : NextFunction ){
    const customRequest = req as Request & { auth: any }; // For error type at compile time

    const owner : Owner.Owner = await Owner.OwnerModel.findById(customRequest.auth._id)
    
    if(owner.isOwnerOf(req.params.idr)){
        const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(req.params.idr)
        await restaurant.populate('bartenderList')
        if(restaurant){
            return res.status(200).json(restaurant.bartenderList)
        }else{
            return next({statusCode:404, error: true, errormessage: "Any restaurant found"})
        }
    }else{
        return next({statusCode:404, error: true, errormessage: "Not your restaurant"})
    }
}

export async function createRestaurant(req : Request, res : Response, next : NextFunction) {
    const customRequest = req as Request & { auth: any }; // For error type at compile time

    const owner : Owner.Owner = await Owner.OwnerModel.findById(customRequest.auth._id)
    
    const newRestaurant = new Restaurant.RestaurantModel({
        restaurantName : req.body.restaurantName,
        employeesList : [],
        ownerId : owner._id,
        tablesList : [],
        daysList : [],
        itemsList : []
    })
    await newRestaurant.save()
    owner.restaurantOwn = newRestaurant._id;
    await owner.save()
    return res.status(200).json({restaurantId : newRestaurant._id})     
}

export async function createCookAndAddToARestaurant(req : Request, res : Response , next : NextFunction) {
    const customRequest = req as Request & { auth: any }; // For error type at compile time
    const username = req.body.username;
    const email = req.body.email;
    const role = req.body.role;

    const newPassword = Utilities.generateRandomString(8)
    const owner : Owner.Owner = await Owner.OwnerModel.findById(customRequest.auth._id)
    
    const restaurant = await Restaurant.RestaurantModel.findById(owner.restaurantOwn.toString())
    const cook : Cook.Cook = await Utilities.createCook(username, email, newPassword, owner.restaurantOwn)
    Utilities.addCookToARestaurant(cook,restaurant)
    return res.status(200).json({idNewCook : cook._id, usernameNewCook : cook.username, email : cook.email, passwordToChange : newPassword});
    //return next({statusCode : 404, error: true, errormessage: "no owner find ownerId:" + customRequest.auth._id});
    
}

export async function createWaiterAndAddToARestaurant(req : Request, res : Response , next : NextFunction) {
    const customRequest = req as Request & { auth: any }; // For error type at compile time
    const username = req.body.username;
    const email = req.body.email;
    const role = req.body.role;

    const newPassword = Utilities.generateRandomString(8)
    const owner : Owner.Owner = await Owner.OwnerModel.findById(customRequest.auth._id)
    
    const restaurant = await Restaurant.RestaurantModel.findById(owner.restaurantOwn.toString())
    const waiter : Waiter.Waiter = await Utilities.createWaiter(username, email, newPassword, owner.restaurantOwn)
    Utilities.addWaiterToARestaurant(waiter, restaurant)
    return res.status(200).json({idNewCook : waiter._id, usernameNewCook : waiter.username, email : waiter.email, passwordToChange : newPassword});
    //return next({statusCode : 404, error: true, errormessage: "no owner find ownerId:" + customRequest.auth._id});
    
}

export async function createCashierAndAddToARestaurant(req : Request, res : Response , next : NextFunction) {
    const customRequest = req as Request & { auth: any }; // For error type at compile time
    const username = req.body.username;
    const email = req.body.email;
    const role = req.body.role;

    const newPassword = Utilities.generateRandomString(8)
    const owner : Owner.Owner = await Owner.OwnerModel.findById(customRequest.auth._id)
    
    const restaurant = await Restaurant.RestaurantModel.findById(owner.restaurantOwn.toString())
    const cashier : Cashier.Cashier = await Utilities.createCashier(username, email, newPassword, owner.restaurantOwn)
    Utilities.addCashierToARestaurant(cashier,restaurant)
    return res.status(200).json({idNewCook : cashier._id, usernameNewCook : cashier.username, email : cashier.email, passwordToChange : newPassword});
    //return next({statusCode : 404, error: true, errormessage: "no owner find ownerId:" + customRequest.auth._id});
    
}

export async function createBartenderAndAddToARestaurant(req : Request, res : Response , next : NextFunction) {
    const customRequest = req as Request & { auth: any }; // For error type at compile time
    const username = req.body.username;
    const email = req.body.email;
    const role = req.body.role;

    const newPassword = Utilities.generateRandomString(8)
    const owner : Owner.Owner = await Owner.OwnerModel.findById(customRequest.auth._id)
    
    
    const restaurant = await Restaurant.RestaurantModel.findById(owner.restaurantOwn.toString())
    const bartender : Bartender.Bartender = await Utilities.createBartender(username, email, newPassword, owner.restaurantOwn)
    Utilities.addBartenderToARestaurant(bartender,restaurant)
    return res.status(200).json({idNewCook : bartender._id, usernameNewCook : bartender.username, email : bartender.email, passwordToChange : newPassword});
    //return next({statusCode : 404, error: true, errormessage: "no owner find ownerId:" + customRequest.auth._id});
    
}


export async function deleteCookAndRemoveFromRestaurant(req : Request, res : Response , next : NextFunction) {
    const idRestaurant = req.params.idr;
    const idCook = req.params.idu;

    const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(idRestaurant);


    if(restaurant.isCookPresent(idCook)){
        if(restaurant.removeCook(idCook)){
            await restaurant.save()
            await Cook.CookModel.deleteOne({_id : idCook})
            return res.status(200).json({idCookDeleted : idCook});
        }else{
            return next({statusCode:404, error: true, errormessage: "Cook not deleted"})
        }
        
    }
}

export async function deleteWaiterAndRemoveFromRestaurant(req : Request, res : Response , next : NextFunction) {
    const idRestaurant = req.params.idr;
    const idWaiter = req.params.idu;

    const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(idRestaurant);


    if(restaurant.isWaiterPresent(idWaiter)){
        if(restaurant.removeWaiter(idWaiter)){
            await restaurant.save()
            await Waiter.WaiterModel.deleteOne({_id : idWaiter})
            return res.status(200).json({idWaiterDeleted : idWaiter});
        }else{
            return next({statusCode:404, error: true, errormessage: "Cook not deleted"})
        }
        
    }
}

export async function deleteCashierAndRemoveFromRestaurant(req : Request, res : Response , next : NextFunction) {
    const idRestaurant = req.params.idr;
    const idCashier = req.params.idu;

    const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(idRestaurant);


    if(restaurant.isCashierPresent(idCashier)){
        if(restaurant.removeCashier(idCashier)){
            await restaurant.save()
            await Cashier.CashierModel.deleteOne({_id : idCashier})
            return res.status(200).json({idCashierDeleted : idCashier});
        }else{
            return next({statusCode:404, error: true, errormessage: "Cook not deleted"})
        }
        
    }
}

export async function deleteBartenderAndRemoveFromRestaurant(req : Request, res : Response , next : NextFunction) {
    const idRestaurant = req.params.idr;
    const idBartender = req.params.idu;

    const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(idRestaurant);


    if(restaurant.isBartenderPresent(idBartender)){
        if(restaurant.removeBartender(idBartender)){
            await restaurant.save()
            await Bartender.BartenderModel.deleteOne({_id : idBartender})
            return res.status(200).json({idCBartenderDeleted : idBartender});
        }else{
            return next({statusCode:404, error: true, errormessage: "Cook not deleted"})
        }
        
    }
}

export function getTablesByRestaurant(req : Request, res : Response, next : NextFunction) : void {
}
export function getDaysByRestaurant(req : Request, res : Response, next : NextFunction) : void {
}
export function getOrdersByRestaurantAndDay(req : Request, res : Response, next : NextFunction) : void {
}





