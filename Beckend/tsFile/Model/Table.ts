import { Schema, model, Document, SchemaTypes, Types} from 'mongoose';
export interface Table extends Document {

    readonly _id: Schema.Types.ObjectId,

    tableNumber : string,
    isFree : boolean,
    maxSeats : number,
    restaurantId : Schema.Types.ObjectId,
    groupcIdCurrentlyPresent : Schema.Types.ObjectId

}

const tableSchema = new Schema<Table>( {
    tableNumber: {
        type: String,
        required: true,
    },
    isFree: {
        type: Boolean,
        required: true,
    },
    
    maxSeats: {
        type: Number,
        required: true,
    },
    
    
    restaurantId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref : 'Restaurant'
    },
    groupcIdCurrentlyPresent: {
        type: Schema.Types.ObjectId,
        required: false,
        ref : 'Recipe'
    }

})

export async function createTableAndSave(tableNumber : number, maxSeats : number, idRestaurant : Types.ObjectId) : Promise<Table> {
    const newTable : Table =  new TableModel({
        tableNumber : tableNumber,
        isFree : true,
        maxSeats : maxSeats,
        restaurantId : idRestaurant,
        groupIdCurrentlyPresent : null
    });

    return await newTable.save();
}

export const TableModel = model('Table', tableSchema)