import {User, options, RoleType, UserModel} from './User'
import { Schema, model, Document} from 'mongoose';


export interface Cashier extends User{
    receiptsPrinted : Schema.Types.ObjectId[],
    idRestaurant: Schema.Types.ObjectId
}

const cashierSchema = new Schema<Cashier>({
    receiptsPrinted : {
        type:[
            {type : Schema.Types.ObjectId, ref : 'Recipe', required: true}
        ],
        required : true
    },
    idRestaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    
}, options)

export const CashierModel = UserModel.discriminator<Cashier>('Cashier', cashierSchema,  RoleType.CASHIER);

