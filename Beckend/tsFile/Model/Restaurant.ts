import { Schema, model, Document, SchemaTypes} from 'mongoose';


export interface Restaurant extends Document {

    readonly _id: Schema.Types.ObjectId,

    restaurantName : string,
    usersList : Schema.Types.ObjectId[],
    owner : Schema.Types.ObjectId,
    tablesList : Schema.Types.ObjectId[]

    
}

const restaurantSchema = new Schema<Restaurant>( {
    restaurantName: {
        type: String,
        required: true,
    },
    usersList: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref : 'User'
    }],
    
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref : 'Owner'
    },
    tablesList: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref : 'Table'
    }],
})


export const RestaurantModel = model('Restaurant', restaurantSchema)