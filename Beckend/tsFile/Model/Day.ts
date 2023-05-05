import mongoose from 'mongoose';

export interface Days extends mongoose.Document {
    readonly _id: mongoose.Schema.Types.ObjectId,
    date: Date,
    orderList : mongoose.Schema.Types.ObjectId[],
    recipeList : mongoose.Schema.Types.ObjectId[],
    idRestaurant : mongoose.Schema.Types.ObjectId
}

// days.ts

const daysSchema = new mongoose.Schema<Days>({
    date: {
      type: mongoose.SchemaTypes.Date,
      required: true,
    },
    orderList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order', // Replace 'Order' with the actual name of your Order model
      },
    ],
    recipeList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe', // Replace 'Recipe' with the actual name of your Recipe model
      },
    ],
    idRestaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant', // Replace 'Restaurant' with the actual name of your Restaurant model
      required: true,
    },
});
  
export const DaysModel = mongoose.model<Days>('Days', daysSchema);

