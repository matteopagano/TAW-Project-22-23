import mongoose from 'mongoose';

export interface Item extends mongoose.Document {
    readonly _id: mongoose.Schema.Types.ObjectId,
    name: string,
    price: string,
    type: string[],
    allergenes : mongoose.Schema.Types.ObjectId[],
    idRestaurant : mongoose.Schema.Types.ObjectId
}

const itemSchema = new mongoose.Schema<Item>( {
    name: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    price: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    },
    type:  {
        type: [mongoose.SchemaTypes.String],
        required: true 
    },
    allergenes:  [{
        type: mongoose.SchemaTypes.String,
        required: false,
        ref : 'Allergene'
    }],
    idRestaurant : {
        type: mongoose.SchemaTypes.String,
        required: true,
    }
})

export const ItemModel = mongoose.model<Item>('Item', itemSchema);

