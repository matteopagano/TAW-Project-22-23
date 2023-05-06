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
  date: Date;
}

const orderSchema = new Schema({
    idTable: {
      type: Schema.Types.ObjectId,
      required: true
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
      type: Schema.Types.Date,
      required: true
    }
  });
  
  export const OrderModel = model<Order>('Order', orderSchema);
