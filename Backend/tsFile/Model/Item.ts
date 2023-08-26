import { Schema, model, Document, Model, Types } from "mongoose";

export enum ItemType {
  DISH = "dish",
  DRINK = "drink",
}
export interface Item extends Document {
  _id: Schema.Types.ObjectId;
  itemName: string;
  itemType: string;
  price: number;
  preparationTime: number;
  idRestaurant: Schema.Types.ObjectId;
  countServered: number;
}

const itemSchema = new Schema<Item>({
  itemName: {
    type: Schema.Types.String,
    required: true,
    unique: true,
  },
  itemType: {
    type: Schema.Types.String,
    enum: ItemType,
    required: true,
  },
  price: {
    type: Schema.Types.Number,
    required: true,
  },
  preparationTime: {
    type: Schema.Types.Number,
    required: true,
  },
  idRestaurant: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Restaurant",
  },
  countServered: {
    type: Schema.Types.Number,
    required: true,
  },
});

export function createItem(
  itemName: string,
  itemType: ItemType,
  price: number,
  preparationTime: number,
  idRestaurant: Types.ObjectId
): Item {
  const newTable: Item = new ItemModel({
    itemName: itemName,
    itemType: itemType,
    price: price,
    preparationTime: preparationTime,
    idRestaurant: idRestaurant,
    countServered: 0,
  });

  return newTable;
}

export const ItemModel: Model<Item> = model<Item>("Item", itemSchema);
