"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerModel = exports.BartenderModel = exports.CashierModel = exports.WaiterModel = exports.CookModel = exports.UserModel = exports.isOwner = exports.RoleType = void 0;
const mongoose_1 = require("mongoose");
var RoleType;
(function (RoleType) {
    RoleType["CASHIER"] = "cashier";
    RoleType["OWNER"] = "owner";
    RoleType["WAITER"] = "waiter";
    RoleType["COOK"] = "cook";
    RoleType["BARTENDER"] = "bartender";
})(RoleType = exports.RoleType || (exports.RoleType = {}));
const options = { discriminatorKey: 'role' };
const cookSchema = new mongoose_1.Schema({
    dishesCooked: {
        type: [
            {
                qt: { type: mongoose_1.Schema.Types.Number, required: true },
                idItem: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Dish', required: true },
                dateFinished: { type: mongoose_1.Schema.Types.Date, required: true }
            }
        ]
    },
    idRestaurant: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
}, options);
const bartenderSchema = new mongoose_1.Schema({
    drinkPrepared: {
        type: [
            {
                qt: { type: mongoose_1.Schema.Types.Number, required: true },
                idItem: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Drink', required: true },
                dateFinished: { type: mongoose_1.Schema.Types.Date, required: true }
            }
        ]
    },
    idRestaurant: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
}, options);
const waiterSchema = new mongoose_1.Schema({
    ordersTaken: {
        type: [
            {
                idOrder: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Order', required: true }
            }
        ],
        required: true
    },
    tablesObservered: {
        type: [
            {
                idTable: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Table', required: true }
            }
        ],
        required: true
    },
    idRestaurant: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
}, options);
//ricette = recipes
//ricetta = recipe
const cashierSchema = new mongoose_1.Schema({
    receiptsPrinted: {
        type: [
            { type: mongoose_1.Schema.Types.ObjectId, ref: 'Recipe', required: true }
        ],
        required: true
    },
    idRestaurant: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
}, options);
const ownerSchema = new mongoose_1.Schema({
    restaurantOwn: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Restaurant', required: false },
}, options);
const userSchema = new mongoose_1.Schema({
    username: { type: mongoose_1.Schema.Types.String, required: true },
    email: { type: mongoose_1.Schema.Types.String, required: true },
    digest: { type: mongoose_1.Schema.Types.String, required: true },
    salt: { type: mongoose_1.Schema.Types.String, required: true },
    role: { type: mongoose_1.Schema.Types.String, enum: RoleType, required: true },
}, options);
function isOwner(owner) {
    const partialUser = owner; // creare un oggetto Partial<User> dall'argomento passato
    // verificare se tutte le proprietà obbligatorie di User sono presenti in partialUser
    return partialUser &&
        typeof partialUser.username === 'string' &&
        typeof partialUser.email === 'string' &&
        typeof partialUser.digest === 'string' &&
        typeof partialUser.role === 'string' &&
        typeof partialUser.salt === 'string' &&
        partialUser.restaurantOwn instanceof mongoose_1.Schema.Types.ObjectId;
}
exports.isOwner = isOwner;
exports.UserModel = (0, mongoose_1.model)('User', userSchema);
exports.CookModel = exports.UserModel.discriminator('Cook', cookSchema, RoleType.COOK);
exports.WaiterModel = exports.UserModel.discriminator('Waiter', waiterSchema, RoleType.WAITER);
exports.CashierModel = exports.UserModel.discriminator('Cashier', cashierSchema, RoleType.CASHIER);
exports.BartenderModel = exports.UserModel.discriminator('Bartender', bartenderSchema, RoleType.BARTENDER);
exports.OwnerModel = exports.UserModel.discriminator('Owner', ownerSchema, RoleType.OWNER);
