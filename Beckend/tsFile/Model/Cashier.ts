import {User, options, RoleType, UserModel} from './User'
import { Schema, model, Document, Types} from 'mongoose';


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

export async function createCashierAndSave(username : string, email : string, password : string, idRestaurant : Types.ObjectId) : Promise<Cashier> {
    const newCashier : Cashier =  new CashierModel({
        username : username,
        email : email,
        role : RoleType.CASHIER,
        receiptsPrinted : [],
        idRestaurant : idRestaurant
    });
    newCashier.setPassword(password);
    return await newCashier.save();
}

export const CashierModel = UserModel.discriminator<Cashier>('Cashier', cashierSchema,  RoleType.CASHIER);

