import { User, options, RoleType, UserModel } from "./User";
import { Schema, model, Document, Types } from "mongoose";

export interface itemPrepared {
  idItem: Schema.Types.ObjectId;
  count: number;
}

export interface Bartender extends User {
  itemsPrepared: itemPrepared[];
}

const bartenderSchema = new Schema<Bartender>(
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

export function createBartender(
  username: string,
  email: string,
  password: string,
  idRestaurant: Types.ObjectId
): Bartender {
  const newBartender: Bartender = new BartenderModel({
    username: username,
    email: email,
    role: RoleType.BARTENDER,
    drinkPrepared: [],
    idRestaurant: idRestaurant,
    itemsPrepared: [],
  });
  newBartender.setPassword(password);
  return newBartender;
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

export const BartenderModel = UserModel.discriminator<Bartender>(
  "Bartender",
  bartenderSchema,
  RoleType.BARTENDER
);
