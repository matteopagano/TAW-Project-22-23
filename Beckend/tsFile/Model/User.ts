import { Schema, model, Document} from 'mongoose';
import crypto = require('crypto');


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
    setPassword: (password : string) => void;
    isPasswordCorrect: (password : string) => boolean;
    isOwner: () => boolean;
}

const userSchema = new Schema<User>({
    username: { type: Schema.Types.String, required: true },
    email: { type: Schema.Types.String, required: true },
    digest: { type: Schema.Types.String, required: true },
    salt: { type: Schema.Types.String, required: true },
    role: { type: Schema.Types.String, enum : RoleType, required: true },
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
    return this.role === 'owner';
}



export const UserModel = model<User>('User', userSchema);




