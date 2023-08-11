import { Schema, model, Document, Types} from 'mongoose';
import { ItemModel } from './Item';

interface itemElement {
  timeFinished: Date,
  idItem: Schema.Types.ObjectId,
  state: StateItem
  completedBy: Schema.Types.ObjectId
  count : number
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
            timeFinished : {type: Schema.Types.Date,required: false},
            idItem : {type : Schema.Types.ObjectId, ref : 'Item', required: true},
            state : {type : Schema.Types.String, enum : StateItem, required : true}, // From the official documentation
            completedBy : {type : Schema.Types.ObjectId, ref : 'User', required : false}, // From the official documentation
            count : {type : Schema.Types.Number, required : true}
        }],
        required : true
    },
    state: {
      type : Schema.Types.String,
      enum : StateOrder,
      required : true
    },
    timeCompleted: {
      type : Schema.Types.Date,
      required : false
    },
    timeStarted: {
      type : Schema.Types.Date,
      required : true
    },
    
    
  });

  export function createOrder(idGroup :  Types.ObjectId, idWaiter : Types.ObjectId, items ) : Order {

    const itemsList: itemElement[] = [];

    items.forEach(item => {
      const itemId = item.itemId;
      const count = item.count;
      
      const newItem: itemElement = {
        timeFinished: null,
        idItem: itemId,
        state: StateItem.NOTCOMPLETED, // Supponiamo che StateOrder sia un tipo definito
        completedBy: null,
        count: count,
        
      };

      // Fai qualcosa con itemId e count
      itemsList.push(newItem);
    });

    console.log("printo nuova item list")
    console.log(itemsList)
  
    const newOrder : Order =  new OrderModel({
      idGroup: idGroup,
      idWaiter: idWaiter,
      items: itemsList,
      state: StateOrder.NOTSTARTED,
      timeCompleted: null,
      timeStarted: new Date(),
    });

    console.log("Printo nuovo ordine")
    console.log(newOrder)
    return newOrder;
}
  
  export const OrderModel = model<Order>('Order', orderSchema);
