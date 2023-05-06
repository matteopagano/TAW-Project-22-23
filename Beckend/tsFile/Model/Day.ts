import { Schema, model, Document} from 'mongoose';

export interface Day extends Document {
    readonly _id: Schema.Types.ObjectId,
    date: Date,
    orderList : Schema.Types.ObjectId[],
    recipeList : Schema.Types.ObjectId[],
    idRestaurant : Schema.Types.ObjectId
}



const daySchema = new Schema<Day>({
    date: {
      type: Schema.Types.Date,
      required: true
    },
    orderList: {
        type : [
                {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: 'Order'
                },
        ],
        required: true,
    },
    recipeList: { 
        type :[
                {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: 'Recipe'
                },
        ],
        required: true,
    },
    idRestaurant: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Restaurant'
    },
});
  
export const DayModel = model<Day>('Day', daySchema);

