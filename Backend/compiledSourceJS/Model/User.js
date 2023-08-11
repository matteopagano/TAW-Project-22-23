"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.UserModel = exports.checkNameCorrectness = exports.checkEmailCorrectness = exports.options = exports.RoleType = void 0;
const mongoose_1 = require("mongoose");
const crypto = require("crypto");
const emailValidator = __importStar(require("email-validator"));
const usernameValidator = __importStar(require("@digitalcube/username-validator"));
var RoleType;
(function (RoleType) {
    RoleType["CASHIER"] = "cashier";
    RoleType["OWNER"] = "owner";
    RoleType["WAITER"] = "waiter";
    RoleType["COOK"] = "cook";
    RoleType["BARTENDER"] = "bartender";
})(RoleType || (exports.RoleType = RoleType = {}));
exports.options = { discriminatorKey: 'role' };
const userSchema = new mongoose_1.Schema({
    username: { type: mongoose_1.Schema.Types.String, required: true },
    email: { type: mongoose_1.Schema.Types.String, required: true },
    digest: { type: mongoose_1.Schema.Types.String, required: true },
    role: { type: mongoose_1.Schema.Types.String, enum: RoleType, required: true },
    salt: { type: mongoose_1.Schema.Types.String, required: true },
    idRestaurant: { type: mongoose_1.Schema.Types.ObjectId, required: false, ref: 'Restaurant' },
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
userSchema.methods.getId = function () {
    return this._id;
};
userSchema.methods.getUsername = function () {
    return this.username;
};
userSchema.methods.getEmail = function () {
    return this.email;
};
userSchema.methods.getRole = function () {
    return this.role;
};
function checkEmailCorrectness(email) {
    return emailValidator.validate(email);
}
exports.checkEmailCorrectness = checkEmailCorrectness;
function checkNameCorrectness(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const isNotNull = name.length !== null;
        if (!isNotNull) {
            return false;
        }
        else {
            try {
                yield usernameValidator.validateUsername(name);
                const isLessThan16 = name.length <= 15;
                return isLessThan16;
            }
            catch (e) {
                return false;
            }
        }
    });
}
exports.checkNameCorrectness = checkNameCorrectness;
exports.UserModel = (0, mongoose_1.model)('User', userSchema);
