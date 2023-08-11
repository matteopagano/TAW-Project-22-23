"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeModel = void 0;
const mongoose_1 = require("mongoose");
const recipeSchema = new mongoose_1.Schema({
    costAmount: {
        type: mongoose_1.Schema.Types.Number,
        required: true,
    },
    dateOfPrinting: {
        type: mongoose_1.Schema.Types.Date,
        required: true,
    },
    idGroup: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Group'
    },
    idCashier: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Cashier'
    },
});
exports.RecipeModel = (0, mongoose_1.model)('Recipe', recipeSchema);
