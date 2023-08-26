"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantModel = exports.addRecipeToRestaurant = exports.addGroupToARestaurant = exports.addItemToARestaurant = exports.addTableToARestaurant = exports.addBartenderToARestaurant = exports.addCashierToARestaurant = exports.addWaiterToARestaurant = exports.addCookToARestaurant = exports.newRestaurant = exports.checkNameCorrectness = void 0;
const mongoose_1 = require("mongoose");
const restaurantSchema = new mongoose_1.Schema({
    restaurantName: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    ownerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Owner'
    },
    tables: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                required: false,
                ref: 'Table'
            }
        ],
        required: true
    },
    items: {
        type: [{
                type: mongoose_1.Schema.Types.ObjectId,
                required: false,
                ref: 'Item'
            }],
        required: true
    },
    cookers: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                required: false,
                ref: 'Cook'
            }
        ],
        required: true
    },
    waiters: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                required: false,
                ref: 'Waiter'
            }
        ],
        required: true
    },
    cashiers: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                required: false,
                ref: 'Cashier'
            }
        ],
        required: true
    },
    bartenders: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                required: false,
                ref: 'Bartender'
            }
        ],
        required: true
    },
    recipes: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                required: false,
                ref: 'Recipe'
            }
        ],
        required: true
    },
    groups: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                required: false,
                ref: 'Group'
            }
        ],
        required: true
    }
});
restaurantSchema.methods.isCookPresent = function (cookId) {
    try {
        return this.cookers.includes(new mongoose_1.Types.ObjectId(cookId));
    }
    catch (_a) {
        return false;
    }
};
restaurantSchema.methods.isWaiterPresent = function (waiterId) {
    try {
        return this.waiters.includes(new mongoose_1.Types.ObjectId(waiterId));
    }
    catch (_a) {
        return false;
    }
};
restaurantSchema.methods.isCashierPresent = function (cashierId) {
    try {
        return this.cashiers.includes(new mongoose_1.Types.ObjectId(cashierId));
    }
    catch (_a) {
        return false;
    }
};
restaurantSchema.methods.isBartenderPresent = function (bartenderId) {
    try {
        return this.bartenders.includes(new mongoose_1.Types.ObjectId(bartenderId));
    }
    catch (_a) {
        return false;
    }
};
restaurantSchema.methods.isTablePresent = function (tableId) {
    try {
        return this.tables.includes(new mongoose_1.Types.ObjectId(tableId));
    }
    catch (_a) {
        return false;
    }
};
restaurantSchema.methods.isItemPresent = function (item) {
    try {
        return this.items.includes(new mongoose_1.Types.ObjectId(item));
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
    let index = this.cookers.indexOf(new mongoose_1.Types.ObjectId(cookId));
    if (index !== -1) {
        this.cookers.splice(index, 1);
        return true;
    }
    else {
        return false;
    }
};
restaurantSchema.methods.removeWaiter = function (waiter) {
    let index = this.waiters.indexOf(new mongoose_1.Types.ObjectId(waiter));
    if (index !== -1) {
        this.waiters.splice(index, 1);
        return true;
    }
    else {
        return false;
    }
};
restaurantSchema.methods.removeCashier = function (cashier) {
    let index = this.cashiers.indexOf(new mongoose_1.Types.ObjectId(cashier));
    if (index !== -1) {
        this.cashiers.splice(index, 1);
        return true;
    }
    else {
        return false;
    }
};
restaurantSchema.methods.removeBartender = function (bartender) {
    let index = this.bartenders.indexOf(new mongoose_1.Types.ObjectId(bartender));
    if (index !== -1) {
        this.bartenders.splice(index, 1);
        return true;
    }
    else {
        return false;
    }
};
restaurantSchema.methods.removeTable = function (table) {
    let index = this.tables.indexOf(new mongoose_1.Types.ObjectId(table));
    if (index !== -1) {
        this.tables.splice(index, 1);
        return true;
    }
    else {
        return false;
    }
};
restaurantSchema.methods.removeItem = function (item) {
    let index = this.items.indexOf(new mongoose_1.Types.ObjectId(item));
    if (index !== -1) {
        this.items.splice(index, 1);
        return true;
    }
    else {
        return false;
    }
};
restaurantSchema.methods.removeGroup = function (group) {
    let index = this.groups.indexOf(new mongoose_1.Types.ObjectId(group));
    if (index !== -1) {
        this.groups.splice(index, 1);
        return true;
    }
    else {
        return false;
    }
};
restaurantSchema.methods.getcookers = function () {
    return this.cookers;
};
restaurantSchema.methods.getwaiters = function () {
    return this.waiters;
};
restaurantSchema.methods.getcashiers = function () {
    return this.cashiers;
};
restaurantSchema.methods.getbartenders = function () {
    return this.bartenders;
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
        ownerId: idOwner.getId(),
        tables: [],
        items: [],
        cookers: [],
        waiters: [],
        cashiers: [],
        bartenders: [],
        recipes: [],
        groups: [],
    });
    return newRestaurant;
}
exports.newRestaurant = newRestaurant;
function addCookToARestaurant(cook, restaurant) {
    restaurant.cookers.push(cook.getId());
}
exports.addCookToARestaurant = addCookToARestaurant;
function addWaiterToARestaurant(waiter, restaurant) {
    restaurant.waiters.push(waiter.getId());
}
exports.addWaiterToARestaurant = addWaiterToARestaurant;
function addCashierToARestaurant(user, restaurant) {
    restaurant.cashiers.push(user._id);
}
exports.addCashierToARestaurant = addCashierToARestaurant;
function addBartenderToARestaurant(user, restaurant) {
    restaurant.bartenders.push(user._id);
}
exports.addBartenderToARestaurant = addBartenderToARestaurant;
function addTableToARestaurant(table, restaurant) {
    restaurant.tables.push(table._id);
}
exports.addTableToARestaurant = addTableToARestaurant;
function addItemToARestaurant(item, restaurant) {
    restaurant.items.push(item._id);
}
exports.addItemToARestaurant = addItemToARestaurant;
function addGroupToARestaurant(group, restaurant) {
    restaurant.groups.push(group._id);
}
exports.addGroupToARestaurant = addGroupToARestaurant;
function addRecipeToRestaurant(recipe, restaurant) {
    restaurant.recipes.push(recipe._id);
}
exports.addRecipeToRestaurant = addRecipeToRestaurant;
exports.RestaurantModel = (0, mongoose_1.model)('Restaurant', restaurantSchema);
