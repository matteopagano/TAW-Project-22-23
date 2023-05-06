"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const mongoose_1 = require("mongoose");
var StateOrder;
(function (StateOrder) {
    StateOrder["READY"] = "ready";
    StateOrder["SERVED"] = "served";
    StateOrder["INPROGRESS"] = "inProgress";
    StateOrder["NOTSTARTED"] = "notStarted";
})(StateOrder || (StateOrder = {}));
var StateItem;
(function (StateItem) {
    StateItem["COMPLETED"] = "completed";
    StateItem["NOTCOMPLETED"] = "notcompleted";
})(StateItem || (StateItem = {}));
const orderSchema = new mongoose_1.Schema({
    idTable: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    itemList: {
        type: [{
                qt: { type: Number, required: true },
                idItem: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Item', required: true },
                state: { type: mongoose_1.Schema.Types.String, enum: StateItem, required: true } // From the official documentation
            }],
        required: true
    },
    state: {
        type: mongoose_1.Schema.Types.String,
        enum: StateOrder,
        required: true
    },
    date: {
        type: mongoose_1.Schema.Types.Date,
        required: true
    }
});
exports.OrderModel = (0, mongoose_1.model)('Order', orderSchema);
