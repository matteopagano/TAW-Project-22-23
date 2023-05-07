"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaiterModel = void 0;
const User_1 = require("./User");
const mongoose_1 = require("mongoose");
const waiterSchema = new mongoose_1.Schema({
    ordersTaken: {
        type: [
            {
                idOrder: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Order', required: true }
            }
        ],
        required: true
    },
    tablesObservered: {
        type: [
            {
                idTable: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Table', required: true }
            }
        ],
        required: true
    },
    idRestaurant: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
}, User_1.options);
exports.WaiterModel = User_1.UserModel.discriminator('Waiter', waiterSchema, User_1.RoleType.WAITER);
