"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllergeneModel = void 0;
const mongoose_1 = require("mongoose");
const allergeneSchema = new mongoose_1.Schema({
    allergene: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    isPresentOn: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                required: false,
                ref: 'Item'
            },
        ],
        required: true
    }
});
exports.AllergeneModel = (0, mongoose_1.model)('Allergene', allergeneSchema);
