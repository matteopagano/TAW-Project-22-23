import {User, options, RoleType, UserModel} from './User'
import { Schema, model, Document, Types} from 'mongoose';

export interface DrinkPrepared {
    idItem: Schema.Types.ObjectId;
    dateFinished: Date;
}

export interface Bartender extends User{
    drinksPrepared : DrinkPrepared[],
}

const bartenderSchema = new Schema<Bartender>({
}, options)

export function createBartender(username : string, email : string, password : string, idRestaurant : Types.ObjectId) : Bartender {
    const newBartender : Bartender =  new BartenderModel({
        username : username,
        email : email,
        role : RoleType.BARTENDER,
        drinkPrepared : [],
        idRestaurant : idRestaurant
    });
    newBartender.setPassword(password);
    return newBartender
}

export const BartenderModel = UserModel.discriminator<Bartender>('Bartender', bartenderSchema,  RoleType.BARTENDER);