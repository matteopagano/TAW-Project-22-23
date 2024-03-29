import { User, options, RoleType, UserModel } from "./User";
import { Schema, model, Document, Types } from "mongoose";
import * as Order from "./Order";

export interface Waiter extends User {
  ordersAwaiting: Schema.Types.ObjectId[];
  ordersServed: Schema.Types.ObjectId[];
  addOrderAwaited: (cook: string) => boolean;
}

const waiterSchema = new Schema<Waiter>(
  {
    ordersAwaiting: [
      { type: Schema.Types.ObjectId, ref: "Order", required: true },
    ],
    ordersServed: [
      { type: Schema.Types.ObjectId, ref: "Order", required: true },
    ],
  },
  options
);

export function addOrderAwaited(order: Order.Order, waiter: Waiter) {
  waiter.ordersAwaiting.push(order._id);
}

export function addOrderServed(order: Order.Order, waiter: Waiter) {
  waiter.ordersServed.push(order._id);
}

export function removeOrderAwaited(order: Order.Order, waiter: Waiter) {
  const index = waiter.ordersAwaiting.indexOf(order._id);

  if (index !== -1) {
    waiter.ordersAwaiting.splice(index, 1);
  }
}

export function createWaiter(
  username: string,
  email: string,
  password: string,
  idRestaurant: Types.ObjectId
): Waiter {
  const newWaiter: Waiter = new WaiterModel({
    username: username,
    email: email,
    role: RoleType.WAITER,
    ordersAwaiting: [],
    ordersServed: [],
    idRestaurant: idRestaurant,
  });
  newWaiter.setPassword(password);
  return newWaiter;
}

export const WaiterModel = UserModel.discriminator<Waiter>(
  "Waiter",
  waiterSchema,
  RoleType.WAITER
);
