"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantModel = void 0;
const mongoose_1 = require("mongoose");
const restaurantSchema = new mongoose_1.Schema({
    restaurantName: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    cookList: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                required: false,
                ref: 'Cook'
            }
        ],
        required: true
    },
    waiterList: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                required: false,
                ref: 'Waiter'
            }
        ],
        required: true
    },
    cashierList: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                required: false,
                ref: 'Cashier'
            }
        ],
        required: true
    },
    bartenderList: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                required: false,
                ref: 'Bartender'
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
restaurantSchema.methods.isCookPresent = function (cookId) {
    try {
        return this.cookList.includes(new mongoose_1.Types.ObjectId(cookId));
    }
    catch (_a) {
        return false;
    }
};
restaurantSchema.methods.isWaiterPresent = function (waiterId) {
    try {
        return this.waiterList.includes(new mongoose_1.Types.ObjectId(waiterId));
    }
    catch (_a) {
        return false;
    }
};
restaurantSchema.methods.isCashierPresent = function (cashierId) {
    try {
        return this.cashierList.includes(new mongoose_1.Types.ObjectId(cashierId));
    }
    catch (_a) {
        return false;
    }
};
restaurantSchema.methods.isBartenderPresent = function (bartenderId) {
    try {
        return this.bartenderList.includes(new mongoose_1.Types.ObjectId(bartenderId));
    }
    catch (_a) {
        return false;
    }
};
restaurantSchema.methods.removeCook = function (cookId) {
    let index = this.cookList.indexOf(new mongoose_1.Types.ObjectId(cookId));
    if (index !== -1) {
        this.cookList.splice(index, 1);
        return true;
    }
    else {
        return false;
    }
};
restaurantSchema.methods.removeWaiter = function (waiter) {
    let index = this.waiterList.indexOf(new mongoose_1.Types.ObjectId(waiter));
    if (index !== -1) {
        this.waiterList.splice(index, 1);
        return true;
    }
    else {
        return false;
    }
};
restaurantSchema.methods.removeCashier = function (cashier) {
    let index = this.cashierList.indexOf(new mongoose_1.Types.ObjectId(cashier));
    if (index !== -1) {
        this.cashierList.splice(index, 1);
        return true;
    }
    else {
        return false;
    }
};
restaurantSchema.methods.removeBartender = function (bartender) {
    let index = this.bartenderList.indexOf(new mongoose_1.Types.ObjectId(bartender));
    if (index !== -1) {
        this.bartenderList.splice(index, 1);
        return true;
    }
    else {
        return false;
    }
};
restaurantSchema.methods.getCookList = function () {
    return this.cookList;
};
restaurantSchema.methods.getWaiterList = function () {
    return this.waiterList;
};
restaurantSchema.methods.getCashierList = function () {
    return this.cashierList;
};
restaurantSchema.methods.getBartenderList = function () {
    return this.bartenderList;
};
restaurantSchema.methods.getId = function () {
    return this._id;
};
restaurantSchema.static('checkNameCorrectness', function checkNameCorrectness(restaurantName) {
    const isNotNull = restaurantName.length !== null;
    if (!isNotNull) {
        return false;
    }
    else {
        const isLessThan16 = restaurantName.length <= 15;
        return isLessThan16;
    }
});
exports.RestaurantModel = (0, mongoose_1.model)('Restaurant', restaurantSchema);
