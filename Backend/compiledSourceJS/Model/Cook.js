"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookModel = exports.createCook = void 0;
const User_1 = require("./User");
const mongoose_1 = require("mongoose");
const cookSchema = new mongoose_1.Schema({}, User_1.options);
function createCook(username, email, password, idRestaurant) {
    const newCook = new exports.CookModel({
        username: username,
        email: email,
        role: User_1.RoleType.COOK,
        dishesCooked: [],
        idRestaurant: idRestaurant
    });
    newCook.setPassword(password);
    return newCook;
}
exports.createCook = createCook;
exports.CookModel = User_1.UserModel.discriminator('Cook', cookSchema, User_1.RoleType.COOK);
