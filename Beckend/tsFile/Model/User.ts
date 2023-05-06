import { Schema, model, Document} from 'mongoose';

export enum RoleType{
    CASHIER = 'cashier',
    OWNER = 'owner',
    WAITER = 'waiter',
    COOK = 'cook',
    BARTENDER = 'bartender',
}

const options = { discriminatorKey: 'role' };
export interface User extends Document {
    readonly _id: Schema.Types.ObjectId;
    username : string;
    email: string;
    digest: string;
    role: string;
    salt : string;
}

export interface DishCooked {
    qt: number;
    idItem: Schema.Types.ObjectId;
    dateFinished: Date;
}

export interface DrinkPrepared {
    qt: number;
    idItem: Schema.Types.ObjectId;
    dateFinished: Date;
}

export interface Cook extends User{
    dishesCooked : DishCooked[],
    idRestaurant: Schema.Types.ObjectId,
    
}

export interface Bartender extends User{
    drinkPrepared : DrinkPrepared[],
    idRestaurant: Schema.Types.ObjectId
    
}

export interface Waiter extends User{
    ordersTaken : Schema.Types.ObjectId[],
    tablesObservered : Schema.Types.ObjectId[],
    idRestaurant: Schema.Types.ObjectId
    
}

export interface Cashier extends User{
    receiptsPrinted : Schema.Types.ObjectId[],
    idRestaurant: Schema.Types.ObjectId
    
}

export interface Owner extends User{
    restaurantOwn: Schema.Types.ObjectId,
}

const cookSchema = new Schema<Cook>({
    dishesCooked : {
        type : [
            {
                qt : {type : Schema.Types.Number, required : true},
                idItem : {type : Schema.Types.ObjectId, ref : 'Dish', required : true},
                dateFinished : {type : Schema.Types.Date, required : true}
            }
        ]
    },
    idRestaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    
}, options)

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

//ricette = recipes
//ricetta = recipe

const cashierSchema = new Schema<Cashier>({
    receiptsPrinted : {
        type:[
            {type : Schema.Types.ObjectId, ref : 'Recipe', required: true}
        ],
        required : true
    },
    idRestaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    
}, options)

const ownerSchema = new Schema<Owner>({
    
    restaurantOwn: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: false },
    
}, options)


const userSchema = new Schema<User>({
    username: { type: Schema.Types.String, required: true },
    email: { type: Schema.Types.String, required: true },
    digest: { type: Schema.Types.String, required: true },
    salt: { type: Schema.Types.String, required: true },
    role: { type: Schema.Types.String, enum : RoleType, required: true },
}, options);

export function isOwner(owner: any): owner is Owner {
    const partialUser: Partial<Owner> = owner; // creare un oggetto Partial<User> dall'argomento passato
    // verificare se tutte le proprietà obbligatorie di User sono presenti in partialUser
    return partialUser && 
           typeof partialUser.username === 'string' &&
           typeof partialUser.email === 'string' &&
           typeof partialUser.digest === 'string' &&
           typeof partialUser.role === 'string' &&
           typeof partialUser.salt === 'string' &&
           partialUser.restaurantOwn instanceof Schema.Types.ObjectId;
}

export const UserModel = model<User>('User', userSchema);

export const CookModel = UserModel.discriminator<Cook>('Cook', cookSchema, RoleType.COOK);
export const WaiterModel = UserModel.discriminator<Waiter>('Waiter', waiterSchema,  RoleType.WAITER);
export const CashierModel = UserModel.discriminator<Cashier>('Cashier', cashierSchema,  RoleType.CASHIER);
export const BartenderModel = UserModel.discriminator<Bartender>('Bartender', bartenderSchema,  RoleType.BARTENDER);
export const OwnerModel = UserModel.discriminator<Owner>('Owner', ownerSchema,  RoleType.OWNER);

