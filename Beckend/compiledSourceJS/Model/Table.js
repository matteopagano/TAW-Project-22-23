"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableModel = void 0;
const mongoose_1 = require("mongoose");
const tableSchema = new mongoose_1.Schema({
    tableNumber: {
        type: String,
        required: true,
    },
    isFree: {
        type: Boolean,
        required: true,
    },
    maxSeats: {
        type: Number,
        required: true,
    },
    orderList: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                required: false,
                ref: 'Order'
            }
        ], required: true
    },
    waitressList: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                required: false,
                ref: 'Waiter'
            }
        ],
        required: true
    },
    restaurantId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Restaurant'
    },
    recipesId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Recipe'
    }
});
exports.TableModel = (0, mongoose_1.model)('Table', tableSchema);
