"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeModel = void 0;
const mongoose_1 = require("mongoose");
const recipeSchema = new mongoose_1.Schema({
    idTable: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Table'
    },
    idCashier: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Cashier'
    },
    itemsPurchased: {
        type: [{
                qt: {
                    type: mongoose_1.Schema.Types.Number,
                    required: true,
                },
                idItem: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Item'
                }
            }],
        required: true
    },
    idDay: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Day'
    }
});
exports.RecipeModel = (0, mongoose_1.model)('Recipe', recipeSchema);
