import { Schema, model, Document, SchemaTypes} from 'mongoose';


export interface Table extends Document {

    readonly _id: Schema.Types.ObjectId,

    tableNumber : string,
    isFree : boolean,
    maxSeats : number,
    orderList : Schema.Types.ObjectId[],
    waitressList : Schema.Types.ObjectId[],
    restaurantId : Schema.Types.ObjectId

    
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
    orderList: [{
        type: Schema.Types.ObjectId,
        required: false,
        ref : 'Order'
    }],
    waitressList: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref : 'Waiter'
    }],
    restaurantId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref : 'Restaurant'
    },

})


export const TableModel = model('Table', tableSchema)