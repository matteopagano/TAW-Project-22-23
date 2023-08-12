import {User, options, RoleType, UserModel} from './User'
import { Schema, model, Document, Types} from 'mongoose';
import * as Recipe from './Recipe'


export interface Cashier extends User{
    recipesPrinted : Schema.Types.ObjectId[],
    idRestaurant: Schema.Types.ObjectId
    isCashierOf : (restaurantId : string) => boolean;
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

export function addRecipe(recipe : Recipe.Recipe, cashier : Cashier) {
    cashier.recipesPrinted.push(recipe._id)
}

cashierSchema.methods.isCashierOf = function(restaurantId): boolean {
    return this.idRestaurant.toString() === restaurantId;
}

export const CashierModel = UserModel.discriminator<Cashier>('Cashier', cashierSchema,  RoleType.CASHIER);

