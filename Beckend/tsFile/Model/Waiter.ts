import {User, options, RoleType, UserModel} from './User'
import { Schema, model, Document, Types} from 'mongoose';

export interface Waiter extends User{
    ordersTaken : Schema.Types.ObjectId[],
    tablesObservered : Schema.Types.ObjectId[],
    idRestaurant: Schema.Types.ObjectId
    
}

const waiterSchema = new Schema<Waiter>({
    ordersTaken : { 
        type : [
            {
                idOrder : {type : Schema.Types.ObjectId, ref : 'Order', required : true}
            }
        ],
        required: true
    },
        
    tablesObservered : {
        type : [
            {
                idTable : {type : Schema.Types.ObjectId, ref : 'Table', required : true}
            }
        ],
        required : true
    },
    idRestaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    

}, options)

export async function createWaiterAndSave(username : string, email : string, password : string, idRestaurant : Types.ObjectId) : Promise<Waiter> {
    const newWaiter : Waiter =  new WaiterModel({
        username : username,
        email : email,
        role : RoleType.WAITER,
        ordersTaken : [],
        tablesObservered : [],
        idRestaurant : idRestaurant
    });
    newWaiter.setPassword(password);
    return await newWaiter.save();
}

export const WaiterModel = UserModel.discriminator<Waiter>('Waiter', waiterSchema,  RoleType.WAITER);