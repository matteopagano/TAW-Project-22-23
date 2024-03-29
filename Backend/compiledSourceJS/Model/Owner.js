"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerModel = void 0;
const User_1 = require("./User");
const mongoose_1 = require("mongoose");
const ownerSchema = new mongoose_1.Schema({
    restaurantOwn: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: false,
    },
}, User_1.options);
ownerSchema.methods.isOwnerOf = function (restaurantId) {
    return this.restaurantOwn.toString() === restaurantId;
};
ownerSchema.methods.hasAlreadyARestaurant = function () {
    if (this.restaurantOwn !== null) {
        return true;
    }
    else {
        return false;
    }
};
ownerSchema.methods.setRestaurantOwn = function (idRestaurantOwn) {
    this.restaurantOwn = idRestaurantOwn;
};
exports.OwnerModel = User_1.UserModel.discriminator("Owner", ownerSchema, User_1.RoleType.OWNER);
