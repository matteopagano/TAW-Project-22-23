"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicAuthentication = exports.isItemOfThatRestaurant = exports.tableHasAGroup = exports.isTableEmpty = exports.isOrderOfThatGroup = exports.isTableOfThatRestaurant = exports.isTableAlreadyExist = exports.isItemAlreadyExist = exports.isUserAlreadyExist = exports.isValidRestaurantInput = exports.isDayOfThatRestaurant = exports.isBartenderMemberOfThatRestaurant = exports.isCashierMemberOfThatRestaurant = exports.isWaiterMemberOfThatRestaurant = exports.isCookMemberOfThatRestaurant = exports.hasNotAlreadyARestaurant = exports.areOrdersFinished = exports.groupHasARecipeYet = exports.groupHasNotARecipeYet = exports.groupHasARecipe = exports.groupHasATable = exports.isTableRestaurantTheSameAsCashier = exports.isTableRestaurantTheSameAsWaiter = exports.isCustomerRestaurantTheSameAsWaiter = exports.isCashierOfThisRestaurant = exports.isWorkerOfThisRestaurant = exports.isOwnerOfThisRestaurant = exports.isCashier = exports.isWaiter = exports.isCookOrWaiter = exports.isCookOrWaiterOrBartender = exports.isCookOrBartender = exports.isOwnerOrCashierOrWaiter = exports.isOwnerOrWaiter = exports.isThatUser = exports.isOwner = exports.verifyJWT = void 0;
const passport = require("passport");
const passportHTTP = require("passport-http");
const User = __importStar(require("../Model/User"));
const Owner = __importStar(require("../Model/Owner"));
const Bartender = __importStar(require("../Model/Bartender"));
const Cashier = __importStar(require("../Model/Cashier"));
const Cooker = __importStar(require("../Model/Cook"));
const Waiter = __importStar(require("../Model/Waiter"));
const express_jwt_1 = require("express-jwt");
const Restaurant = __importStar(require("../Model/Restaurant"));
const Group = __importStar(require("../Model/Group"));
const Table = __importStar(require("../Model/Table"));
const Item = __importStar(require("../Model/Item"));
passport.use(new passportHTTP.BasicStrategy(function (username, password, done) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield User.UserModel.findOne({ email: username });
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
        }
        else {
            return done({ statusCode: 401, message: "Invalid credentials" }, false);
        }
    });
}));
exports.verifyJWT = (0, express_jwt_1.expressjwt)({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
});
function isOwner(req, res, next) {
    const user = new User.UserModel(req.auth);
    if (user.isOwner()) {
        return next();
    }
    else {
        return next({
            statusCode: 404,
            error: true,
            errormessage: "You are not Owner",
        });
    }
}
exports.isOwner = isOwner;
function isThatUser(req, res, next) {
    const idUser = req.params.idu;
    if (req.auth._id === idUser) {
        return next();
    }
    else {
        return next({
            statusCode: 404,
            error: true,
            errormessage: "You are not this user " + idUser,
        });
    }
}
exports.isThatUser = isThatUser;
function isOwnerOrWaiter(req, res, next) {
    const user = new User.UserModel(req.auth);
    if (user.isOwner() || user.isWaiter()) {
        return next();
    }
    else {
        return next({
            statusCode: 404,
            error: true,
            errormessage: "You are not Owner or Waiter",
        });
    }
}
exports.isOwnerOrWaiter = isOwnerOrWaiter;
function isOwnerOrCashierOrWaiter(req, res, next) {
    const user = new User.UserModel(req.auth);
    if (user.isOwner() || user.isWaiter() || user.isCashier()) {
        return next();
    }
    else {
        return next({
            statusCode: 404,
            error: true,
            errormessage: "You are not Owner or Waiter or Cashier",
        });
    }
}
exports.isOwnerOrCashierOrWaiter = isOwnerOrCashierOrWaiter;
function isCookOrBartender(req, res, next) {
    const user = new User.UserModel(req.auth);
    if (user.isCook() || user.isBartender()) {
        return next();
    }
    else {
        return next({
            statusCode: 404,
            error: true,
            errormessage: "You are not Cook or Bartender",
        });
    }
}
exports.isCookOrBartender = isCookOrBartender;
function isCookOrWaiterOrBartender(req, res, next) {
    const user = new User.UserModel(req.auth);
    if (user.isCook() || user.isBartender() || user.isWaiter()) {
        return next();
    }
    else {
        return next({
            statusCode: 404,
            error: true,
            errormessage: "You are not Cook or Bartender",
        });
    }
}
exports.isCookOrWaiterOrBartender = isCookOrWaiterOrBartender;
function isCookOrWaiter(req, res, next) {
    const user = new User.UserModel(req.auth);
    if (user.isCook() || user.isWaiter()) {
        return next();
    }
    else {
        return next({
            statusCode: 404,
            error: true,
            errormessage: "You are not Cook or Waiter",
        });
    }
}
exports.isCookOrWaiter = isCookOrWaiter;
function isWaiter(req, res, next) {
    const user = new User.UserModel(req.auth);
    if (user.isWaiter()) {
        return next();
    }
    else {
        return next({
            statusCode: 404,
            error: true,
            errormessage: "You are not Waiter",
        });
    }
}
exports.isWaiter = isWaiter;
function isCashier(req, res, next) {
    const user = new User.UserModel(req.auth);
    if (user.isCashier()) {
        return next();
    }
    else {
        return next({
            statusCode: 404,
            error: true,
            errormessage: "You are not Cashier",
        });
    }
}
exports.isCashier = isCashier;
function isOwnerOfThisRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idOwnerAuthenticated = req.auth._id;
        const idRistoranteParameter = req.params.idr;
        const ownerAuthenticated = yield Owner.OwnerModel.findById(idOwnerAuthenticated);
        if (ownerAuthenticated !== null) {
            if (ownerAuthenticated.hasAlreadyARestaurant()) {
                if (ownerAuthenticated.isOwnerOf(idRistoranteParameter)) {
                    return next();
                }
                else {
                    next({
                        statusCode: 404,
                        error: true,
                        errormessage: "You are not owner of id: " +
                            idRistoranteParameter +
                            " restaurant.",
                    });
                }
            }
            else {
                return next({
                    statusCode: 404,
                    error: true,
                    errormessage: "owner:" + ownerAuthenticated._id + " has not restaurant",
                });
            }
        }
        else {
            next({ statusCode: 404, error: true, errormessage: "User not found" });
        }
    });
}
exports.isOwnerOfThisRestaurant = isOwnerOfThisRestaurant;
function isWorkerOfThisRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idUserAuthenticated = req.auth._id;
        const idRistoranteParameter = req.params.idr;
        const userAuthenticated = yield User.UserModel.findById(idUserAuthenticated);
        if (userAuthenticated !== null) {
            const bool = userAuthenticated.isUserOf(idRistoranteParameter);
            if (bool) {
                return next();
            }
            else {
                return next({
                    statusCode: 404,
                    error: true,
                    errormessage: "You are not user of id: " + idRistoranteParameter + " restaurant.",
                });
            }
        }
        else {
            next({ statusCode: 404, error: true, errormessage: "User not found" });
        }
    });
}
exports.isWorkerOfThisRestaurant = isWorkerOfThisRestaurant;
function isCashierOfThisRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idCashierAuthenticated = req.auth._id;
        const idRistoranteParameter = req.params.idr;
        const cashierAuthenticated = yield Owner.OwnerModel.findById(idCashierAuthenticated);
        if (cashierAuthenticated !== null) {
            if (cashierAuthenticated.isCashierOf(idRistoranteParameter)) {
                return next();
            }
            else {
                next({
                    statusCode: 404,
                    error: true,
                    errormessage: "You are not cashier of id: " +
                        idRistoranteParameter +
                        " restaurant.",
                });
            }
        }
        else {
            next({ statusCode: 404, error: true, errormessage: "User not found" });
        }
    });
}
exports.isCashierOfThisRestaurant = isCashierOfThisRestaurant;
function isCustomerRestaurantTheSameAsWaiter(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idWaiterAuthenticated = req.auth._id;
        const idCustomerGroup = req.params.idc;
        const customerGroup = yield Group.GroupModel.findById(idCustomerGroup);
        const waiterAuthenticated = yield Waiter.WaiterModel.findById(idWaiterAuthenticated);
        if (waiterAuthenticated !== null) {
            if (customerGroup !== null) {
                if (waiterAuthenticated.idRestaurant.toString() ===
                    customerGroup.idRestaurant.toString()) {
                    return next();
                }
                else {
                    return next({
                        statusCode: 404,
                        error: true,
                        errormessage: customerGroup._id +
                            " is not customergroup of the waiter " +
                            waiterAuthenticated._id,
                    });
                }
            }
            else {
                next({
                    statusCode: 404,
                    error: true,
                    errormessage: "customerGroup not found",
                });
            }
        }
        else {
            next({ statusCode: 404, error: true, errormessage: "Waiter not found" });
        }
    });
}
exports.isCustomerRestaurantTheSameAsWaiter = isCustomerRestaurantTheSameAsWaiter;
function isTableRestaurantTheSameAsWaiter(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idWaiterAuthenticated = req.auth._id;
        const idTable = req.params.idt;
        const table = yield Table.TableModel.findById(idTable);
        const waiterAuthenticated = yield Waiter.WaiterModel.findById(idWaiterAuthenticated);
        if (waiterAuthenticated !== null) {
            if (table !== null) {
                if (waiterAuthenticated.idRestaurant.toString() ===
                    table.restaurantId.toString()) {
                    return next();
                }
                else {
                    return next({
                        statusCode: 404,
                        error: true,
                        errormessage: table._id +
                            " is not table of restaurant" +
                            waiterAuthenticated.idRestaurant,
                    });
                }
            }
            else {
                next({ statusCode: 404, error: true, errormessage: "table not found" });
            }
        }
        else {
            next({ statusCode: 404, error: true, errormessage: "Waiter not found" });
        }
    });
}
exports.isTableRestaurantTheSameAsWaiter = isTableRestaurantTheSameAsWaiter;
function isTableRestaurantTheSameAsCashier(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idCahsier = req.auth._id;
        const idTable = req.params.idt;
        const table = yield Table.TableModel.findById(idTable);
        const cashier = yield Cashier.CashierModel.findById(idCahsier);
        if (cashier !== null) {
            if (table !== null) {
                if (cashier.idRestaurant.toString() === table.restaurantId.toString()) {
                    return next();
                }
                else {
                    return next({
                        statusCode: 404,
                        error: true,
                        errormessage: table._id + " is not table of restaurant " + cashier.idRestaurant,
                    });
                }
            }
            else {
                next({ statusCode: 404, error: true, errormessage: "table not found" });
            }
        }
        else {
            next({ statusCode: 404, error: true, errormessage: "Cashier not found" });
        }
    });
}
exports.isTableRestaurantTheSameAsCashier = isTableRestaurantTheSameAsCashier;
function groupHasATable(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idWaiterAuthenticated = req.auth._id;
        const idCustomerGroup = req.params.idc;
        const customerGroup = yield Group.GroupModel.findById(idCustomerGroup);
        const waiterAuthenticated = yield Waiter.WaiterModel.findById(idWaiterAuthenticated);
        if (waiterAuthenticated !== null) {
            if (customerGroup !== null) {
                if (waiterAuthenticated.idRestaurant.toString() ===
                    customerGroup.idRestaurant.toString()) {
                    return next();
                }
                else {
                    return next({
                        statusCode: 404,
                        error: true,
                        errormessage: customerGroup._id +
                            " is not customergroup of the waiter " +
                            waiterAuthenticated._id,
                    });
                }
            }
            else {
                next({
                    statusCode: 404,
                    error: true,
                    errormessage: "customerGroup not found not found",
                });
            }
        }
        else {
            next({ statusCode: 404, error: true, errormessage: "Waiter not found" });
        }
    });
}
exports.groupHasATable = groupHasATable;
function groupHasARecipe(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idWaiterAuthenticated = req.auth._id;
        const idTable = req.params.idt;
        const table = yield Table.TableModel.findById(idTable);
        const group = yield Group.GroupModel.findById(table.group);
        if (table !== null) {
            if (group !== null) {
                if (group.hasRecipe()) {
                    return next();
                }
                else {
                    return next({
                        statusCode: 404,
                        error: true,
                        errormessage: group._id + " has not a recipe ",
                    });
                }
            }
            else {
                next({ statusCode: 404, error: true, errormessage: "group not found" });
            }
        }
        else {
            next({ statusCode: 404, error: true, errormessage: "table not found" });
        }
    });
}
exports.groupHasARecipe = groupHasARecipe;
function groupHasNotARecipeYet(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idWaiterAuthenticated = req.auth._id;
        const idTable = req.params.idt;
        const table = yield Table.TableModel.findById(idTable);
        const group = yield Group.GroupModel.findById(table.group);
        if (table !== null) {
            if (group !== null) {
                if (!group.hasRecipe()) {
                    return next();
                }
                else {
                    return next({
                        statusCode: 404,
                        error: true,
                        errormessage: group._id + " has a recipe ",
                    });
                }
            }
            else {
                next({ statusCode: 404, error: true, errormessage: "group not found" });
            }
        }
        else {
            next({ statusCode: 404, error: true, errormessage: "table not found" });
        }
    });
}
exports.groupHasNotARecipeYet = groupHasNotARecipeYet;
function groupHasARecipeYet(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idWaiterAuthenticated = req.auth._id;
        const idTable = req.params.idt;
        const table = yield Table.TableModel.findById(idTable);
        const group = yield Group.GroupModel.findById(table.group);
        if (table !== null) {
            if (group !== null) {
                if (group.hasRecipe()) {
                    return next();
                }
                else {
                    return next({
                        statusCode: 404,
                        error: true,
                        errormessage: group._id + " doesn't have a recipe ",
                    });
                }
            }
            else {
                next({ statusCode: 404, error: true, errormessage: "group not found" });
            }
        }
        else {
            next({ statusCode: 404, error: true, errormessage: "table not found" });
        }
    });
}
exports.groupHasARecipeYet = groupHasARecipeYet;
function areOrdersFinished(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idWaiterAuthenticated = req.auth._id;
        const idTable = req.params.idt;
        const table = yield Table.TableModel.findById(idTable);
        const group = yield Group.GroupModel.findById(table.group).populate("ordersList");
        const orders = group.ordersList;
        if (table !== null) {
            if (group !== null) {
                const orders = group.ordersList;
                const allServed = orders.every((orderItem) => orderItem.state === "served");
                if (allServed) {
                    return next();
                }
                else {
                    return next({
                        statusCode: 404,
                        error: true,
                        errormessage: group._id + " has orders not servered ",
                    });
                }
            }
            else {
                next({ statusCode: 404, error: true, errormessage: "group not found" });
            }
        }
        else {
            next({ statusCode: 404, error: true, errormessage: "table not found" });
        }
    });
}
exports.areOrdersFinished = areOrdersFinished;
function hasNotAlreadyARestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idOwner = req.auth._id;
        const owner = yield Owner.OwnerModel.findById(idOwner);
        if (owner) {
            if (!owner.hasAlreadyARestaurant()) {
                next();
            }
            else {
                return next({
                    statusCode: 404,
                    error: true,
                    errormessage: "Owner: " +
                        owner._id +
                        " has already a restaurant. restaurantId:" +
                        owner.restaurantOwn.toString(),
                });
            }
        }
        else {
            return next({
                statusCode: 404,
                error: true,
                errormessage: "Owner with id: " + req.auth._id + " doesn't exist",
            });
        }
    });
}
exports.hasNotAlreadyARestaurant = hasNotAlreadyARestaurant;
function isCookMemberOfThatRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const cookIdToRemove = req.params.idu;
        const restaurantIdInWhichRemoveCook = req.params.idr;
        const restaurant = yield Restaurant.RestaurantModel.findById(restaurantIdInWhichRemoveCook);
        if (restaurant.isCookPresent(cookIdToRemove)) {
            next();
        }
        else {
            next({
                statusCode: 404,
                error: true,
                errormessage: "cook " +
                    cookIdToRemove +
                    " is not member of " +
                    restaurantIdInWhichRemoveCook,
            });
        }
    });
}
exports.isCookMemberOfThatRestaurant = isCookMemberOfThatRestaurant;
function isWaiterMemberOfThatRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const waiterIdToRemove = req.params.idu;
        const restaurantIdInWhichRemoveWaiter = req.params.idr;
        const restaurant = yield Restaurant.RestaurantModel.findById(restaurantIdInWhichRemoveWaiter);
        if (restaurant.isWaiterPresent(waiterIdToRemove)) {
            next();
        }
        else {
            next({
                statusCode: 404,
                error: true,
                errormessage: "waiter " +
                    waiterIdToRemove +
                    " is not member of " +
                    restaurantIdInWhichRemoveWaiter,
            });
        }
    });
}
exports.isWaiterMemberOfThatRestaurant = isWaiterMemberOfThatRestaurant;
function isCashierMemberOfThatRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const cashierIdToRemove = req.params.idu;
        const restaurantIdInWhichRemoveCashier = req.params.idr;
        const restaurant = yield Restaurant.RestaurantModel.findById(restaurantIdInWhichRemoveCashier);
        if (restaurant.isCashierPresent(cashierIdToRemove)) {
            next();
        }
        else {
            next({
                statusCode: 404,
                error: true,
                errormessage: "cashier " +
                    cashierIdToRemove +
                    " is not member of " +
                    restaurantIdInWhichRemoveCashier,
            });
        }
    });
}
exports.isCashierMemberOfThatRestaurant = isCashierMemberOfThatRestaurant;
function isBartenderMemberOfThatRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const bartenderIdToRemove = req.params.idu;
        const restaurantIdInWhichRemoveBartender = req.params.idr;
        const restaurant = yield Restaurant.RestaurantModel.findById(restaurantIdInWhichRemoveBartender);
        if (restaurant.isBartenderPresent(bartenderIdToRemove)) {
            next();
        }
        else {
            next({
                statusCode: 404,
                error: true,
                errormessage: "bartender " +
                    bartenderIdToRemove +
                    " is not member of " +
                    restaurantIdInWhichRemoveBartender,
            });
        }
    });
}
exports.isBartenderMemberOfThatRestaurant = isBartenderMemberOfThatRestaurant;
function isDayOfThatRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idDayToRemove = req.params.idd;
        const restaurantIdInWhichRemoveDay = req.params.idr;
        const restaurant = yield Restaurant.RestaurantModel.findById(restaurantIdInWhichRemoveDay);
        if (restaurant.isDayPresent(idDayToRemove)) {
            next();
        }
        else {
            next({
                statusCode: 404,
                error: true,
                errormessage: "day " +
                    idDayToRemove +
                    " is not day of " +
                    restaurantIdInWhichRemoveDay,
            });
        }
    });
}
exports.isDayOfThatRestaurant = isDayOfThatRestaurant;
function isValidRestaurantInput(req, res, next) {
    const restaurantNameBody = req.body.restaurantName;
    if (Restaurant.checkNameCorrectness(restaurantNameBody)) {
        next();
    }
    else {
        return next({
            statusCode: 404,
            error: true,
            errormessage: "Restaurant name not valid. Name's length must be less than 16. restaurant name : " +
                restaurantNameBody,
        });
    }
}
exports.isValidRestaurantInput = isValidRestaurantInput;
function isUserAlreadyExist(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const emailBody = req.body.email;
        const userFind = yield User.UserModel.findOne({ email: emailBody });
        if (!userFind) {
            next();
        }
        else {
            return next({
                statusCode: 404,
                error: true,
                errormessage: "User : " + emailBody + " already exist.",
            });
        }
    });
}
exports.isUserAlreadyExist = isUserAlreadyExist;
function isItemAlreadyExist(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const itemName = req.body.itemName;
        const itemFind = yield Item.ItemModel.findOne({ itemName: itemName });
        if (!itemFind) {
            next();
        }
        else {
            return next({
                statusCode: 404,
                error: true,
                errormessage: "Item : " + itemName + " already exist.",
            });
        }
    });
}
exports.isItemAlreadyExist = isItemAlreadyExist;
function isTableAlreadyExist(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const tableNumber = req.body.tableNumber;
        const table = yield Table.TableModel.findOne({ tableNumber: tableNumber });
        if (!table) {
            next();
        }
        else {
            return next({
                statusCode: 404,
                error: true,
                errormessage: "Table : " + tableNumber + " already exist.",
            });
        }
    });
}
exports.isTableAlreadyExist = isTableAlreadyExist;
function isTableOfThatRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const tableIdToRemove = req.params.idt;
        const restaurantIdInWhichRemoveTable = req.params.idr;
        const restaurant = yield Restaurant.RestaurantModel.findById(restaurantIdInWhichRemoveTable);
        if (restaurant.isTablePresent(tableIdToRemove)) {
            next();
        }
        else {
            next({
                statusCode: 404,
                error: true,
                errormessage: "table " +
                    tableIdToRemove +
                    " is not table of " +
                    restaurantIdInWhichRemoveTable,
            });
        }
    });
}
exports.isTableOfThatRestaurant = isTableOfThatRestaurant;
function isOrderOfThatGroup(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const tableId = req.params.idt;
        const orderId = req.params.ido;
        const table = yield Table.TableModel.findById(tableId);
        const group = yield Group.GroupModel.findById(table.group);
        if (group.isOrderPresent(orderId)) {
            next();
        }
        else {
            next({
                statusCode: 404,
                error: true,
                errormessage: "order " + orderId + " is not order of group" + group._id,
            });
        }
    });
}
exports.isOrderOfThatGroup = isOrderOfThatGroup;
function isTableEmpty(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const tableIdToAdd = req.params.idt;
        const numberOfPerson = req.body.numberOfPerson;
        const table = yield Table.TableModel.findById(tableIdToAdd);
        numberOfPerson <= table.maxSeats;
        if (table.isEmpty()) {
            if (numberOfPerson <= table.maxSeats) {
                next();
            }
            else {
                next({
                    statusCode: 404,
                    error: true,
                    errormessage: numberOfPerson +
                        ">" +
                        table.maxSeats +
                        ", table capacity is not sufficient",
                });
            }
        }
        else {
            next({
                statusCode: 404,
                error: true,
                errormessage: "table " + tableIdToAdd + " is not empty",
            });
        }
    });
}
exports.isTableEmpty = isTableEmpty;
function tableHasAGroup(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idTable = req.params.idt;
        const table = yield Table.TableModel.findById(idTable);
        if (table.group) {
            next();
        }
        else {
            next({
                statusCode: 404,
                error: true,
                errormessage: "table " + idTable + " doesn't have a group sitted",
            });
        }
    });
}
exports.tableHasAGroup = tableHasAGroup;
function isItemOfThatRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const itemIdToRemove = req.params.idi;
        const restaurantIdInWhichRemoveTable = req.params.idr;
        const restaurant = yield Restaurant.RestaurantModel.findById(restaurantIdInWhichRemoveTable);
        if (restaurant.isItemPresent(itemIdToRemove)) {
            next();
        }
        else {
            next({
                statusCode: 404,
                error: true,
                errormessage: "item " +
                    itemIdToRemove +
                    " is not item of " +
                    restaurantIdInWhichRemoveTable,
            });
        }
    });
}
exports.isItemOfThatRestaurant = isItemOfThatRestaurant;
exports.basicAuthentication = passport.authenticate("basic", {
    session: false,
});
