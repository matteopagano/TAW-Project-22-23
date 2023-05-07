import {User, options, RoleType, UserModel} from './User'
import { Schema, model, Document} from 'mongoose';

export interface DrinkPrepared {
    qt: number;
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
                qt : {type : Schema.Types.Number, required : true},
                idItem : {type : Schema.Types.ObjectId, ref : 'Drink', required : true},
                dateFinished : {type : Schema.Types.Date, required : true}
            }
        ]
    },
    idRestaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    
}, options)

export const BartenderModel = UserModel.discriminator<Bartender>('Bartender', bartenderSchema,  RoleType.BARTENDER);