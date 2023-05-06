import { Schema, model, Document} from 'mongoose';


export interface Restaurant extends Document {
    readonly _id: Schema.Types.ObjectId,
    restaurantName : string,
    employeesList : Schema.Types.ObjectId[],
    owner : Schema.Types.ObjectId,
    tablesList : Schema.Types.ObjectId[],
    daysList : Schema.Types.ObjectId[],
    itemsList : Schema.Types.ObjectId[]
}

const restaurantSchema = new Schema<Restaurant>( {
    restaurantName: {
        type: Schema.Types.String,
        required: true,
    },
    employeesList: {
        type : [
            {
                type: Schema.Types.ObjectId,
                required: false,
                ref : 'User'
            }
        ],
        required : true
    },
    
    owner: {
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
    daysList: {
        type : [{
            type: Schema.Types.ObjectId,
            required: false,
            ref : 'Day'
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
})


export const RestaurantModel = model('Restaurant', restaurantSchema)