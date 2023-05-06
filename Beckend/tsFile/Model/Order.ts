import { Schema, model, Document} from 'mongoose';

interface itemElement {
  qt: number,
  idItem: Schema.Types.ObjectId,
  state: StateOrder
}

enum StateOrder {
    READY = 'ready',
    SERVED = 'served',
    INPROGRESS = 'inProgress',
    NOTSTARTED = 'notStarted'
}

enum StateItem {
    COMPLETED = 'completed',
    NOTCOMPLETED = 'notcompleted'
}

export interface Order extends Document {
  readonly _id: Schema.Types.ObjectId;
  idTable: Schema.Types.ObjectId;
  itemList: itemElement[];
  state: string;
  date: Schema.Types.ObjectId;
  idWaiter : Schema.Types.ObjectId;
}

const orderSchema = new Schema({
    idTable: {
      type: Schema.Types.ObjectId,
      required: true,
      ref : "Table"
    },
    itemList: {
        type : [{
            qt : {type: Number,required: true},
            idItem : {type : Schema.Types.ObjectId, ref : 'Item', required: true},
            state : {type : Schema.Types.String, enum : StateItem, required : true} // From the official documentation
            
        }],
        required : true
    }
    ,
    state: {
      type : Schema.Types.String,
      enum : StateOrder,
      required : true
    },
    date: {
      type : Schema.Types.ObjectId,
      ref : "Day",
      required: true
    },
    idWaiter: {
        type : Schema.Types.ObjectId,
        ref : "Waiter",
        required: true
      }
  });
  
  export const OrderModel = model<Order>('Order', orderSchema);
