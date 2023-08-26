import { Schema, model, Document, Types } from "mongoose";
import * as Group from "./Group";
import * as Order from "./Order";
import * as Item from "./Item";

export interface Recipe extends Document {
  readonly _id: Schema.Types.ObjectId;

  costAmount: Schema.Types.Number;
  dateOfPrinting: Date;
  idGroup: Schema.Types.ObjectId;
  idCashier: Schema.Types.ObjectId;
  idRestaurant: Schema.Types.ObjectId;
  itemsBought: ItemBought[];
}

const recipeSchema = new Schema<Recipe>({
  costAmount: {
    type: Schema.Types.Number,
    required: true,
  },
  dateOfPrinting: {
    type: Schema.Types.Date,
    required: true,
  },
  idGroup: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Group",
  },
  idCashier: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Cashier",
  },
  itemsBought: {
    type: [
      {
        quantity: { type: Schema.Types.Number, required: true },
        _id: { type: Schema.Types.ObjectId, ref: "Item", required: true },
      },
    ],
    required: true,
  },
});

export interface ItemBought {
  quantity: number;
  _id: Schema.Types.ObjectId;
}

export enum StateItem {
  COMPLETED = "completed",
  NOTCOMPLETED = "notcompleted",
}
interface itemElement {
  timeFinished: Date;
  idItem: Schema.Types.ObjectId;
  state: StateItem;
  completedBy: Schema.Types.ObjectId;
  count: number;
}

export async function createRecipe(
  idCashier: Types.ObjectId,
  idGroup: Types.ObjectId,
  idRestaurant: Types.ObjectId,
  orderList: any
): Promise<Recipe> {
  const itemsMap: Map<string, ItemBought> = new Map();

  var sumTotal: number = 0;

  async function calculateTotal() {
    for (const order of orderList) {
      const populatedOrder: itemElement[] = (
        await Order.OrderModel.findById(order._id).populate("items")
      ).items;

      for (const item of populatedOrder) {
        const idItem = item.idItem;
        const quantity = item.count;

        const existingItem = itemsMap.get(idItem.toString());

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          const newItem: ItemBought = {
            _id: idItem,
            quantity,
          };
          itemsMap.set(idItem.toString(), newItem);
        }
      }
      var sumOrder: number = 0;

      for (const item of populatedOrder) {
        const priceItem: number = (
          await Item.ItemModel.findById(item.idItem.toString())
        ).price;
        sumOrder += priceItem * item.count;
      }

      sumTotal += sumOrder;
    }
  }

  await calculateTotal().catch((error) => {
    console.error(error);
  });

  const itemsForTable: ItemBought[] = Array.from(itemsMap.values());

  const newRecipe: Recipe = new RecipeModel({
    costAmount: sumTotal,
    dateOfPrinting: new Date(),
    idGroup: idGroup,
    idCashier: idCashier,
    idRestaurant: idRestaurant,
    itemsBought: itemsForTable,
  });

  return newRecipe;
}

export const RecipeModel = model("Recipe", recipeSchema);
