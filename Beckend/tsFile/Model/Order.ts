import mongoose from "mongoose";
import { Allergene } from "./Allergene";

interface itemElement {
  qt: number,
  idItem: mongoose.Schema.Types.ObjectId,
  state: string
}

enum State {
    READY = 'ready',
    SERVED = 'served',
    INPROGRESS = 'inProgress',
    NOTSTARTED = 'notStarted'
}

export interface Order extends mongoose.Document {
  readonly _id: mongoose.Schema.Types.ObjectId;
  idTable: mongoose.Schema.Types.ObjectId;
  itemList: [itemElement];
  state: string;
  date: Date;
}

const orderSchema = new mongoose.Schema({
    idTable: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    itemList: //From the off documetation -> [] array
        [{
            qt : {type: Number,required: true},
            idItem : {type : mongoose.Schema.Types.ObjectId,ref : 'Item',required: true},
            state : {type: String, enum: State, required: true} // From the official documentation
            
        }]
    ,
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
