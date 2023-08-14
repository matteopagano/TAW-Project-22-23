"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashierModel = exports.addRecipe = exports.createCashier = void 0;
const User_1 = require("./User");
const mongoose_1 = require("mongoose");
const cashierSchema = new mongoose_1.Schema({
    recipesPrinted: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Restaurant', required: true }],
}, User_1.options);
function createCashier(username, email, password, idRestaurant) {
    const newCashier = new exports.CashierModel({
        username: username,
        email: email,
        role: User_1.RoleType.CASHIER,
        receiptsPrinted: [],
        idRestaurant: idRestaurant
    });
    newCashier.setPassword(password);
    return newCashier;
}
exports.createCashier = createCashier;
function addRecipe(recipe, cashier) {
    cashier.recipesPrinted.push(recipe._id);
}
exports.addRecipe = addRecipe;
cashierSchema.methods.isCashierOf = function (restaurantId) {
    return this.idRestaurant.toString() === restaurantId;
};
exports.CashierModel = User_1.UserModel.discriminator('Cashier', cashierSchema, User_1.RoleType.CASHIER);
