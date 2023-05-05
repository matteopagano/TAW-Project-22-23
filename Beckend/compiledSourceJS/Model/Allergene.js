"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const tagSchema = new mongoose_1.default.Schema({
    allergene: {
        type: mongoose_1.default.SchemaTypes.String,
        required: true,
    },
    isPresentOn: [{
            type: mongoose_1.default.SchemaTypes.ObjectId,
            required: false,
            ref: 'Item'
        }]
});
exports.TagModel = mongoose_1.default.model('Allergene', tagSchema);
