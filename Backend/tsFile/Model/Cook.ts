import { User, options, RoleType, UserModel } from "./User";
import mongoose, { Schema, model, Document, Types } from "mongoose";

export interface itemPrepared {
  idItem: Schema.Types.ObjectId;
  count: number;
}

export interface Cook extends User {
  itemsPrepared: itemPrepared[];
}

const cookSchema = new Schema<Cook>(
  {
    itemsPrepared: {
      type: [
        {
          idItem: { type: Schema.Types.ObjectId, ref: "Item", required: true },
          count: { type: Schema.Types.Number, required: true },
        },
      ],
      required: true,
    },
  },
  options
);

export function createCook(
  username: string,
  email: string,
  password: string,
  idRestaurant: Types.ObjectId
): Cook {
  const newCook: Cook = new CookModel({
    username: username,
    email: email,
    role: RoleType.COOK,
    dishesCooked: [],
    idRestaurant: idRestaurant,
    itemsPrepared: [],
  });
  newCook.setPassword(password);
  return newCook;
}

export function createItemPrepared(
  count: number,
  idItem: Types.ObjectId
): itemPrepared {
  const newItemPrepared: any = {
    idItem: idItem,
    count: count,
  };
  return newItemPrepared;
}

export const CookModel = UserModel.discriminator<Cook>(
  "Cook",
  cookSchema,
  RoleType.COOK
);
