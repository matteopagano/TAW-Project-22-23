"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.options = exports.RoleType = void 0;
const mongoose_1 = require("mongoose");
const crypto = require("crypto");
var RoleType;
(function (RoleType) {
    RoleType["CASHIER"] = "cashier";
    RoleType["OWNER"] = "owner";
    RoleType["WAITER"] = "waiter";
    RoleType["COOK"] = "cook";
    RoleType["BARTENDER"] = "bartender";
})(RoleType = exports.RoleType || (exports.RoleType = {}));
exports.options = { discriminatorKey: 'role' };
const userSchema = new mongoose_1.Schema({
    username: { type: mongoose_1.Schema.Types.String, required: true },
    email: { type: mongoose_1.Schema.Types.String, required: true },
    digest: { type: mongoose_1.Schema.Types.String, required: true },
    salt: { type: mongoose_1.Schema.Types.String, required: true },
    role: { type: mongoose_1.Schema.Types.String, enum: RoleType, required: true },
}, exports.options);
userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    const hmac = crypto.createHmac('sha512', this.salt);
    hmac.update(password);
    this.digest = hmac.digest('hex');
};
userSchema.methods.isPasswordCorrect = function (password) {
    const hmac = crypto.createHmac('sha512', this.salt);
    hmac.update(password);
    return (this.digest === hmac.digest('hex'));
};
userSchema.methods.isOwner = function () {
    return this.role === 'owner';
};
exports.UserModel = (0, mongoose_1.model)('User', userSchema);
