import { User, options, RoleType, UserModel } from "./User";
import { Schema, model, Document } from "mongoose";

export interface Owner extends User {
  restaurantOwn: Schema.Types.ObjectId;
  isOwnerOf: (restaurantId: string) => boolean;
  hasAlreadyARestaurant: () => boolean;
  hasARestaurant: () => boolean;
  setRestaurantOwn: (idRestaurantOwn: Schema.Types.ObjectId) => void;
}

const ownerSchema = new Schema<Owner>(
  {
    restaurantOwn: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: false,
    },
  },
  options
);

ownerSchema.methods.isOwnerOf = function (restaurantId): boolean {
  return this.restaurantOwn.toString() === restaurantId;
};

ownerSchema.methods.hasAlreadyARestaurant = function (): boolean {
  if (this.restaurantOwn !== null) {
    return true;
  } else {
    return false;
  }
};

ownerSchema.methods.setRestaurantOwn = function (
  idRestaurantOwn: Schema.Types.ObjectId
): void {
  this.restaurantOwn = idRestaurantOwn;
};

export const OwnerModel = UserModel.discriminator<Owner>(
  "Owner",
  ownerSchema,
  RoleType.OWNER
);
