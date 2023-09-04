"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemModel = exports.createItem = exports.ItemType = void 0;
const mongoose_1 = require("mongoose");
var ItemType;
(function (ItemType) {
    ItemType["DISH"] = "dish";
    ItemType["DRINK"] = "drink";
})(ItemType || (exports.ItemType = ItemType = {}));
const itemSchema = new mongoose_1.Schema({
    itemName: {
        type: mongoose_1.Schema.Types.String,
        required: true,
        unique: true,
    },
    itemType: {
        type: mongoose_1.Schema.Types.String,
        enum: ItemType,
        required: true,
    },
    price: {
        type: mongoose_1.Schema.Types.Number,
        required: true,
    },
    preparationTime: {
        type: mongoose_1.Schema.Types.Number,
        required: true,
    },
    idRestaurant: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Restaurant",
    },
    countServered: {
        type: mongoose_1.Schema.Types.Number,
        required: true,
    },
});
function createItem(itemName, itemType, price, preparationTime, idRestaurant) {
    const newTable = new exports.ItemModel({
        itemName: itemName,
        itemType: itemType,
        price: price,
        preparationTime: preparationTime,
        idRestaurant: idRestaurant,
        countServered: 0,
    });
    return newTable;
}
exports.createItem = createItem;
exports.ItemModel = (0, mongoose_1.model)("Item", itemSchema);
