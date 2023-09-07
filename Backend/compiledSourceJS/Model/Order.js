"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = exports.createOrder = exports.StateItem = exports.StateOrder = void 0;
const mongoose_1 = require("mongoose");
const Item_1 = require("./Item");
var StateOrder;
(function (StateOrder) {
    StateOrder["READY"] = "ready";
    StateOrder["SERVED"] = "served";
    StateOrder["INPROGRESS"] = "inProgress";
    StateOrder["NOTSTARTED"] = "notStarted";
})(StateOrder = exports.StateOrder || (exports.StateOrder = {}));
var StateItem;
(function (StateItem) {
    StateItem["COMPLETED"] = "completed";
    StateItem["NOTCOMPLETED"] = "notcompleted";
})(StateItem = exports.StateItem || (exports.StateItem = {}));
const orderSchema = new mongoose_1.Schema({
    idGroup: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Group",
    },
    idWaiter: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Waiter",
        required: true,
    },
    items: {
        type: [
            {
                timeFinished: { type: mongoose_1.Schema.Types.Date, required: false },
                idItem: { type: mongoose_1.Schema.Types.ObjectId, ref: "Item", required: true },
                state: { type: mongoose_1.Schema.Types.String, enum: StateItem, required: true },
                completedBy: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: "User",
                    required: false,
                },
                count: { type: mongoose_1.Schema.Types.Number, required: true },
            },
        ],
        required: true,
    },
    state: {
        type: mongoose_1.Schema.Types.String,
        enum: StateOrder,
        required: true,
    },
    timeCompleted: {
        type: mongoose_1.Schema.Types.Date,
        required: false,
    },
    timeStarted: {
        type: mongoose_1.Schema.Types.Date,
        required: true,
    },
    type: {
        type: mongoose_1.Schema.Types.String,
        enum: Item_1.ItemType,
        required: true,
    },
});
function createOrder(idGroup, idWaiter, items, type) {
    const itemsList = [];
    items.forEach((item) => {
        const itemId = item.itemId;
        const count = item.count;
        const newItem = {
            timeFinished: null,
            idItem: itemId,
            state: StateItem.NOTCOMPLETED,
            completedBy: null,
            count: count,
        };
        itemsList.push(newItem);
    });
    const newOrder = new exports.OrderModel({
        idGroup: idGroup,
        idWaiter: idWaiter,
        items: itemsList,
        state: StateOrder.NOTSTARTED,
        timeCompleted: null,
        timeStarted: new Date(),
        type: type,
    });
    return newOrder;
}
exports.createOrder = createOrder;
exports.OrderModel = (0, mongoose_1.model)("Order", orderSchema);
