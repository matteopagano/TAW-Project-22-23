import { Schema, model, Document, Types, Model} from 'mongoose';
import { isValid, parseISO, isSameDay } from 'date-fns';
import * as Owner from '../Model/Owner';
import * as Cook from '../Model/Cook';
import * as Waiter from '../Model/Waiter';
import * as Cashier from '../Model/Cashier';
import * as Bartender from '../Model/Bartender';


export interface Restaurant extends Document {
    readonly _id: Schema.Types.ObjectId,

    restaurantName : string,
    cookList : Schema.Types.ObjectId[],
    waiterList : Schema.Types.ObjectId[],
    cashierList : Schema.Types.ObjectId[],
    bartenderList : Schema.Types.ObjectId[],
    ownerId : Schema.Types.ObjectId,
    tablesList : Schema.Types.ObjectId[],
    daysList : Schema.Types.ObjectId[],
    itemsList : Schema.Types.ObjectId[],
    
    getId : () => Schema.Types.ObjectId;
    getCookList : () => any;
    getWaiterList : () => any;
    getCashierList : () => any;
    getBartenderList : () => any;

    isCookPresent : (cook : string) => boolean,
    isWaiterPresent : (waiter : string) => boolean,
    isCashierPresent : (cashier : string) => boolean,
    isBartenderPresent : (bartender : string) => boolean;
    isDayPresent : (bartender : string) => boolean;

    removeCook : (cook : string) => boolean,
    removeWaiter : (waiter : string) => boolean,
    removeCashier : (cashier : string) => boolean,
    removeBartender : (bartender : string) => boolean;
    removeDay: (day : string) => boolean;

    

}

const restaurantSchema = new Schema<Restaurant>( {
    restaurantName: {
        type: Schema.Types.String,
        required: true,
    },
    cookList: {
        type : [
            {
                type: Schema.Types.ObjectId,
                required: false,
                ref : 'Cook'
            }
        ],
        required : true
    },
    waiterList: {
        type : [
            {
                type: Schema.Types.ObjectId,
                required: false,
                ref : 'Waiter'
            }
        ],
        required : true
    },
    cashierList: {
        type : [
            {
                type: Schema.Types.ObjectId,
                required: false,
                ref : 'Cashier'
            }
        ],
        required : true
    },
    bartenderList: {
        type : [
            {
                type: Schema.Types.ObjectId,
                required: false,
                ref : 'Bartender'
            }
        ],
        required : true
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref : 'Owner'
    },
    tablesList: {
        type : [{
            type: Schema.Types.ObjectId,
            required: false,
            ref : 'Table'
        }],
        required : true
    },
    itemsList: {
        type : [{
            type: Schema.Types.ObjectId,
            required: false,
            ref : 'Item'
        }],
        required : true
    }
}
)

restaurantSchema.methods.isCookPresent = function( cookId : string ) : boolean {
    try{
        return this.cookList.includes(new Types.ObjectId(cookId));
    }catch{
        return false;
    }
    
    
}

restaurantSchema.methods.isWaiterPresent = function( waiterId : string ) : boolean {
    try{
        return this.waiterList.includes(new Types.ObjectId(waiterId));
    }catch{
        return false;
    }
}

restaurantSchema.methods.isCashierPresent = function( cashierId : string ) : boolean {
    try{
        return this.cashierList.includes(new Types.ObjectId(cashierId));
    }catch{
        return false;
    }
}

restaurantSchema.methods.isBartenderPresent = function( bartenderId : string ) : boolean {
    try{
        return this.bartenderList.includes(new Types.ObjectId(bartenderId));
    }catch{
        return false;
    }
}

restaurantSchema.methods.isDayPresent = function( dayId : string ) : boolean {
    try{
        return this.daysList.includes(new Types.ObjectId(dayId));
    }catch{
        return false;
    }
}

restaurantSchema.methods.removeCook = function( cookId : string ) : boolean {
    let index = this.cookList.indexOf(new Types.ObjectId(cookId));

    if (index !== -1) {
        this.cookList.splice(index, 1);
        return true
    }else{
        return false
    }
}

restaurantSchema.methods.removeWaiter = function( waiter : string ) : boolean {
    let index = this.waiterList.indexOf(new Types.ObjectId(waiter));

    if (index !== -1) {
        this.waiterList.splice(index, 1);
        return true
    }else{
        return false
    }
}

restaurantSchema.methods.removeCashier = function( cashier : string ) : boolean {
    let index = this.cashierList.indexOf(new Types.ObjectId(cashier));

    if (index !== -1) {
        this.cashierList.splice(index, 1);
        return true
    }else{
        return false
    }
}

restaurantSchema.methods.removeBartender = function( bartender : string ) : boolean {
    let index = this.bartenderList.indexOf(new Types.ObjectId(bartender));

    if (index !== -1) {
        this.bartenderList.splice(index, 1);
        return true
    }else{
        return false
    }
}

restaurantSchema.methods.removeDay = function( day : string ) : boolean {
    let index = this.daysList.indexOf(new Types.ObjectId(day));

    if (index !== -1) {
        this.daysList.splice(index, 1);
        return true
    }else{
        return false
    }
}

restaurantSchema.methods.getCookList = function(){
    return this.cookList;
}
restaurantSchema.methods.getWaiterList = function(){
    return this.waiterList;
}
restaurantSchema.methods.getCashierList = function(){
    return this.cashierList;
}
restaurantSchema.methods.getBartenderList = function(){
    return this.bartenderList;
}

restaurantSchema.methods.getId = function(){
    return this._id;
}

export function checkNameCorrectness(restaurantName : string) : boolean {
    const isNotNull : boolean = restaurantName.length !== null
    if(!isNotNull){
        return false
    }else{
        const isLessThan16 : boolean = restaurantName.length <= 15
        return isLessThan16;
    }
}

export function newRestaurant(restaurantName : string, idOwner : Owner.Owner) : Restaurant {
    const newRestaurant : Restaurant = new RestaurantModel({
        restaurantName : restaurantName,
        employeesList : [],
        ownerId : idOwner.getId(),
        tablesList : [],
        daysList : [],
        itemsList : []
    })
    return newRestaurant;
}

export async function addCookToARestaurantAndSave(cook : Cook.Cook, restaurant : Restaurant){
    restaurant.cookList.push(cook.getId()); 
    await restaurant.save() 
  }

export async function addWaiterToARestaurantAndSave(waiter : Waiter.Waiter, restaurant : Restaurant){
    restaurant.waiterList.push(waiter.getId()); 
    await restaurant.save() 
}

export async function addCashierToARestaurantAndSave(user : Cashier.Cashier, restaurant : Restaurant){
    restaurant.cashierList.push(user._id); 
    await restaurant.save() 
}

export async function addBartenderToARestaurantAndSave(user : Bartender.Bartender, restaurant : Restaurant){
    restaurant.bartenderList.push(user._id); 
    await restaurant.save() 
}

export const RestaurantModel = model<Restaurant>('Restaurant', restaurantSchema)