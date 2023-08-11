"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupModel = exports.addOrder = exports.createGroup = void 0;
const mongoose_1 = require("mongoose");
const groupSchema = new mongoose_1.Schema({
    numberOfPerson: {
        type: mongoose_1.Schema.Types.Number,
        required: true,
    },
    dateStart: {
        type: mongoose_1.Schema.Types.Date,
        required: true,
    },
    dateFinish: {
        type: mongoose_1.Schema.Types.Date,
        required: false,
    },
    ordersList: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                required: false,
                ref: 'Order'
            }
        ],
        required: false
    },
    idRestaurant: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        ref: 'Restaurant'
    },
    idRecipe: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        ref: 'Recipe'
    },
    idTable: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Table'
    },
});
function createGroup(numberOfPerson, idTable, idRestaurant) {
    const newGroup = new exports.GroupModel({
        numberOfPerson: numberOfPerson,
        dateStart: new Date(),
        dateFinish: null,
        ordersList: [],
        idRestaurant: idRestaurant,
        idRecipe: null,
        idTable: idTable,
    });
    return newGroup;
}
exports.createGroup = createGroup;
function addOrder(order, group) {
    group.ordersList.push(order._id);
}
exports.addOrder = addOrder;
exports.GroupModel = (0, mongoose_1.model)('Group', groupSchema);
