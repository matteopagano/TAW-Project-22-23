import {User, options, RoleType, UserModel} from './User'
import { Schema, model, Document} from 'mongoose';

export interface Owner extends User{
    restaurantOwn: Schema.Types.ObjectId;
    isOwnerOf : (restaurantId : string) => boolean;
    hasAlreadyARestaurant : () => boolean;
}

const ownerSchema = new Schema<Owner>({
    
    restaurantOwn: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: false },
    
}, options)

ownerSchema.methods.isOwnerOf = function(restaurantId): boolean {
    console.log(this.restaurantOwn.toString())
    console.log(restaurantId)
    return this.restaurantOwn.toString() === restaurantId;
}

ownerSchema.methods.hasAlreadyARestaurant = function(): boolean {
    console.log(this.restaurantOwn)
    if(this.restaurantOwn){
        return true;
    }else{
        return false;
    }
    
}

export const OwnerModel = UserModel.discriminator<Owner>('Owner', ownerSchema,  RoleType.OWNER);