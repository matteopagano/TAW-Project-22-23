import {User, options, RoleType, UserModel} from './User'
import { Schema, model, Document, Types} from 'mongoose';

export interface DrinkPrepared {
    idItem: Schema.Types.ObjectId;
    dateFinished: Date;
}

export interface Bartender extends User{
    drinkPrepared : DrinkPrepared[],
    idRestaurant: Schema.Types.ObjectId
}

const bartenderSchema = new Schema<Bartender>({
    drinkPrepared : {
        type : [
            {
                idItem : {type : Schema.Types.ObjectId, ref : 'Drink', required : true},
                dateFinished : {type : Schema.Types.Date, required : true}
            }
        ]
    },
    idRestaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    
}, options)

export async function createBartenderAndSave(username : string, email : string, password : string, idRestaurant : Types.ObjectId) : Promise<Bartender> {
    const newBartender : Bartender =  new BartenderModel({
        username : username,
        email : email,
        role : RoleType.BARTENDER,
        drinkPrepared : [],
        idRestaurant : idRestaurant
    });
    newBartender.setPassword(password);
    return await newBartender.save();
}

export const BartenderModel = UserModel.discriminator<Bartender>('Bartender', bartenderSchema,  RoleType.BARTENDER);