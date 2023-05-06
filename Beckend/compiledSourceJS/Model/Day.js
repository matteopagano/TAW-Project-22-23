"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DayModel = void 0;
const mongoose_1 = require("mongoose");
const daySchema = new mongoose_1.Schema({
    date: {
        type: mongoose_1.Schema.Types.Date,
        required: true
    },
    orderList: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                required: true,
                ref: 'Order'
            },
        ],
        required: true,
    },
    recipeList: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                required: true,
                ref: 'Recipe'
            },
        ],
        required: true,
    },
    idRestaurant: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Restaurant'
    },
});
exports.DayModel = (0, mongoose_1.model)('Day', daySchema);
