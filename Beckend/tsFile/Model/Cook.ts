import {User, options, RoleType, UserModel} from './User'
import { Schema, model, Document, Types} from 'mongoose';

export interface DishCooked {
    idItem: Schema.Types.ObjectId;
    dateFinished: Date;
}

export interface Cook extends User{
    dishesCooked : DishCooked[],
    idRestaurant: Schema.Types.ObjectId,
}

const cookSchema = new Schema<Cook>({
    dishesCooked : {
        type : [
            {   
                idItem : {type : Schema.Types.ObjectId, ref : 'Dish', required : true},
                dateFinished : {type : Schema.Types.Date, required : true}
            }
        ]
    },
    idRestaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    
}, options)

export async function createCookAndSave(username : string, email : string, password : string, idRestaurant : Types.ObjectId) : Promise<Cook> {
    const newCook : Cook =  new CookModel({
        username : username,
        email : email,
        role : RoleType.COOK,
        dishesCooked : [],
        idRestaurant : idRestaurant
    });
    newCook.setPassword(password);
    return await newCook.save();
}

export const CookModel = UserModel.discriminator<Cook>('Cook', cookSchema, RoleType.COOK);