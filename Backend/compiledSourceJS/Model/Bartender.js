"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BartenderModel = exports.createBartender = void 0;
const User_1 = require("./User");
const mongoose_1 = require("mongoose");
const bartenderSchema = new mongoose_1.Schema({}, User_1.options);
function createBartender(username, email, password, idRestaurant) {
    const newBartender = new exports.BartenderModel({
        username: username,
        email: email,
        role: User_1.RoleType.BARTENDER,
        drinkPrepared: [],
        idRestaurant: idRestaurant
    });
    newBartender.setPassword(password);
    return newBartender;
}
exports.createBartender = createBartender;
exports.BartenderModel = User_1.UserModel.discriminator('Bartender', bartenderSchema, User_1.RoleType.BARTENDER);
