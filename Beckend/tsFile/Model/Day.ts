import mongoose from 'mongoose';

export interface Day extends mongoose.Document {
    readonly _id: mongoose.Schema.Types.ObjectId,
    date: Date,
    orderList : mongoose.Schema.Types.ObjectId[],
    recipeList : mongoose.Schema.Types.ObjectId[],
    idRestaurant : mongoose.Schema.Types.ObjectId
}



const daySchema = new mongoose.Schema<Day>({
    date: {
      type: mongoose.SchemaTypes.Date,
      required: true,
    },
    orderList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order', 
      },
    ],
    recipeList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe', 
      },
    ],
    idRestaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant', // Replace 'Restaurant' with the actual name of your Restaurant model
      required: true,
    },
});
  
export const DaysModel = mongoose.model<Day>('Day', daySchema);

