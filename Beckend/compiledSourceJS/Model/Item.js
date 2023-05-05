"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const itemSchema = new mongoose_1.default.Schema({
    name: {
        type: mongoose_1.default.SchemaTypes.String,
        required: true
    },
    price: {
        type: mongoose_1.default.SchemaTypes.String,
        required: true,
        unique: true
    },
    type: {
        type: [mongoose_1.default.SchemaTypes.String],
        required: true
    },
    allergenes: [{
            type: mongoose_1.default.SchemaTypes.String,
            required: false,
            ref: 'Allergene'
        }],
    idRestaurant: {
        type: mongoose_1.default.SchemaTypes.String,
        required: true,
    }
});
exports.ItemModel = mongoose_1.default.model('Item', itemSchema);
