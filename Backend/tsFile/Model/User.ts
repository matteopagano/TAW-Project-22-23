import { Schema, model, Document} from 'mongoose';
import crypto = require('crypto');
import * as emailValidator from 'email-validator';
import * as usernameValidator from '@digitalcube/username-validator';


export enum RoleType{
    CASHIER = 'cashier',
    OWNER = 'owner',
    WAITER = 'waiter',
    COOK = 'cook',
    BARTENDER = 'bartender',
}

export const options = { discriminatorKey: 'role' };
export interface User extends Document {
    readonly _id: Schema.Types.ObjectId;
    username : string;
    email: string;
    digest: string;
    role: string;
    salt : string;
    idRestaurant : Schema.Types.ObjectId;
    setPassword: (password : string) => void;
    isPasswordCorrect: (password : string) => boolean;

    isOwner: () => boolean;
    isWaiter: () => boolean;
    isCashier: () => boolean;
    isCook: () => boolean;
    isBartender: () => boolean;
    
    isUserOf: (restaurantId : string) => boolean;
    getId: () => Schema.Types.ObjectId;
    getUsername : () => string
    getEmail : () => string
    getRole : () => string
}

const userSchema = new Schema<User>({
    username: { type: Schema.Types.String, required: true },
    email: { type: Schema.Types.String, required: true },
    digest: { type: Schema.Types.String, required: true },
    role: { type: Schema.Types.String, enum : RoleType, required: true },
    salt: { type: Schema.Types.String, required: true },
    idRestaurant: { type: Schema.Types.ObjectId, required: false , ref : 'Restaurant'},
    
}, options);

userSchema.methods.setPassword = function( password : string ) : void {
    this.salt = crypto.randomBytes(16).toString('hex'); 
    const hmac = crypto.createHmac('sha512', this.salt );
    hmac.update(password);
    this.digest = hmac.digest('hex'); 
}

userSchema.methods.isPasswordCorrect = function( password : string ):boolean {

    const hmac = crypto.createHmac('sha512', this.salt );
    hmac.update(password);
    return (this.digest === hmac.digest('hex'));

}

userSchema.methods.isOwner = function(): boolean {
    return this.role === RoleType.OWNER;
}

userSchema.methods.isWaiter = function(): boolean {
    return this.role === RoleType.WAITER;
}

userSchema.methods.isCashier = function(): boolean {
    return this.role === RoleType.CASHIER;
}

userSchema.methods.isCook = function(): boolean {
    return this.role === RoleType.COOK;
}

userSchema.methods.isBartender = function(): boolean {
    return this.role === RoleType.BARTENDER;
}

userSchema.methods.getId = function(): Schema.Types.ObjectId {
    return this._id
}

userSchema.methods.getUsername = function(): Schema.Types.ObjectId {
    return this.username
}

userSchema.methods.getEmail = function(): Schema.Types.ObjectId {
    return this.email
}

userSchema.methods.getRole = function(): Schema.Types.ObjectId {
    return this.role
}

userSchema.methods.isUserOf = function(restaurantId : string): boolean {
    if(this.idRestaurant){
        return this.idRestaurant.toString() === restaurantId.toString()
    }else{
        return this.restaurantOwn.toString() === restaurantId.toString()
    }
}

export function checkEmailCorrectness(email : string){
    return emailValidator.validate(email)
}

export async function checkNameCorrectness(name : string) : Promise<boolean> {
    const isNotNull : boolean = name.length !== null
    if(!isNotNull){
        return false
    }else{
        try {
            await usernameValidator.validateUsername(name)
            const isLessThan16 : boolean = name.length <= 15
            return isLessThan16;
        } catch (e) {
            return false
        }
        
    }
}

export const UserModel = model<User>('User', userSchema);




