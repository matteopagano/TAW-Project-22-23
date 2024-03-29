"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupModel = exports.addRecipeToGroup = exports.addOrder = exports.createGroup = void 0;
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
                ref: "Order",
            },
        ],
        required: false,
    },
    idRestaurant: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        ref: "Restaurant",
    },
    idRecipe: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        ref: "Recipe",
    },
    idTable: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        ref: "Table",
    },
});
groupSchema.methods.hasRecipe = function () {
    return !(this.idRecipe === null);
};
groupSchema.methods.isOrderPresent = function (order) {
    try {
        return this.ordersList.includes(new mongoose_1.Types.ObjectId(order));
    }
    catch (_a) {
        return false;
    }
};
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
function addRecipeToGroup(recipe, group) {
    group.idRecipe = recipe._id;
}
exports.addRecipeToGroup = addRecipeToGroup;
exports.GroupModel = (0, mongoose_1.model)("Group", groupSchema);
