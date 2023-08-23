"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaiterModel = exports.createWaiter = exports.removeOrderAwaited = exports.addOrderServed = exports.addOrderAwaited = void 0;
const User_1 = require("./User");
const mongoose_1 = require("mongoose");
const waiterSchema = new mongoose_1.Schema({
    ordersAwaiting: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Order', required: true }],
    ordersServed: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Order', required: true }],
}, User_1.options);
function addOrderAwaited(order, waiter) {
    waiter.ordersAwaiting.push(order._id);
}
exports.addOrderAwaited = addOrderAwaited;
function addOrderServed(order, waiter) {
    waiter.ordersServed.push(order._id);
}
exports.addOrderServed = addOrderServed;
function removeOrderAwaited(order, waiter) {
    const index = waiter.ordersAwaiting.indexOf(order._id);
    if (index !== -1) {
        waiter.ordersAwaiting.splice(index, 1);
    }
}
exports.removeOrderAwaited = removeOrderAwaited;
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
