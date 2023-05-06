import { Schema, model, Document, SchemaTypes} from 'mongoose';
export interface Table extends Document {

    readonly _id: Schema.Types.ObjectId,

    tableNumber : string,
    isFree : boolean,
    maxSeats : number,
    orderList : Schema.Types.ObjectId[],
    waitressList : Schema.Types.ObjectId[],
    restaurantId : Schema.Types.ObjectId,
    recipesId : Schema.Types.ObjectId

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
    orderList: {
        type:[
            {
                type: Schema.Types.ObjectId,
                required: false,
                ref : 'Order'
            }
        ], required : true
    },
    waitressList: {
        type : [
            {
                type: Schema.Types.ObjectId,
                required: false,
                ref : 'Waiter'
            }
        ], 
        required : true
    },
    restaurantId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref : 'Restaurant'
    },
    recipesId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref : 'Recipe'
    }

})


export const TableModel = model('Table', tableSchema)