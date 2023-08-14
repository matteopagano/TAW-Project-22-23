import {User, options, RoleType, UserModel} from './User'
import { Schema, model, Document, Types} from 'mongoose';

export interface DishCooked {
    idItem: Schema.Types.ObjectId;
    dateFinished: Date;
}

export interface Cook extends User{
}

const cookSchema = new Schema<Cook>({
}, options)

export function createCook(username : string, email : string, password : string, idRestaurant : Types.ObjectId) : Cook {
    const newCook : Cook =  new CookModel({
        username : username,
        email : email,
        role : RoleType.COOK,
        dishesCooked : [],
        idRestaurant : idRestaurant
    });
    newCook.setPassword(password);
    return newCook;
}

export const CookModel = UserModel.discriminator<Cook>('Cook', cookSchema, RoleType.COOK);