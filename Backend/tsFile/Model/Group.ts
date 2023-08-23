import { Schema, model, Document, SchemaTypes, Types} from 'mongoose';
import * as Order from './Order';
import * as Recipe from './Recipe';

export interface Group extends Document {

    readonly _id: Schema.Types.ObjectId,
    numberOfPerson : number;
    dateStart : Date
    dateFinish : Date
    ordersList : Schema.Types.ObjectId[],
    idRestaurant : Schema.Types.ObjectId,
    idRecipe : Schema.Types.ObjectId,
    idTable : Schema.Types.ObjectId,


    isOrderPresent : (table : string) => boolean;
    hasRecipe : () => boolean,
    
}

const groupSchema = new Schema<Group>( {
    numberOfPerson: {
        type: Schema.Types.Number,
        required: true,
    },
    dateStart: {
        type: Schema.Types.Date,
        required: true,
    },
    
    dateFinish: {
        type: Schema.Types.Date,
        required: false,
    },
    ordersList: {
        type : [
            {
                type: Schema.Types.ObjectId,
                required: false,
                ref : 'Order'
            }
        ], 
        required : false
    },
    idRestaurant: {
        type: Schema.Types.ObjectId,
        required : false,
        ref : 'Restaurant'
    }, 
    idRecipe: {
        type: Schema.Types.ObjectId,
        required : false,
        ref : 'Recipe'
    },
    idTable: {
        type: Schema.Types.ObjectId,
        required: false,
        ref : 'Table'
    },
    
    
    
    

})

groupSchema.methods.hasRecipe = function(): boolean {
    return (!(this.idRecipe === null))
}

groupSchema.methods.isOrderPresent = function( order : string ) : boolean {
    try{
        return this.ordersList.includes(new Types.ObjectId(order));
    }catch{
        return false;
    }
}

export function createGroup(numberOfPerson : string, idTable : Types.ObjectId, idRestaurant : Types.ObjectId) : Group {
    const newGroup : Group =  new GroupModel({
        numberOfPerson : numberOfPerson,
        dateStart : new Date(),
        dateFinish : null,
        ordersList : [],
        idRestaurant : idRestaurant,
        idRecipe : null,
        idTable : idTable,
    });
    return newGroup;
}


export function addOrder(order : Order.Order, group : Group) {
    group.ordersList.push(order._id)
}

export function addRecipeToGroup(recipe : Recipe.Recipe, group : Group) {
    group.idRecipe = recipe._id
}

export const GroupModel = model('Group', groupSchema)