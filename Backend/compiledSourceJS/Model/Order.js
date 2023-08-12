"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = exports.createOrder = void 0;
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
    idGroup: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Group"
    },
    idWaiter: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Waiter",
        required: true
    },
    items: {
        type: [{
                timeFinished: { type: mongoose_1.Schema.Types.Date, required: false },
                idItem: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Item', required: true },
                state: { type: mongoose_1.Schema.Types.String, enum: StateItem, required: true },
                completedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: false },
                count: { type: mongoose_1.Schema.Types.Number, required: true }
            }],
        required: true
    },
    state: {
        type: mongoose_1.Schema.Types.String,
        enum: StateOrder,
        required: true
    },
    timeCompleted: {
        type: mongoose_1.Schema.Types.Date,
        required: false
    },
    timeStarted: {
        type: mongoose_1.Schema.Types.Date,
        required: true
    },
});
function createOrder(idGroup, idWaiter, items) {
    const itemsList = [];
    items.forEach(item => {
        const itemId = item.itemId;
        const count = item.count;
        const newItem = {
            timeFinished: null,
            idItem: itemId,
            state: StateItem.NOTCOMPLETED,
            completedBy: null,
            count: count,
        };
        // Fai qualcosa con itemId e count
        itemsList.push(newItem);
    });
    console.log("printo nuova item list");
    console.log(itemsList);
    const newOrder = new exports.OrderModel({
        idGroup: idGroup,
        idWaiter: idWaiter,
        items: itemsList,
        state: StateOrder.NOTSTARTED,
        timeCompleted: null,
        timeStarted: new Date(),
    });
    console.log("Printo nuovo ordine");
    console.log(newOrder);
    return newOrder;
}
exports.createOrder = createOrder;
/*export function calculatePrice(order : Order.Order) : number{
  order.items.forEach(item => {
    const itemId = item.itemId;
    const count = item.;
    
    
  });
}
*/
exports.OrderModel = (0, mongoose_1.model)('Order', orderSchema);
