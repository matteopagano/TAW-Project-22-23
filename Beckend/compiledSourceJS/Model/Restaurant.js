"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantModel = void 0;
const mongoose_1 = require("mongoose");
const restaurantSchema = new mongoose_1.Schema({
    restaurantName: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    employeesList: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                required: false,
                ref: 'User'
            }
        ],
        required: true
    },
    ownerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Owner'
    },
    tablesList: {
        type: [{
                type: mongoose_1.Schema.Types.ObjectId,
                required: false,
                ref: 'Table'
            }],
        required: true
    },
    daysList: {
        type: [{
                type: mongoose_1.Schema.Types.ObjectId,
                required: false,
                ref: 'Day'
            }],
        required: true
    },
    itemsList: {
        type: [{
                type: mongoose_1.Schema.Types.ObjectId,
                required: false,
                ref: 'Item'
            }],
        required: true
    }
});
exports.RestaurantModel = (0, mongoose_1.model)('Restaurant', restaurantSchema);
