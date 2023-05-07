"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookModel = void 0;
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
exports.CookModel = User_1.UserModel.discriminator('Cook', cookSchema, User_1.RoleType.COOK);
