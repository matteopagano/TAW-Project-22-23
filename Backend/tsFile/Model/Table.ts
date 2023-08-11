import { Schema, model, Document, SchemaTypes, Types} from 'mongoose';
import * as Group from './Group';

export interface Table extends Document {

    readonly _id: Schema.Types.ObjectId,

    tableNumber : string,
    maxSeats : number,
    group : Schema.Types.ObjectId,
    restaurantId : Schema.Types.ObjectId,

}

const tableSchema = new Schema<Table>( {
    tableNumber: {
        type: String,
        required: true,
    },
    
    maxSeats: {
        type: Number,
        required: true,
    },
    group: {
        type: Schema.Types.ObjectId,
        required: false,
        ref : 'Group'
    },
    restaurantId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref : 'Restaurant'
    },
    

})

export function createTable(tableNumber : number, maxSeats : number, idRestaurant : Types.ObjectId) : Table {
    
    const newTable : Table =  new TableModel({
        tableNumber : tableNumber,
        isFree : true,
        maxSeats : maxSeats,
        restaurantId : idRestaurant
    });

    return newTable;
}

export function addGroupToATable(group : Group.Group, table : Table){
    table.group = group._id
}

export function removeGroupFromTable(table : Table){
    table.group = null
}

export const TableModel = model('Table', tableSchema)