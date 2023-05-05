import mongoose from "mongoose";
import { Allergene } from "./Allergene";



export interface Order extends mongoose.Document {
  readonly _id: mongoose.Schema.Types.ObjectId;
  restaurantName: String;
  usersList: mongoose.Schema.Types.ObjectId[];
  owner: mongoose.Schema.Types.ObjectId;
}

const orderSchema = new mongoose.Schema({
    idTable: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    itemList: {
        type: [new mongoose.Schema({
          qt: Number,
          idItem: mongoose.Schema.Types.ObjectId,
          state: String
        })],
        required: true
    },
    state: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    }
  });
  
  export const OrderModel = mongoose.model<Order>('Order', orderSchema);