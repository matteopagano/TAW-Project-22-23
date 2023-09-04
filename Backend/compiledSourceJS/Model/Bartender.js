"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BartenderModel = exports.createItemPrepared = exports.createBartender = void 0;
const User_1 = require("./User");
const mongoose_1 = require("mongoose");
const bartenderSchema = new mongoose_1.Schema({
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
function createBartender(username, email, password, idRestaurant) {
    const newBartender = new exports.BartenderModel({
        username: username,
        email: email,
        role: User_1.RoleType.BARTENDER,
        drinkPrepared: [],
        idRestaurant: idRestaurant,
        itemsPrepared: [],
    });
    newBartender.setPassword(password);
    return newBartender;
}
exports.createBartender = createBartender;
function createItemPrepared(count, idItem) {
    const newItemPrepared = {
        idItem: idItem,
        count: count,
    };
    return newItemPrepared;
}
exports.createItemPrepared = createItemPrepared;
exports.BartenderModel = User_1.UserModel.discriminator("Bartender", bartenderSchema, User_1.RoleType.BARTENDER);
