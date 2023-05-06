import { Schema, model, Document} from 'mongoose';



//ricette = recipes
//ricetta = recipe


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
    salt : string;
    role: string;
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
    employeesList : Schema.Types.ObjectId[],
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
    employeesList : {
        type:[
            {type : Schema.Types.ObjectId, ref : 'User'}
        ],
        required : true
    },
    restaurantOwn: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: false },
    
}, options)


const userSchema = new Schema<User>({
    username: { type: Schema.Types.String, required: true },
    email: { type: Schema.Types.String, required: true },
    digest: { type: Schema.Types.String, required: true },
    salt: { type: Schema.Types.String, required: true },
    role: { type: Schema.Types.String, enum : RoleType, required: true },
}, options);


export const UserModel = model<User>('User', userSchema);

export const CookModel = UserModel.discriminator<Cook>('Cook', cookSchema, RoleType.COOK);
export const WaiterModel = UserModel.discriminator<Waiter>('Waiter', waiterSchema,  RoleType.WAITER);
export const CashierModel = UserModel.discriminator<Cashier>('Cashier', cashierSchema,  RoleType.CASHIER);
export const BartenderModel = UserModel.discriminator<Bartender>('Bartender', bartenderSchema,  RoleType.BARTENDER);
export const OwnerModel = UserModel.discriminator<Owner>('Owner', ownerSchema,  RoleType.OWNER);