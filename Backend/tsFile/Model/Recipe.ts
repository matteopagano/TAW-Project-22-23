import { Schema, model, Document} from 'mongoose';


interface itemElement {
    qt: number,
    idItem: Schema.Types.ObjectId,
}
export interface Recipe extends Document {

    readonly _id: Schema.Types.ObjectId,
    
    costAmount : Schema.Types.Number,
    dateOfPrinting : Date,
    idGroup : Schema.Types.ObjectId,
    idCashier : Schema.Types.ObjectId,
    idRestaurant : Schema.Types.ObjectId,

}

const recipeSchema = new Schema<Recipe>( {
    costAmount: {
        type: Schema.Types.Number,
        required: true,
    },
    dateOfPrinting: {
        type: Schema.Types.Date,
        required: true,
    },
    idGroup:  {
        type : Schema.Types.ObjectId,
        required : true,
        ref : 'Group'
    },
    idCashier: {
        type: Schema.Types.ObjectId,
        required: true,
        ref : 'Cashier'
    },
    
})


export const RecipeModel = model('Recipe', recipeSchema)