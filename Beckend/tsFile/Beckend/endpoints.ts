
import { Response, Request, NextFunction } from 'express';
import {AllergeneModel} from '../Model/Allergene';
import {DayModel} from '../Model/Day';
import {ItemModel , ItemType, Item} from '../Model/Item';
import {OrderModel} from '../Model/Order';
import {RecipeModel} from '../Model/Recipe';
import * as Restaurant from '../Model/Restaurant';
import {TableModel} from '../Model/Table';
import * as User from '../Model/User';
import * as Cook from '../Model/Cook';
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

export async function getRestaurantById(req, res , next ){
    const owner : Owner.Owner = await Owner.OwnerModel.findById(req.auth._id)
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

export async function getEmployeesByRestaurant(req, res , next ){
    
    const owner : Owner.Owner = await Owner.OwnerModel.findById(req.auth._id)
    
    if(owner.isOwnerOf(req.params.idr)){
        const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(req.params.idr)
        if(restaurant){
            return res.status(200).json(restaurant.employeesList)
        }else{
            return next({statusCode:404, error: true, errormessage: "Any restaurant found"})
        }
    }else{
        return next({statusCode:404, error: true, errormessage: "Not your restaurant"})
    }
}

export async function createRestaurant(req, res , next) {
    const owner : Owner.Owner = await Owner.OwnerModel.findById(req.auth._id)
    
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
    return res.status(200).json(newRestaurant._id)     
}

export async function createStaffMember(req, res , next) {

    const username = req.body.username;
    const email = req.body.email;
    const role = req.body.role;

    const newPassword = Utilities.generateRandomString(8)
    const owner : Owner.Owner = await Owner.OwnerModel.findById(req.auth._id)
    let cook : Cook.Cook;
    
    if(owner){
        switch(role){
            case User.RoleType.COOK : 
                cook = await Utilities.createCook(username, email, newPassword, owner.restaurantOwn)
                const restaurant = await Restaurant.RestaurantModel.findById(cook.idRestaurant.toString())
                Utilities.addEmployeeToARestaurant(cook._id,restaurant._id)
                break;
        }
        return res.status(200).json({idNewCook : cook._id, usernameNewCook : cook.username, email : cook.email, passwordToChange : newPassword});
    }else{
        return next({statusCode : 404, error: true, errormessage: "no owner find ownerId:" + req.auth._id});
    }
}



export function getTablesByRestaurant(req : Request, res : Response, next : NextFunction) : void {
}
export function getDaysByRestaurant(req : Request, res : Response, next : NextFunction) : void {
}
export function getOrdersByRestaurantAndDay(req : Request, res : Response, next : NextFunction) : void {
}





