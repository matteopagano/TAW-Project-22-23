"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    idTable: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true
    },
    itemList: {
        type: [new mongoose_1.default.Schema({
                qt: Number,
                idItem: mongoose_1.default.Schema.Types.ObjectId,
                state: String
            })],
        required: true
    },
    state: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});
exports.OrderModel = mongoose_1.default.model('Order', orderSchema);
