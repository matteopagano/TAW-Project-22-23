import { Schema, model, Document, Model, Types} from 'mongoose';


export enum ItemType {
    DISH = 'dish',
    DRINK = 'drink'
}
export interface Item extends Document {
    _id: Schema.Types.ObjectId,
    itemName: string,
    itemType: string,
    price: number,
    preparationTime : number;
    idRestaurant : Schema.Types.ObjectId,
    
}



const itemSchema = new Schema<Item>( {
    itemName: {
        type: Schema.Types.String,
        required: true,
        unique : true
    },
    itemType: {
        type: Schema.Types.String,
        enum : ItemType,
        required: true 
    },
    price: {
        type: Schema.Types.Number,
        required: true
    },
    preparationTime: {
        type: Schema.Types.Number,
        required: true
    },
    idRestaurant : {
        type: Schema.Types.ObjectId,
        required: true,
        ref : 'Restaurant'
    },
})

// Il required presente dentro type nello snippet di codice indica che ogni elemento dell'array "ordersList" è obbligatorio e non può essere vuoto.
// In particolare, la riga required: true indica che il campo "ordersList" è obbligatorio e non può essere lasciato vuoto quando si crea o si aggiorna un documento utilizzando questo schema.

export function createItem(itemName : string, itemType : ItemType, price : number, preparationTime : number, idRestaurant :  Types.ObjectId) : Item {
    const newTable : Item =  new ItemModel({
        itemName : itemName,
        itemType : itemType,
        price : price,
        preparationTime : preparationTime,
        idRestaurant : idRestaurant
    });

    return newTable;
}

export const ItemModel : Model<Item> = model<Item>('Item', itemSchema);



