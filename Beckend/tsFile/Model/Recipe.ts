import { Schema, model, Document} from 'mongoose';


interface itemElement {
    qt: number,
    idItem: Schema.Types.ObjectId,
  }
export interface Recipe extends Document {

    readonly _id: Schema.Types.ObjectId,

    idTable : Schema.Types.ObjectId,
    idCashier : Schema.Types.ObjectId,
    itemsPurchased : itemElement[],
    idDay : Schema.Types.ObjectId

    
}

const recipeSchema = new Schema<Recipe>( {
    idTable: {
        type: Schema.Types.ObjectId,
        required: true,
        ref : 'Table'
    },
    idCashier: {
        type: Schema.Types.ObjectId,
        required: true,
        ref : 'Cashier'
    },
    
    itemsPurchased:  {
        type : [{
            qt : {
                type : Schema.Types.Number,
                required : true,
            },
            idItem : {
                type: Schema.Types.ObjectId,
                required: true,
                ref : 'Item'
            }
        }],
        required : true
    },
    idDay:  {
        type : Schema.Types.ObjectId,
        required : true,
        ref : 'Day'
    }
})


export const RecipeModel = model('Recipe', recipeSchema)