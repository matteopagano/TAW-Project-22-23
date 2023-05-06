"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var State;
(function (State) {
    State["READY"] = "ready";
    State["SERVED"] = "served";
    State["INPROGRESS"] = "inProgress";
    State["NOTSTARTED"] = "notStarted";
})(State || (State = {}));
const orderSchema = new mongoose_1.default.Schema({
    idTable: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true
    },
    itemList: //From the off documetation -> [] array
    [{
            qt: { type: Number, required: true },
            idItem: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Item', required: true },
            state: { type: String, enum: State, required: true } // From the official documentation
        }],
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
