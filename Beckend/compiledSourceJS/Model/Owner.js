"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerModel = void 0;
const User_1 = require("./User");
const mongoose_1 = require("mongoose");
const ownerSchema = new mongoose_1.Schema({
    restaurantOwn: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Restaurant', required: false },
}, User_1.options);
ownerSchema.methods.isOwnerOf = function (restaurantId) {
    console.log(this.restaurantOwn.toString());
    console.log(restaurantId);
    return this.restaurantOwn.toString() === restaurantId;
};
ownerSchema.methods.hasAlreadyARestaurant = function () {
    console.log(this.restaurantOwn);
    if (this.restaurantOwn) {
        return true;
    }
    else {
        return false;
    }
};
exports.OwnerModel = User_1.UserModel.discriminator('Owner', ownerSchema, User_1.RoleType.OWNER);
