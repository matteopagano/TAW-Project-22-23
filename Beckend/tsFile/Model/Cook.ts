import {User, options, RoleType, UserModel} from './User'
import { Schema, model, Document} from 'mongoose';

export interface DishCooked {
    qt: number;
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
                qt : {type : Schema.Types.Number, required : true},
                idItem : {type : Schema.Types.ObjectId, ref : 'Dish', required : true},
                dateFinished : {type : Schema.Types.Date, required : true}
            }
        ]
    },
    idRestaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    
}, options)

export const CookModel = UserModel.discriminator<Cook>('Cook', cookSchema, RoleType.COOK);