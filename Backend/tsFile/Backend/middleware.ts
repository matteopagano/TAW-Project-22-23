import passport = require("passport");
import passportHTTP = require("passport-http");
import * as User from "../Model/User";
import * as Owner from "../Model/Owner";
import * as Bartender from "../Model/Bartender";
import * as Cashier from "../Model/Cashier";
import * as Cooker from "../Model/Cook";
import * as Waiter from "../Model/Waiter";
import { expressjwt as jwt } from "express-jwt";
import { Schema, model, Document } from "mongoose";
import * as Restaurant from "../Model/Restaurant";
import * as Group from "../Model/Group";
import * as Table from "../Model/Table";
import * as Item from "../Model/Item";
import * as Order from "../Model/Order";

passport.use(
  new passportHTTP.BasicStrategy(async function (
    username: string,
    password: string,
    done: Function
  ) {
    let user: User.User = await User.UserModel.findOne({ email: username });

    if (!user) {
      return done({ statusCode: 401, message: "Invalid credentials" }, false);
    }

    if (user.isPasswordCorrect(password)) {
      switch (user.role) {
        case "owner":
          user = new Owner.OwnerModel(user);
          break;
        case "bartender":
          user = new Bartender.BartenderModel(user);
          break;
        case "cashier":
          user = new Cashier.CashierModel(user);
          break;
        case "cook":
          user = new Cooker.CookModel(user);
          break;
        case "waiter":
          user = new Waiter.WaiterModel(user);
          break;
      }
      return done(null, user);
    } else {
      return done({ statusCode: 401, message: "Invalid credentials" }, false);
    }
  })
);

export const verifyJWT = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

export function isOwner(req, res, next) {
  const user: User.User = new User.UserModel(req.auth);
  if (user.isOwner()) {
    return next();
  } else {
    return next({
      statusCode: 404,
      error: true,
      errormessage: "You are not Owner",
    });
  }
}

export function isThatUser(req, res, next) {
  const idUser = req.params.idu;
  if (req.auth._id === idUser) {
    return next();
  } else {
    return next({
      statusCode: 404,
      error: true,
      errormessage: "You are not this user " + idUser,
    });
  }
}

export function isOwnerOrWaiter(req, res, next) {
  const user: User.User = new User.UserModel(req.auth);
  if (user.isOwner() || user.isWaiter()) {
    return next();
  } else {
    return next({
      statusCode: 404,
      error: true,
      errormessage: "You are not Owner or Waiter",
    });
  }
}

export function isOwnerOrCashierOrWaiter(req, res, next) {
  const user: User.User = new User.UserModel(req.auth);
  if (user.isOwner() || user.isWaiter() || user.isCashier()) {
    return next();
  } else {
    return next({
      statusCode: 404,
      error: true,
      errormessage: "You are not Owner or Waiter or Cashier",
    });
  }
}

export function isCookOrBartender(req, res, next) {
  const user: User.User = new User.UserModel(req.auth);
  if (user.isCook() || user.isBartender()) {
    return next();
  } else {
    return next({
      statusCode: 404,
      error: true,
      errormessage: "You are not Cook or Bartender",
    });
  }
}

export function isCookOrWaiterOrBartender(req, res, next) {
  const user: User.User = new User.UserModel(req.auth);
  if (user.isCook() || user.isBartender() || user.isWaiter()) {
    return next();
  } else {
    return next({
      statusCode: 404,
      error: true,
      errormessage: "You are not Cook or Bartender",
    });
  }
}

export function isCookOrWaiter(req, res, next) {
  const user: User.User = new User.UserModel(req.auth);
  if (user.isCook() || user.isWaiter()) {
    return next();
  } else {
    return next({
      statusCode: 404,
      error: true,
      errormessage: "You are not Cook or Waiter",
    });
  }
}

export function isWaiter(req, res, next) {
  const user: User.User = new User.UserModel(req.auth);
  if (user.isWaiter()) {
    return next();
  } else {
    return next({
      statusCode: 404,
      error: true,
      errormessage: "You are not Waiter",
    });
  }
}

export function isCashier(req, res, next) {
  const user: User.User = new User.UserModel(req.auth);
  if (user.isCashier()) {
    return next();
  } else {
    return next({
      statusCode: 404,
      error: true,
      errormessage: "You are not Cashier",
    });
  }
}

export async function isOwnerOfThisRestaurant(req, res, next) {
  const idOwnerAuthenticated = req.auth._id;
  const idRistoranteParameter = req.params.idr;
  const ownerAuthenticated: Owner.Owner = await Owner.OwnerModel.findById(
    idOwnerAuthenticated
  );

  if (ownerAuthenticated !== null) {
    if (ownerAuthenticated.hasAlreadyARestaurant()) {
      if (ownerAuthenticated.isOwnerOf(idRistoranteParameter)) {
        return next();
      } else {
        next({
          statusCode: 404,
          error: true,
          errormessage:
            "You are not owner of id: " +
            idRistoranteParameter +
            " restaurant.",
        });
      }
    } else {
      return next({
        statusCode: 404,
        error: true,
        errormessage: "owner:" + ownerAuthenticated._id + " has not restaurant",
      });
    }
  } else {
    next({ statusCode: 404, error: true, errormessage: "User not found" });
  }
}

export async function isWorkerOfThisRestaurant(req, res, next) {
  const idUserAuthenticated = req.auth._id;
  const idRistoranteParameter = req.params.idr;

  const userAuthenticated: User.User = await User.UserModel.findById(
    idUserAuthenticated
  );

  if (userAuthenticated !== null) {
    const bool = userAuthenticated.isUserOf(idRistoranteParameter);
    if (bool) {
      return next();
    } else {
      return next({
        statusCode: 404,
        error: true,
        errormessage:
          "You are not user of id: " + idRistoranteParameter + " restaurant.",
      });
    }
  } else {
    next({ statusCode: 404, error: true, errormessage: "User not found" });
  }
}

export async function isCashierOfThisRestaurant(req, res, next) {
  const idCashierAuthenticated = req.auth._id;
  const idRistoranteParameter = req.params.idr;
  const cashierAuthenticated: Cashier.Cashier = await Owner.OwnerModel.findById(
    idCashierAuthenticated
  );

  if (cashierAuthenticated !== null) {
    if (cashierAuthenticated.isCashierOf(idRistoranteParameter)) {
      return next();
    } else {
      next({
        statusCode: 404,
        error: true,
        errormessage:
          "You are not cashier of id: " +
          idRistoranteParameter +
          " restaurant.",
      });
    }
  } else {
    next({ statusCode: 404, error: true, errormessage: "User not found" });
  }
}

export async function isCustomerRestaurantTheSameAsWaiter(req, res, next) {
  const idWaiterAuthenticated = req.auth._id;
  const idCustomerGroup = req.params.idc;

  const customerGroup: Group.Group = await Group.GroupModel.findById(
    idCustomerGroup
  );
  const waiterAuthenticated: Waiter.Waiter = await Waiter.WaiterModel.findById(
    idWaiterAuthenticated
  );

  if (waiterAuthenticated !== null) {
    if (customerGroup !== null) {
      if (
        waiterAuthenticated.idRestaurant.toString() ===
        customerGroup.idRestaurant.toString()
      ) {
        return next();
      } else {
        return next({
          statusCode: 404,
          error: true,
          errormessage:
            customerGroup._id +
            " is not customergroup of the waiter " +
            waiterAuthenticated._id,
        });
      }
    } else {
      next({
        statusCode: 404,
        error: true,
        errormessage: "customerGroup not found",
      });
    }
  } else {
    next({ statusCode: 404, error: true, errormessage: "Waiter not found" });
  }
}

export async function isTableRestaurantTheSameAsWaiter(req, res, next) {
  const idWaiterAuthenticated = req.auth._id;
  const idTable = req.params.idt;

  const table: Table.Table = await Table.TableModel.findById(idTable);
  const waiterAuthenticated: Waiter.Waiter = await Waiter.WaiterModel.findById(
    idWaiterAuthenticated
  );

  if (waiterAuthenticated !== null) {
    if (table !== null) {
      if (
        waiterAuthenticated.idRestaurant.toString() ===
        table.restaurantId.toString()
      ) {
        return next();
      } else {
        return next({
          statusCode: 404,
          error: true,
          errormessage:
            table._id +
            " is not table of restaurant" +
            waiterAuthenticated.idRestaurant,
        });
      }
    } else {
      next({ statusCode: 404, error: true, errormessage: "table not found" });
    }
  } else {
    next({ statusCode: 404, error: true, errormessage: "Waiter not found" });
  }
}

export async function isTableRestaurantTheSameAsCashier(req, res, next) {
  const idCahsier = req.auth._id;
  const idTable = req.params.idt;

  const table: Table.Table = await Table.TableModel.findById(idTable);
  const cashier: Cashier.Cashier = await Cashier.CashierModel.findById(
    idCahsier
  );

  if (cashier !== null) {
    if (table !== null) {
      if (cashier.idRestaurant.toString() === table.restaurantId.toString()) {
        return next();
      } else {
        return next({
          statusCode: 404,
          error: true,
          errormessage:
            table._id + " is not table of restaurant " + cashier.idRestaurant,
        });
      }
    } else {
      next({ statusCode: 404, error: true, errormessage: "table not found" });
    }
  } else {
    next({ statusCode: 404, error: true, errormessage: "Cashier not found" });
  }
}

export async function groupHasATable(req, res, next) {
  const idWaiterAuthenticated = req.auth._id;
  const idCustomerGroup = req.params.idc;

  const customerGroup: Group.Group = await Group.GroupModel.findById(
    idCustomerGroup
  );
  const waiterAuthenticated: Waiter.Waiter = await Waiter.WaiterModel.findById(
    idWaiterAuthenticated
  );

  if (waiterAuthenticated !== null) {
    if (customerGroup !== null) {
      if (
        waiterAuthenticated.idRestaurant.toString() ===
        customerGroup.idRestaurant.toString()
      ) {
        return next();
      } else {
        return next({
          statusCode: 404,
          error: true,
          errormessage:
            customerGroup._id +
            " is not customergroup of the waiter " +
            waiterAuthenticated._id,
        });
      }
    } else {
      next({
        statusCode: 404,
        error: true,
        errormessage: "customerGroup not found not found",
      });
    }
  } else {
    next({ statusCode: 404, error: true, errormessage: "Waiter not found" });
  }
}

export async function groupHasARecipe(req, res, next) {
  const idWaiterAuthenticated = req.auth._id;
  const idTable = req.params.idt;

  const table: Table.Table = await Table.TableModel.findById(idTable);

  const group: Group.Group = await Group.GroupModel.findById(table.group);

  if (table !== null) {
    if (group !== null) {
      if (group.hasRecipe()) {
        return next();
      } else {
        return next({
          statusCode: 404,
          error: true,
          errormessage: group._id + " has not a recipe ",
        });
      }
    } else {
      next({ statusCode: 404, error: true, errormessage: "group not found" });
    }
  } else {
    next({ statusCode: 404, error: true, errormessage: "table not found" });
  }
}

export async function groupHasNotARecipeYet(req, res, next) {
  const idWaiterAuthenticated = req.auth._id;
  const idTable = req.params.idt;

  const table: Table.Table = await Table.TableModel.findById(idTable);

  const group: Group.Group = await Group.GroupModel.findById(table.group);

  if (table !== null) {
    if (group !== null) {
      if (!group.hasRecipe()) {
        return next();
      } else {
        return next({
          statusCode: 404,
          error: true,
          errormessage: group._id + " has a recipe ",
        });
      }
    } else {
      next({ statusCode: 404, error: true, errormessage: "group not found" });
    }
  } else {
    next({ statusCode: 404, error: true, errormessage: "table not found" });
  }
}

export async function groupHasARecipeYet(req, res, next) {
  const idWaiterAuthenticated = req.auth._id;
  const idTable = req.params.idt;

  const table: Table.Table = await Table.TableModel.findById(idTable);

  const group: Group.Group = await Group.GroupModel.findById(table.group);

  if (table !== null) {
    if (group !== null) {
      if (group.hasRecipe()) {
        return next();
      } else {
        return next({
          statusCode: 404,
          error: true,
          errormessage: group._id + " doesn't have a recipe ",
        });
      }
    } else {
      next({ statusCode: 404, error: true, errormessage: "group not found" });
    }
  } else {
    next({ statusCode: 404, error: true, errormessage: "table not found" });
  }
}

export async function areOrdersFinished(req, res, next) {
  const idWaiterAuthenticated = req.auth._id;
  const idTable = req.params.idt;

  const table: Table.Table = await Table.TableModel.findById(idTable);

  const group: Group.Group = await Group.GroupModel.findById(
    table.group
  ).populate("ordersList");

  const orders: Order.Order[] = group.ordersList as unknown as Order.Order[];

  if (table !== null) {
    if (group !== null) {
      const orders: Order.Order[] =
        group.ordersList as unknown as Order.Order[];

      console.log(orders);

      const allServed = orders.every(
        (orderItem) => orderItem.state === "served"
      );
      if (allServed) {
        return next();
      } else {
        return next({
          statusCode: 404,
          error: true,
          errormessage: group._id + " has orders not servered ",
        });
      }
    } else {
      next({ statusCode: 404, error: true, errormessage: "group not found" });
    }
  } else {
    next({ statusCode: 404, error: true, errormessage: "table not found" });
  }
}

export async function hasNotAlreadyARestaurant(req, res, next) {
  const idOwner = req.auth._id;
  const owner: Owner.Owner = await Owner.OwnerModel.findById(idOwner);

  if (owner) {
    if (!owner.hasAlreadyARestaurant()) {
      next();
    } else {
      return next({
        statusCode: 404,
        error: true,
        errormessage:
          "Owner: " +
          owner._id +
          " has already a restaurant. restaurantId:" +
          owner.restaurantOwn.toString(),
      });
    }
  } else {
    return next({
      statusCode: 404,
      error: true,
      errormessage: "Owner with id: " + req.auth._id + " doesn't exist",
    });
  }
}

export async function isCookMemberOfThatRestaurant(req, res, next) {
  const cookIdToRemove = req.params.idu;
  const restaurantIdInWhichRemoveCook = req.params.idr;
  const restaurant: Restaurant.Restaurant =
    await Restaurant.RestaurantModel.findById(restaurantIdInWhichRemoveCook);
  if (restaurant.isCookPresent(cookIdToRemove)) {
    next();
  } else {
    next({
      statusCode: 404,
      error: true,
      errormessage:
        "cook " +
        cookIdToRemove +
        " is not member of " +
        restaurantIdInWhichRemoveCook,
    });
  }
}

export async function isWaiterMemberOfThatRestaurant(req, res, next) {
  const waiterIdToRemove = req.params.idu;
  const restaurantIdInWhichRemoveWaiter = req.params.idr;
  const restaurant: Restaurant.Restaurant =
    await Restaurant.RestaurantModel.findById(restaurantIdInWhichRemoveWaiter);

  if (restaurant.isWaiterPresent(waiterIdToRemove)) {
    next();
  } else {
    next({
      statusCode: 404,
      error: true,
      errormessage:
        "waiter " +
        waiterIdToRemove +
        " is not member of " +
        restaurantIdInWhichRemoveWaiter,
    });
  }
}

export async function isCashierMemberOfThatRestaurant(req, res, next) {
  const cashierIdToRemove = req.params.idu;
  const restaurantIdInWhichRemoveCashier = req.params.idr;
  const restaurant: Restaurant.Restaurant =
    await Restaurant.RestaurantModel.findById(restaurantIdInWhichRemoveCashier);

  if (restaurant.isCashierPresent(cashierIdToRemove)) {
    next();
  } else {
    next({
      statusCode: 404,
      error: true,
      errormessage:
        "cashier " +
        cashierIdToRemove +
        " is not member of " +
        restaurantIdInWhichRemoveCashier,
    });
  }
}

export async function isBartenderMemberOfThatRestaurant(req, res, next) {
  const bartenderIdToRemove = req.params.idu;
  const restaurantIdInWhichRemoveBartender = req.params.idr;
  const restaurant: Restaurant.Restaurant =
    await Restaurant.RestaurantModel.findById(
      restaurantIdInWhichRemoveBartender
    );

  if (restaurant.isBartenderPresent(bartenderIdToRemove)) {
    next();
  } else {
    next({
      statusCode: 404,
      error: true,
      errormessage:
        "bartender " +
        bartenderIdToRemove +
        " is not member of " +
        restaurantIdInWhichRemoveBartender,
    });
  }
}

export async function isDayOfThatRestaurant(req, res, next) {
  const idDayToRemove = req.params.idd;
  const restaurantIdInWhichRemoveDay = req.params.idr;
  const restaurant: Restaurant.Restaurant =
    await Restaurant.RestaurantModel.findById(restaurantIdInWhichRemoveDay);

  if (restaurant.isDayPresent(idDayToRemove)) {
    next();
  } else {
    next({
      statusCode: 404,
      error: true,
      errormessage:
        "day " +
        idDayToRemove +
        " is not day of " +
        restaurantIdInWhichRemoveDay,
    });
  }
}

export function isValidRestaurantInput(req, res, next) {
  const restaurantNameBody = req.body.restaurantName;
  if (Restaurant.checkNameCorrectness(restaurantNameBody)) {
    next();
  } else {
    return next({
      statusCode: 404,
      error: true,
      errormessage:
        "Restaurant name not valid. Name's length must be less than 16. restaurant name : " +
        restaurantNameBody,
    });
  }
}

export async function isUserAlreadyExist(req, res, next) {
  const emailBody = req.body.email;
  const userFind = await User.UserModel.findOne({ email: emailBody });

  if (!userFind) {
    next();
  } else {
    return next({
      statusCode: 404,
      error: true,
      errormessage: "User : " + emailBody + " already exist.",
    });
  }
}

export async function isItemAlreadyExist(req, res, next) {
  const itemName = req.body.itemName;
  const itemFind = await Item.ItemModel.findOne({ itemName: itemName });

  if (!itemFind) {
    next();
  } else {
    return next({
      statusCode: 404,
      error: true,
      errormessage: "Item : " + itemName + " already exist.",
    });
  }
}

export async function isTableAlreadyExist(req, res, next) {
  const tableNumber = req.body.tableNumber;
  const table = await Table.TableModel.findOne({ tableNumber: tableNumber });

  if (!table) {
    next();
  } else {
    return next({
      statusCode: 404,
      error: true,
      errormessage: "Table : " + tableNumber + " already exist.",
    });
  }
}

export async function isTableOfThatRestaurant(req, res, next) {
  const tableIdToRemove = req.params.idt;
  const restaurantIdInWhichRemoveTable = req.params.idr;
  const restaurant: Restaurant.Restaurant =
    await Restaurant.RestaurantModel.findById(restaurantIdInWhichRemoveTable);

  if (restaurant.isTablePresent(tableIdToRemove)) {
    next();
  } else {
    next({
      statusCode: 404,
      error: true,
      errormessage:
        "table " +
        tableIdToRemove +
        " is not table of " +
        restaurantIdInWhichRemoveTable,
    });
  }
}

export async function isOrderOfThatGroup(req, res, next) {
  const tableId = req.params.idt;
  const orderId = req.params.ido;
  const table: Table.Table = await Table.TableModel.findById(tableId);

  const group: Group.Group = await Group.GroupModel.findById(table.group);

  if (group.isOrderPresent(orderId)) {
    next();
  } else {
    next({
      statusCode: 404,
      error: true,
      errormessage: "order " + orderId + " is not order of group" + group._id,
    });
  }
}

export async function isTableEmpty(req, res, next) {
  const tableIdToAdd = req.params.idt;
  const numberOfPerson = req.body.numberOfPerson;
  const table: Table.Table = await Table.TableModel.findById(tableIdToAdd);

  numberOfPerson <= table.maxSeats;
  if (table.isEmpty()) {
    if (numberOfPerson <= table.maxSeats) {
      next();
    } else {
      next({
        statusCode: 404,
        error: true,
        errormessage:
          numberOfPerson +
          ">" +
          table.maxSeats +
          ", table capacity is not sufficient",
      });
    }
  } else {
    next({
      statusCode: 404,
      error: true,
      errormessage: "table " + tableIdToAdd + " is not empty",
    });
  }
}

export async function tableHasAGroup(req, res, next) {
  const idTable = req.params.idt;

  const table: Table.Table = await Table.TableModel.findById(idTable);

  if (table.group) {
    next();
  } else {
    next({
      statusCode: 404,
      error: true,
      errormessage: "table " + idTable + " doesn't have a group sitted",
    });
  }
}

export async function isItemOfThatRestaurant(req, res, next) {
  const itemIdToRemove = req.params.idi;
  const restaurantIdInWhichRemoveTable = req.params.idr;
  const restaurant: Restaurant.Restaurant =
    await Restaurant.RestaurantModel.findById(restaurantIdInWhichRemoveTable);

  if (restaurant.isItemPresent(itemIdToRemove)) {
    next();
  } else {
    next({
      statusCode: 404,
      error: true,
      errormessage:
        "item " +
        itemIdToRemove +
        " is not item of " +
        restaurantIdInWhichRemoveTable,
    });
  }
}

export const basicAuthentication = passport.authenticate("basic", {
  session: false,
});
