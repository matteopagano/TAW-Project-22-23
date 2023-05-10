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
exports.WaiterModel = exports.createWaiterAndSave = void 0;
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
function createWaiterAndSave(username, email, password, idRestaurant) {
    return __awaiter(this, void 0, void 0, function* () {
        const newWaiter = new exports.WaiterModel({
            username: username,
            email: email,
            role: User_1.RoleType.WAITER,
            ordersTaken: [],
            tablesObservered: [],
            idRestaurant: idRestaurant
        });
        newWaiter.setPassword(password);
        return yield newWaiter.save();
    });
}
exports.createWaiterAndSave = createWaiterAndSave;
exports.WaiterModel = User_1.UserModel.discriminator('Waiter', waiterSchema, User_1.RoleType.WAITER);
