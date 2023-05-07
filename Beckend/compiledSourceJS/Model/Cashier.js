"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashierModel = void 0;
const User_1 = require("./User");
const mongoose_1 = require("mongoose");
const cashierSchema = new mongoose_1.Schema({
    receiptsPrinted: {
        type: [
            { type: mongoose_1.Schema.Types.ObjectId, ref: 'Recipe', required: true }
        ],
        required: true
    },
    idRestaurant: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
}, User_1.options);
exports.CashierModel = User_1.UserModel.discriminator('Cashier', cashierSchema, User_1.RoleType.CASHIER);
