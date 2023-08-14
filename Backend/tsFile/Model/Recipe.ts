import { Schema, model, Document, Types} from 'mongoose';
import * as Group from './Group';
import * as Order from './Order';
import * as Item from './Item';


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

export async function createRecipe(idCashier :  Types.ObjectId,idGroup : Types.ObjectId, idRestaurant : Types.ObjectId, orderList : any) : Promise<Recipe> {

    
    //const group : Group.Group = await Group.GroupModel.findById(recipeId.toString()).populate("ordersList")

    

    //console.log(group)

    var sumTotal: number = 0;

    async function calculateTotal() {
        for (const order of orderList) {
            const populatedOrder = await Order.OrderModel.findById(order._id).populate("items").lean();

            var sumOrder: number = 0;

            for (const item of populatedOrder.items) {
                const priceItem: number = (await Item.ItemModel.findById(item.idItem.toString())).price;
                sumOrder += priceItem * item.count;
            }

            sumTotal += sumOrder;
        }

        
    }

    await  calculateTotal().catch((error) => {
        console.error(error);
    });



    const newRecipe : Recipe =  new RecipeModel({
        costAmount : sumTotal,
        dateOfPrinting : new Date(),
        idGroup : idGroup,
        idCashier : idCashier,
        idRestaurant : idRestaurant,
    });




    return newRecipe
    
}

export const RecipeModel = model('Recipe', recipeSchema)