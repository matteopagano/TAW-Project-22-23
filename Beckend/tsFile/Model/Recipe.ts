import { Schema, model, Document} from 'mongoose';


interface itemElement {
    qt: number,
    idItem: Schema.Types.ObjectId,
}
export interface Recipe extends Document {

    readonly _id: Schema.Types.ObjectId,
    idCashier : Schema.Types.ObjectId,
    dateOfPrinting : Date,
    ordersList : Schema.Types.ObjectId[],
    idGroup : Schema.Types.ObjectId

}

const recipeSchema = new Schema<Recipe>( {
    idCashier: {
        type: Schema.Types.ObjectId,
        required: true,
        ref : 'Cashier'
    },
    dateOfPrinting: {
        type: Schema.Types.Date,
        required: true,
    },
    
    ordersList: {
        type : [
            {
                type: Schema.Types.ObjectId,
                required: false,
                ref : 'Order'
            }
        ], 
        required : true
    },
    idGroup:  {
        type : Schema.Types.ObjectId,
        required : true,
        ref : 'Group'
    }
})


export const RecipeModel = model('Recipe', recipeSchema)