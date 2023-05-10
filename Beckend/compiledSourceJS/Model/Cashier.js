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
exports.CashierModel = exports.createCashierAndSave = void 0;
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
function createCashierAndSave(username, email, password, idRestaurant) {
    return __awaiter(this, void 0, void 0, function* () {
        const newCashier = new exports.CashierModel({
            username: username,
            email: email,
            role: User_1.RoleType.CASHIER,
            receiptsPrinted: [],
            idRestaurant: idRestaurant
        });
        newCashier.setPassword(password);
        return yield newCashier.save();
    });
}
exports.createCashierAndSave = createCashierAndSave;
exports.CashierModel = User_1.UserModel.discriminator('Cashier', cashierSchema, User_1.RoleType.CASHIER);
