"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaysModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// days.ts
const daysSchema = new mongoose_1.default.Schema({
    date: {
        type: mongoose_1.default.SchemaTypes.Date,
        required: true,
    },
    orderList: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Order', // Replace 'Order' with the actual name of your Order model
        },
    ],
    recipeList: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Recipe', // Replace 'Recipe' with the actual name of your Recipe model
        },
    ],
    idRestaurant: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
    },
});
exports.DaysModel = mongoose_1.default.model('Days', daysSchema);
