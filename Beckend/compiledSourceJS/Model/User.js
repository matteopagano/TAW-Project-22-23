"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BartenderModel = exports.CashierModel = exports.WaiterModel = exports.CookModel = exports.UserModel = exports.Role = void 0;
const mongoose_1 = require("mongoose");
//ricette = recipes
//ricetta = recipe
var Role;
(function (Role) {
    Role["COOK"] = "cook";
    Role["WAITER"] = "waiter";
    Role["CASHIER"] = "cashier";
    Role["BARTENDER"] = "bartender";
})(Role = exports.Role || (exports.Role = {}));
const options = { discriminatorKey: 'role' };
const cookSchema = new mongoose_1.Schema({
    //dishesCooked : [{qt : int, idItem: ObjectId, dateC : Date}]
    dishesCooked: [{ qt: Number, idItem: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Dishe' }, dateFinished: Date }]
}, options);
const bartenderSchema = new mongoose_1.Schema({
    //drinkPrepared : [{qt : int, idItem: ObjectId}]
    drinkPrepared: [{ qt: Number, idItem: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Drink' }, dateFinished: Date }]
}, options);
const waiterSchema = new mongoose_1.Schema({
    //ordersTaken :[{idOrder : ObjectId}] 
    //tablesObservered : [{idTable : ObectId}]
    ordersTaken: [{ idOrder: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Order' } }],
    tablesObservered: [{ idTable: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Table' } }]
}, options);
//ricette = recipes
//ricetta = recipe
const cashierSchema = new mongoose_1.Schema({
    //receiptsPrinted : [{idReceipe: ObjectId}]
    receiptsPrinted: [{ idReceipe: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Recipe' } }]
}, options);
const userSchema = new mongoose_1.Schema({
    digest: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: Role, required: true },
    idRestaurant: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Restaurant', required: true }
}, options);
exports.UserModel = (0, mongoose_1.model)('User', userSchema);
exports.CookModel = exports.UserModel.discriminator('Cook', cookSchema);
exports.WaiterModel = exports.UserModel.discriminator('Waiter', waiterSchema);
exports.CashierModel = exports.UserModel.discriminator('Cashier', cashierSchema);
exports.BartenderModel = exports.UserModel.discriminator('Bartender', bartenderSchema);
