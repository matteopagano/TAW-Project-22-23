"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableModel = exports.removeGroupFromTable = exports.addGroupToATable = exports.createTable = void 0;
const mongoose_1 = require("mongoose");
const tableSchema = new mongoose_1.Schema({
    tableNumber: {
        type: String,
        required: true,
    },
    maxSeats: {
        type: Number,
        required: true,
    },
    group: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        ref: "Group",
    },
    restaurantId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Restaurant",
    },
});
tableSchema.methods.isEmpty = function () {
    return this.group === null;
};
function createTable(tableNumber, maxSeats, idRestaurant) {
    const newTable = new exports.TableModel({
        tableNumber: tableNumber,
        isFree: true,
        maxSeats: maxSeats,
        restaurantId: idRestaurant,
        group: null,
    });
    return newTable;
}
exports.createTable = createTable;
function addGroupToATable(group, table) {
    table.group = group._id;
}
exports.addGroupToATable = addGroupToATable;
function removeGroupFromTable(table) {
    table.group = null;
}
exports.removeGroupFromTable = removeGroupFromTable;
exports.TableModel = (0, mongoose_1.model)("Table", tableSchema);
