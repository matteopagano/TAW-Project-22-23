import {User, options, RoleType, UserModel} from './User'
import { Schema, model, Document, Types} from 'mongoose';


export interface Cashier extends User{
    recipesPrinted : Schema.Types.ObjectId,
    idRestaurant: Schema.Types.ObjectId
}

const cashierSchema = new Schema<Cashier>({
    recipesPrinted : [{ type: Schema.Types.ObjectId, ref: 'Restaurant', required: true }],
}, options)

export function createCashier(username : string, email : string, password : string, idRestaurant : Types.ObjectId) : Cashier {
    const newCashier : Cashier =  new CashierModel({
        username : username,
        email : email,
        role : RoleType.CASHIER,
        receiptsPrinted : [],
        idRestaurant : idRestaurant
    });
    newCashier.setPassword(password);
    return newCashier;
}

export const CashierModel = UserModel.discriminator<Cashier>('Cashier', cashierSchema,  RoleType.CASHIER);

