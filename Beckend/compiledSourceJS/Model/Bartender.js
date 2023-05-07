"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BartenderModel = void 0;
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
exports.BartenderModel = User_1.UserModel.discriminator('Bartender', bartenderSchema, User_1.RoleType.BARTENDER);
