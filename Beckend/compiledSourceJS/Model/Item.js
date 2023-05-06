"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrinkModel = exports.DishModel = exports.ItemModel = exports.ItemType = void 0;
const mongoose_1 = require("mongoose");
const options = { discriminatorKey: 'type' };
var ItemType;
(function (ItemType) {
    ItemType["DISH"] = "dish";
    ItemType["DRINK"] = "drink";
})(ItemType = exports.ItemType || (exports.ItemType = {}));
const itemSchema = new mongoose_1.Schema({
    name: {
        type: mongoose_1.Schema.Types.String,
        required: true,
        unique: true
    },
    price: {
        type: mongoose_1.Schema.Types.Number,
        required: true
    },
    itemType: {
        type: mongoose_1.Schema.Types.String,
        enum: ItemType,
        required: true
    },
    allergenes: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                required: true,
                ref: 'Allergene'
            }
        ],
        required: true
    },
    idRestaurant: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Restaurant'
    },
    ordersList: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                required: true,
                ref: 'Order'
            }
        ],
        required: true
    },
}, options);
const DishSchema = new mongoose_1.Schema({
    cooksList: {
        type: [
            { type: mongoose_1.Schema.Types.ObjectId, ref: 'Cook', required: true }
        ],
        required: true
    }
}, options);
const Drinkchema = new mongoose_1.Schema({
    bartendersList: {
        type: [
            { type: mongoose_1.Schema.Types.ObjectId, ref: 'Bartender' }
        ],
        required: true
    }
}, options);
exports.ItemModel = (0, mongoose_1.model)('Item', itemSchema);
exports.DishModel = exports.ItemModel.discriminator('Dish', DishSchema);
exports.DrinkModel = exports.ItemModel.discriminator('Drink', Drinkchema);
