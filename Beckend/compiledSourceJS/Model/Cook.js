"use strict";
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
exports.CookModel = exports.createCookAndSave = void 0;
const User_1 = require("./User");
const mongoose_1 = require("mongoose");
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
}, User_1.options);
function createCookAndSave(username, email, password, idRestaurant) {
    return __awaiter(this, void 0, void 0, function* () {
        const newCook = new exports.CookModel({
            username: username,
            email: email,
            role: User_1.RoleType.COOK,
            dishesCooked: [],
            idRestaurant: idRestaurant
        });
        newCook.setPassword(password);
        return yield newCook.save();
    });
}
exports.createCookAndSave = createCookAndSave;
exports.CookModel = User_1.UserModel.discriminator('Cook', cookSchema, User_1.RoleType.COOK);
