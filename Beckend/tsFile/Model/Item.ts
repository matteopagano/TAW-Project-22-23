import { Schema, model, Document, Model} from 'mongoose';

const options = { discriminatorKey: 'type' };

export enum ItemType {
    DISH = 'dish',
    DRINK = 'drink'
}
export interface Item extends Document {
    _id: Schema.Types.ObjectId,
    name: string,
    price: number,
    itemType: string,
    allergenes : Schema.Types.ObjectId[],
    idRestaurant : Schema.Types.ObjectId,
    ordersList : Schema.Types.ObjectId[],
}



const itemSchema = new Schema<Item>( {
    name: {
        type: Schema.Types.String,
        required: true,
        unique : true
    },
    price: {
        type: Schema.Types.Number,
        required: true
    },
    itemType: {
        type: Schema.Types.String,
        enum : ItemType,
        required: true 
    },
    allergenes:  {
        type : [
            {

                type: Schema.Types.ObjectId,
                required: true,
                ref : 'Allergene'
            }
        ],
        required : true
    },
    idRestaurant : {
        type: Schema.Types.ObjectId,
        required: true,
        ref : 'Restaurant'
    },
    ordersList:  {
        type : [
            {
                type: Schema.Types.ObjectId,
                required: true,
                ref : 'Order'
            }
        ],
        required : true
    },
}, options)

// Il required presente dentro type nello snippet di codice indica che ogni elemento dell'array "ordersList" è obbligatorio e non può essere vuoto.
// In particolare, la riga required: true indica che il campo "ordersList" è obbligatorio e non può essere lasciato vuoto quando si crea o si aggiorna un documento utilizzando questo schema.


export interface Dish extends Item{
    cooksList : Schema.Types.ObjectId[],
}

const DishSchema = new Schema<Dish>({
    cooksList : { 
        type : [
            {type : Schema.Types.ObjectId, ref : 'Cook', required : true}
        ],
        required : true
    }
}, options)

export interface Drink extends Item{
    bartendersList : Schema.Types.ObjectId[],
}

const Drinkchema = new Schema<Drink>({
    bartendersList : { 
        type : [
            {type : Schema.Types.ObjectId, ref : 'Bartender'}
        ],
        required : true
    }
}, options)

export const ItemModel : Model<Item> = model<Item>('Item', itemSchema);
export const DishModel = ItemModel.discriminator<Dish>('Dish', DishSchema);
export const DrinkModel = ItemModel.discriminator<Drink>('Drink', Drinkchema);



