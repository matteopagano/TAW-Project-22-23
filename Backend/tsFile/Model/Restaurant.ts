import { Schema, model, Document, Types, Model } from "mongoose";
import { isValid, parseISO, isSameDay } from "date-fns";
import * as Owner from "./Owner";
import * as Cook from "./Cook";
import * as Waiter from "./Waiter";
import * as Cashier from "./Cashier";
import * as Bartender from "./Bartender";
import * as Table from "./Table";
import * as Item from "./Item";
import * as Group from "./Group";
import * as Recipe from "./Recipe";

export interface Restaurant extends Document {
  readonly _id: Schema.Types.ObjectId;

  restaurantName: string;
  ownerId: Schema.Types.ObjectId;
  tables: Schema.Types.ObjectId[];
  items: Schema.Types.ObjectId[];

  cookers: Schema.Types.ObjectId[];
  waiters: Schema.Types.ObjectId[];
  cashiers: Schema.Types.ObjectId[];
  bartenders: Schema.Types.ObjectId[];

  recipes: Schema.Types.ObjectId[];
  groups: Schema.Types.ObjectId[];

  getId: () => Schema.Types.ObjectId;
  getcookers: () => any;
  getwaiters: () => any;
  getcashiers: () => any;
  getbartenders: () => any;

  isCookPresent: (cook: string) => boolean;
  isWaiterPresent: (waiter: string) => boolean;
  isCashierPresent: (cashier: string) => boolean;
  isBartenderPresent: (bartender: string) => boolean;
  isTablePresent: (table: string) => boolean;
  isItemPresent: (table: string) => boolean;
  isDayPresent: (bartender: string) => boolean;

  removeCook: (cook: string) => boolean;
  removeWaiter: (waiter: string) => boolean;
  removeCashier: (cashier: string) => boolean;
  removeBartender: (bartender: string) => boolean;
  removeTable: (table: string) => boolean;
  removeItem: (item: string) => boolean;
  removeGroup: (group: string) => boolean;
}

const restaurantSchema = new Schema<Restaurant>({
  restaurantName: {
    type: Schema.Types.String,
    required: true,
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Owner",
  },
  tables: {
    type: [
      {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "Table",
      },
    ],
    required: true,
  },
  items: {
    type: [
      {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "Item",
      },
    ],
    required: true,
  },
  cookers: {
    type: [
      {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "Cook",
      },
    ],
    required: true,
  },
  waiters: {
    type: [
      {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "Waiter",
      },
    ],
    required: true,
  },
  cashiers: {
    type: [
      {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "Cashier",
      },
    ],
    required: true,
  },
  bartenders: {
    type: [
      {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "Bartender",
      },
    ],
    required: true,
  },
  recipes: {
    type: [
      {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "Recipe",
      },
    ],
    required: true,
  },
  groups: {
    type: [
      {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "Group",
      },
    ],
    required: true,
  },
});

restaurantSchema.methods.isCookPresent = function (cookId: string): boolean {
  try {
    return this.cookers.includes(new Types.ObjectId(cookId));
  } catch {
    return false;
  }
};

restaurantSchema.methods.isWaiterPresent = function (
  waiterId: string
): boolean {
  try {
    return this.waiters.includes(new Types.ObjectId(waiterId));
  } catch {
    return false;
  }
};

restaurantSchema.methods.isCashierPresent = function (
  cashierId: string
): boolean {
  try {
    return this.cashiers.includes(new Types.ObjectId(cashierId));
  } catch {
    return false;
  }
};

restaurantSchema.methods.isBartenderPresent = function (
  bartenderId: string
): boolean {
  try {
    return this.bartenders.includes(new Types.ObjectId(bartenderId));
  } catch {
    return false;
  }
};

restaurantSchema.methods.isTablePresent = function (tableId: string): boolean {
  try {
    return this.tables.includes(new Types.ObjectId(tableId));
  } catch {
    return false;
  }
};

restaurantSchema.methods.isItemPresent = function (item: string): boolean {
  try {
    return this.items.includes(new Types.ObjectId(item));
  } catch {
    return false;
  }
};

restaurantSchema.methods.isDayPresent = function (dayId: string): boolean {
  try {
    return this.daysList.includes(new Types.ObjectId(dayId));
  } catch {
    return false;
  }
};

restaurantSchema.methods.removeCook = function (cookId: string): boolean {
  let index = this.cookers.indexOf(new Types.ObjectId(cookId));

  if (index !== -1) {
    this.cookers.splice(index, 1);
    return true;
  } else {
    return false;
  }
};

restaurantSchema.methods.removeWaiter = function (waiter: string): boolean {
  let index = this.waiters.indexOf(new Types.ObjectId(waiter));

  if (index !== -1) {
    this.waiters.splice(index, 1);
    return true;
  } else {
    return false;
  }
};

restaurantSchema.methods.removeCashier = function (cashier: string): boolean {
  let index = this.cashiers.indexOf(new Types.ObjectId(cashier));

  if (index !== -1) {
    this.cashiers.splice(index, 1);
    return true;
  } else {
    return false;
  }
};

restaurantSchema.methods.removeBartender = function (
  bartender: string
): boolean {
  let index = this.bartenders.indexOf(new Types.ObjectId(bartender));

  if (index !== -1) {
    this.bartenders.splice(index, 1);
    return true;
  } else {
    return false;
  }
};

restaurantSchema.methods.removeTable = function (table: string): boolean {
  let index = this.tables.indexOf(new Types.ObjectId(table));

  if (index !== -1) {
    this.tables.splice(index, 1);
    return true;
  } else {
    return false;
  }
};

restaurantSchema.methods.removeItem = function (item: string): boolean {
  let index = this.items.indexOf(new Types.ObjectId(item));

  if (index !== -1) {
    this.items.splice(index, 1);
    return true;
  } else {
    return false;
  }
};

restaurantSchema.methods.removeGroup = function (group: string): boolean {
  let index = this.groups.indexOf(new Types.ObjectId(group));

  if (index !== -1) {
    this.groups.splice(index, 1);
    return true;
  } else {
    return false;
  }
};

restaurantSchema.methods.getcookers = function () {
  return this.cookers;
};
restaurantSchema.methods.getwaiters = function () {
  return this.waiters;
};
restaurantSchema.methods.getcashiers = function () {
  return this.cashiers;
};
restaurantSchema.methods.getbartenders = function () {
  return this.bartenders;
};

restaurantSchema.methods.getId = function () {
  return this._id;
};

export function checkNameCorrectness(restaurantName: string): boolean {
  const isNotNull: boolean = restaurantName.length !== null;
  if (!isNotNull) {
    return false;
  } else {
    const isLessThan16: boolean = restaurantName.length <= 15;
    return isLessThan16;
  }
}

export function newRestaurant(
  restaurantName: string,
  idOwner: Owner.Owner
): Restaurant {
  const newRestaurant: Restaurant = new RestaurantModel({
    restaurantName: restaurantName,
    ownerId: idOwner.getId(),
    tables: [],
    items: [],
    cookers: [],
    waiters: [],
    cashiers: [],
    bartenders: [],
    recipes: [],
    groups: [],
  });
  return newRestaurant;
}

export function addCookToARestaurant(cook: Cook.Cook, restaurant: Restaurant) {
  restaurant.cookers.push(cook.getId());
}

export function addWaiterToARestaurant(
  waiter: Waiter.Waiter,
  restaurant: Restaurant
) {
  restaurant.waiters.push(waiter.getId());
}

export function addCashierToARestaurant(
  user: Cashier.Cashier,
  restaurant: Restaurant
) {
  restaurant.cashiers.push(user._id);
}

export function addBartenderToARestaurant(
  user: Bartender.Bartender,
  restaurant: Restaurant
) {
  restaurant.bartenders.push(user._id);
}

export function addTableToARestaurant(
  table: Table.Table,
  restaurant: Restaurant
) {
  restaurant.tables.push(table._id);
}

export function addItemToARestaurant(item: Item.Item, restaurant: Restaurant) {
  restaurant.items.push(item._id);
}

export function addGroupToARestaurant(
  group: Group.Group,
  restaurant: Restaurant
) {
  restaurant.groups.push(group._id);
}

export function addRecipeToRestaurant(
  recipe: Recipe.Recipe,
  restaurant: Restaurant
) {
  restaurant.recipes.push(recipe._id);
}

export const RestaurantModel = model<Restaurant>(
  "Restaurant",
  restaurantSchema
);
