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
exports.BartenderModel = exports.createBartenderAndSave = void 0;
const User_1 = require("./User");
const mongoose_1 = require("mongoose");
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
}, User_1.options);
function createBartenderAndSave(username, email, password, idRestaurant) {
    return __awaiter(this, void 0, void 0, function* () {
        const newBartender = new exports.BartenderModel({
            username: username,
            email: email,
            role: User_1.RoleType.BARTENDER,
            drinkPrepared: [],
            idRestaurant: idRestaurant
        });
        newBartender.setPassword(password);
        return yield newBartender.save();
    });
}
exports.createBartenderAndSave = createBartenderAndSave;
exports.BartenderModel = User_1.UserModel.discriminator('Bartender', bartenderSchema, User_1.RoleType.BARTENDER);
