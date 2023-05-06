
import { Response, Request, NextFunction } from 'express';
import {AllergeneModel} from '../Model/Allergene';
import {DayModel} from '../Model/Day';
import {ItemModel , ItemType, Item} from '../Model/Item';
import {OrderModel} from '../Model/Order';
import {RecipeModel} from '../Model/Recipe';
import {RestaurantModel} from '../Model/Restaurant';
import {TableModel} from '../Model/Table';
import * as User from '../Model/User';



export function root(req : Request, res : Response) : void {
    res.status(200).json( { api_version: "1.0", endpoints: [ "any endpoints" ] } ); // json method sends a JSON response (setting the correct Content-Type) to the client
}

export function postOwner(req : Request, res : Response, next : NextFunction) : void {
    if(User.isOwner(req.body)){
        User.OwnerModel.create(req.body)
            .then(
                (newOwner) => {
                    console.log("creato owner")
                    return res.status(200).json({error: false, errormessage: "", id: req.body._id})
                }
            )
    }else{
        console.log("proprietà owner errate");
        console.log(req.body)
        return next({ statusCode:404, error: true, errormessage: "Data is not a valid Owner" });
    }
    
}