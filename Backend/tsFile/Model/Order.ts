import { Schema, model, Document} from 'mongoose';

interface itemElement {
  dateFinish: Date,
  idItem: Schema.Types.ObjectId,
  state: StateOrder
  completedBy: Schema.Types.ObjectId
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
  idGroup: Schema.Types.ObjectId;
  idWaiter: Schema.Types.ObjectId;
  items: itemElement[];
  state: StateOrder;
  idRestaurant : Schema.Types.ObjectId;
  timeCompleted: Date;
  timeStarted: Date;
}

const orderSchema = new Schema({
    idGroup: {
      type: Schema.Types.ObjectId,
      required: true,
      ref : "Group"
    },
    idWaiter: {
      type : Schema.Types.ObjectId,
      ref : "Waiter",
      required: true
    },
    items: {
        type : [{
            dateFinish : {type: Schema.Types.Date,required: true},
            idItem : {type : Schema.Types.ObjectId, ref : 'Item', required: true},
            state : {type : Schema.Types.String, enum : StateItem, required : true}, // From the official documentation
            completedBy : {type : Schema.Types.ObjectId, ref : 'User', required : true} // From the official documentation
        }],
        required : true
    },
    state: {
      type : Schema.Types.String,
      enum : StateOrder,
      required : true
    },
    idRestaurant: {
      type : Schema.Types.ObjectId,
      ref : "Restaurant",
      required: true
    },
    timeCompleted: {
      type : Schema.Types.Date,
      required : true
    },
    timeStarted: {
      type : Schema.Types.Date,
      required : true
    },
    
    
  });
  
  export const OrderModel = model<Order>('Order', orderSchema);
