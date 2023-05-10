"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantModel = exports.addBartenderToARestaurantAndSave = exports.addCashierToARestaurantAndSave = exports.addWaiterToARestaurantAndSave = exports.addCookToARestaurantAndSave = exports.newRestaurant = exports.checkNameCorrectness = void 0;
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
restaurantSchema.methods.isDayPresent = function (dayId) {
    try {
        return this.daysList.includes(new mongoose_1.Types.ObjectId(dayId));
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
restaurantSchema.methods.removeDay = function (day) {
    let index = this.daysList.indexOf(new mongoose_1.Types.ObjectId(day));
    if (index !== -1) {
        this.daysList.splice(index, 1);
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
function checkNameCorrectness(restaurantName) {
    const isNotNull = restaurantName.length !== null;
    if (!isNotNull) {
        return false;
    }
    else {
        const isLessThan16 = restaurantName.length <= 15;
        return isLessThan16;
    }
}
exports.checkNameCorrectness = checkNameCorrectness;
function newRestaurant(restaurantName, idOwner) {
    const newRestaurant = new exports.RestaurantModel({
        restaurantName: restaurantName,
        employeesList: [],
        ownerId: idOwner.getId(),
        tablesList: [],
        daysList: [],
        itemsList: []
    });
    return newRestaurant;
}
exports.newRestaurant = newRestaurant;
function addCookToARestaurantAndSave(cook, restaurant) {
    return __awaiter(this, void 0, void 0, function* () {
        restaurant.cookList.push(cook.getId());
        yield restaurant.save();
    });
}
exports.addCookToARestaurantAndSave = addCookToARestaurantAndSave;
function addWaiterToARestaurantAndSave(waiter, restaurant) {
    return __awaiter(this, void 0, void 0, function* () {
        restaurant.waiterList.push(waiter.getId());
        yield restaurant.save();
    });
}
exports.addWaiterToARestaurantAndSave = addWaiterToARestaurantAndSave;
function addCashierToARestaurantAndSave(user, restaurant) {
    return __awaiter(this, void 0, void 0, function* () {
        restaurant.cashierList.push(user._id);
        yield restaurant.save();
    });
}
exports.addCashierToARestaurantAndSave = addCashierToARestaurantAndSave;
function addBartenderToARestaurantAndSave(user, restaurant) {
    return __awaiter(this, void 0, void 0, function* () {
        restaurant.bartenderList.push(user._id);
        yield restaurant.save();
    });
}
exports.addBartenderToARestaurantAndSave = addBartenderToARestaurantAndSave;
exports.RestaurantModel = (0, mongoose_1.model)('Restaurant', restaurantSchema);
