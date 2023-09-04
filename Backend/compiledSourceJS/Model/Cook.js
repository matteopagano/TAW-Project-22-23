"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookModel = exports.createItemPrepared = exports.createCook = void 0;
const User_1 = require("./User");
const mongoose_1 = require("mongoose");
const cookSchema = new mongoose_1.Schema({
    itemsPrepared: {
        type: [
            {
                idItem: { type: mongoose_1.Schema.Types.ObjectId, ref: "Item", required: true },
                count: { type: mongoose_1.Schema.Types.Number, required: true },
            },
        ],
        required: true,
    },
}, User_1.options);
function createCook(username, email, password, idRestaurant) {
    const newCook = new exports.CookModel({
        username: username,
        email: email,
        role: User_1.RoleType.COOK,
        dishesCooked: [],
        idRestaurant: idRestaurant,
        itemsPrepared: [],
    });
    newCook.setPassword(password);
    return newCook;
}
exports.createCook = createCook;
function createItemPrepared(count, idItem) {
    const newItemPrepared = {
        idItem: idItem,
        count: count,
    };
    return newItemPrepared;
}
exports.createItemPrepared = createItemPrepared;
exports.CookModel = User_1.UserModel.discriminator("Cook", cookSchema, User_1.RoleType.COOK);
