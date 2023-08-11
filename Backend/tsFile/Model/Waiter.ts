import {User, options, RoleType, UserModel} from './User'
import { Schema, model, Document, Types} from 'mongoose';

export interface Waiter extends User{
    
    ordersAwaiting : Schema.Types.ObjectId[],
    ordersServed: Schema.Types.ObjectId[]
}

const waiterSchema = new Schema<Waiter>({
    
    ordersAwaiting : [{ type: Schema.Types.ObjectId, ref: 'Order', required: true }],
    ordersServed : [{ type: Schema.Types.ObjectId, ref: 'Order', required: true }],

}, options)

export function createWaiter(username : string, email : string, password : string, idRestaurant : Types.ObjectId) : Waiter {
    const newWaiter : Waiter =  new WaiterModel({
        username : username,
        email : email,
        role : RoleType.WAITER,
        ordersTaken : [],
        tablesObservered : [],
        idRestaurant : idRestaurant
    });
    newWaiter.setPassword(password);
    return newWaiter
}

export const WaiterModel = UserModel.discriminator<Waiter>('Waiter', waiterSchema,  RoleType.WAITER);