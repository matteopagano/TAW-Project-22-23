import { Schema, model, Document, SchemaTypes, Types} from 'mongoose';




export interface Group extends Document {

    readonly _id: Schema.Types.ObjectId,
    numberOfPerson : number;
    idTable : Schema.Types.ObjectId,
    dateStart : Date
    dateFinish : Date
    recipeId : Schema.Types.ObjectId,
    waitressList : Schema.Types.ObjectId[],
    ordersList : Schema.Types.ObjectId[]
}

const groupSchema = new Schema<Group>( {
    numberOfPerson: {
        type: Schema.Types.Number,
        required: true,
    },
    idTable: {
        type: Schema.Types.ObjectId,
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
    recipeId: {
        type: Schema.Types.ObjectId,
        required : false
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
    ordersList: {
        type : [
            {
                type: Schema.Types.ObjectId,
                required: false,
                ref : 'Order'
            }
        ], 
        required : true
    }

})


export const TableModel = model('Group', groupSchema)