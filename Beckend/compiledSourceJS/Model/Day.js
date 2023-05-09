"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DayModel = void 0;
const mongoose_1 = require("mongoose");
const date_fns_1 = require("date-fns");
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
daySchema.methods.isValidDate = function () {
    // Parse della data dalla stringa di input
    // Verifica se la data è valida
    if ((0, date_fns_1.isValid)(this.date)) {
        return true;
    }
    else {
        return false;
    }
};
exports.DayModel = (0, mongoose_1.model)('Day', daySchema);
