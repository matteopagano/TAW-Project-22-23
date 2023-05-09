

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
import * as Day from '../Model/Day'

import { Schema, model, Document} from 'mongoose';
import jsonwebtoken = require('jsonwebtoken'); //For sign the jwt data
import * as Owner from '../Model/Owner';
import * as Utilities from './utilities';
import { error } from 'firebase-functions/logger';

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
    const idRestorantParameter = req.params.idr ;
    const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(idRestorantParameter)
        
    if(restaurant){
        return res.status(200).json({error: false, errormessage: "", restaurant : restaurant})
    }else{
        return next({statusCode:404, error: true, errormessage: "Any restaurant found"})
    }
}

export async function getCooksByRestaurant(req : Request, res : Response , next : NextFunction ){
    const idRistoranteParameter = req.params.idr ;
    const restaurant : Restaurant.Restaurant = await (Restaurant.RestaurantModel.findById(idRistoranteParameter).populate('cookList'))

    if(restaurant){
        return res.status(200).json({error: false, errormessage: "", cooks : restaurant.getCookList()})
    }else{
        return next({statusCode:404, error: true, errormessage: "Any restaurant found"})
    }
}

export async function getWaitersByRestaurant(req : Request, res : Response , next : NextFunction ){
    const idRistoranteParameter = req.params.idr ;
    const restaurant : Restaurant.Restaurant = await (Restaurant.RestaurantModel.findById(idRistoranteParameter).populate('waiterList'))

    if(restaurant){
        return res.status(200).json({error: false, errormessage: "", waiters : restaurant.getWaiterList()})
    }else{
        return next({statusCode:404, error: true, errormessage: "Any restaurant found"})
    }
    
}
export async function getCashiersByRestaurant(req : Request, res : Response , next : NextFunction ){
    const idRistoranteParameter = req.params.idr ;
    const restaurant : Restaurant.Restaurant = await (Restaurant.RestaurantModel.findById(idRistoranteParameter).populate('cashierList'))
    
    if(restaurant){
        return res.status(200).json({error: false, errormessage: "", cashiers : restaurant.getCashierList()})
    }else{
        return next({statusCode:404, error: true, errormessage: "Any restaurant found"})
    }
}
export async function getBartenderByRestaurant(req : Request, res : Response , next : NextFunction ){
    const idRistoranteParameter = req.params.idr ;
    const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(idRistoranteParameter).populate('bartenderList')
    
    if(restaurant){
        return res.status(200).json({error: false, errormessage: "", bartenders : restaurant.getBartenderList()})
    }else{
        return next({statusCode:404, error: true, errormessage: "Any restaurant found"})
    }
    
}

export async function createRestaurant(req : Request, res : Response, next : NextFunction) {
    const customRequest = req as Request & { auth: any }; // For error type at compile time
    const idOwner = customRequest.auth._id
    const restaurantNameBody = req.body.restaurantName

    const owner : Owner.Owner = await Owner.OwnerModel.findById(idOwner)
    
    if(Restaurant.RestaurantModel.checkNameCorrectness(restaurantNameBody)){
        const newRestaurant = new Restaurant.RestaurantModel({
            restaurantName : restaurantNameBody,
            employeesList : [],
            ownerId : owner.getId(),
            tablesList : [],
            daysList : [],
            itemsList : []
        })
        owner.setRestaurantOwn(newRestaurant.getId())
        await owner.save()
        await newRestaurant.save()
        return res.status(200).json({error: false, errormessage: "", newRestaurantId : newRestaurant.getId()})  
    }else{
        return next({statusCode:404, error: true, errormessage: "Restaurant name not valid. Name's length must be less than 16. restaurant name : " + restaurantNameBody})
    }

       
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

export async function createDayAndAddToARestaurant(req : Request, res : Response , next : NextFunction) {
    const customRequest = req as Request & { auth: any }; // For error type at compile time

    const owner : Owner.Owner = await Owner.OwnerModel.findById(customRequest.auth._id)
    const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(owner.restaurantOwn).populate("daysList")
    console.log("printod io bono")
    console.log(restaurant.daysList)

    

    if (!/^\d{4}-\d{2}-\d{2}$/.test(req.body.date)) {  
        return next({statusCode:404, error: true, errormessage: "not valid date"})
    }

    const newDate = new Date(req.body.date)

    let alreadyExist : boolean = false;

    restaurant.daysList.forEach((item : any) => {
        item = item as Day.Day
        if(item.date.getTime() === newDate.getTime()){
            alreadyExist = true;
        }
        
    });

    const newDay : Day.Day = new Day.DayModel({
        date: newDate,
        ordersList : [],
        recipeList: [],
        idRestaurant: owner.restaurantOwn
      });


    if(newDay.isValidDate()){
        if(!alreadyExist){
            await newDay.save()
            restaurant.daysList.push(newDay._id)
            await restaurant.save()
            return res.status(200).json({valid : true})
        }else{
            return next({statusCode:404, error: true, errormessage: "Day " + newDay.date + " already present in restaurant:" + restaurant._id})
        }
        
    }else{
        return next({statusCode:404, error: true, errormessage: "not valid date"})
    }

    


    
}

export async function getDaysListByRestaurant(req : Request, res : Response , next : NextFunction){
    const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(req.params.idr).populate("daysList")

    if(restaurant){
        return res.status(200).json(restaurant.daysList)
    }else{
        console.log("debugf")
        return next({statusCode:404, error: true, errormessage: "not valid restaurant"})
    }

}





