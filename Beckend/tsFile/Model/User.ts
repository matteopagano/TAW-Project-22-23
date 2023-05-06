import { Schema, model, Document} from 'mongoose';



//ricette = recipes
//ricetta = recipe

export enum Role {
    COOK = 'cook',
    WAITER = 'waiter',
    CASHIER = 'cashier',
    BARTENDER = 'bartender'
}

const options = { discriminatorKey: 'role' };

export interface User extends Document {
    digest: string;
    email: string;
    role: Role;
    idRestaurant: Schema.Types.ObjectId;
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
    //dishesCooked : [{qt : int, idItem: ObjectId, dateC : Date}]
    dishesCooked : DishCooked[]
}

export interface Bartender extends User{
    //drinkPrepared : [{qt : int, idItem: ObjectId}]
    drinkPrepared : DrinkPrepared[]
}

export interface Waiter extends User{
    //ordersTaken :[{idOrder : ObjectId}] 
    //tablesObservered : [{idTable : ObectId}]
    ordersTaken : Schema.Types.ObjectId[],
    tablesObservered : Schema.Types.ObjectId[],
}

export interface Cashier extends User{
    //receiptsPrinted : [{idReceipe: ObjectId}]
    receiptsPrinted : Schema.Types.ObjectId[],
}

const cookSchema = new Schema<Cook>({
    //dishesCooked : [{qt : int, idItem: ObjectId, dateC : Date}]
    dishesCooked : [{qt : Number, idItem : {type : Schema.Types.ObjectId, ref : 'Dishe'}, dateFinished : Date}]
}, options)

const bartenderSchema = new Schema<Bartender>({
    //drinkPrepared : [{qt : int, idItem: ObjectId}]
    drinkPrepared : [{qt : Number, idItem : {type : Schema.Types.ObjectId, ref : 'Drink'}, dateFinished : Date}]
}, options)

const waiterSchema = new Schema<Waiter>({
    //ordersTaken :[{idOrder : ObjectId}] 
    //tablesObservered : [{idTable : ObectId}]
    ordersTaken :[{idOrder : {type : Schema.Types.ObjectId, ref : 'Order'}}],
    tablesObservered : [{idTable : {type : Schema.Types.ObjectId, ref : 'Table'}}]
}, options)

//ricette = recipes
//ricetta = recipe

const cashierSchema = new Schema<Cashier>({
    //receiptsPrinted : [{idReceipe: ObjectId}]
    receiptsPrinted : [{idReceipe : {type : Schema.Types.ObjectId, ref : 'Recipe'}}]
}, options)



const userSchema = new Schema<User>({
    digest: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: Role, required: true },
    idRestaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true }
}, options);



export const UserModel = model<User>('User', userSchema);

export const CookModel = UserModel.discriminator<Cook>('Cook', cookSchema);
export const WaiterModel = UserModel.discriminator<Waiter>('Waiter', waiterSchema);
export const CashierModel = UserModel.discriminator<Cashier>('Cashier', cashierSchema);
export const BartenderModel = UserModel.discriminator<Bartender>('Bartender', bartenderSchema);