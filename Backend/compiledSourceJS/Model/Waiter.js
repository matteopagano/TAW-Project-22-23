"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaiterModel = exports.createWaiter = void 0;
const User_1 = require("./User");
const mongoose_1 = require("mongoose");
const waiterSchema = new mongoose_1.Schema({
    ordersAwaiting: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Order', required: true }],
    ordersServed: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Order', required: true }],
}, User_1.options);
function createWaiter(username, email, password, idRestaurant) {
    const newWaiter = new exports.WaiterModel({
        username: username,
        email: email,
        role: User_1.RoleType.WAITER,
        ordersTaken: [],
        tablesObservered: [],
        idRestaurant: idRestaurant
    });
    newWaiter.setPassword(password);
    return newWaiter;
}
exports.createWaiter = createWaiter;
exports.WaiterModel = User_1.UserModel.discriminator('Waiter', waiterSchema, User_1.RoleType.WAITER);
