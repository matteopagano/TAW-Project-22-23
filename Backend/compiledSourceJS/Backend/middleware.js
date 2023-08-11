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
exports.basicAuthentication = exports.isItemOfThatRestaurant = exports.isTableOfThatRestaurant = exports.isUserAlreadyExist = exports.isValidRestaurantInput = exports.isDayOfThatRestaurant = exports.isBartenderMemberOfThatRestaurant = exports.isCashierMemberOfThatRestaurant = exports.isWaiterMemberOfThatRestaurant = exports.isCookMemberOfThatRestaurant = exports.hasNotAlreadyARestaurant = exports.isOwnerOfThisRestaurant = exports.isOwner = exports.verifyJWT = void 0;
const passport = require("passport"); // authentication middleware for Express
const passportHTTP = require("passport-http");
const User = __importStar(require("../Model/User"));
const Owner = __importStar(require("../Model/Owner"));
const Bartender_1 = require("../Model/Bartender");
const Cashier_1 = require("../Model/Cashier");
const Cook_1 = require("../Model/Cook");
const Waiter_1 = require("../Model/Waiter");
const express_jwt_1 = require("express-jwt");
const Restaurant = __importStar(require("../Model/Restaurant"));
passport.use(new passportHTTP.BasicStrategy(function (username, password, done) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield User.UserModel.findOne({ email: username });
        if (!user) {
            return done(null, false, { statusCode: 500, error: true, errormessage: "Invalid user" });
        }
        console.log(user);
        if (user.isPasswordCorrect(password)) {
            switch (user.role) {
                case 'owner':
                    user = new Owner.OwnerModel(user);
                    break;
                case 'bartender':
                    user = new Bartender_1.BartenderModel(user);
                    break;
                case 'cashier':
                    user = new Cashier_1.CashierModel(user);
                    break;
                case 'cook':
                    user = new Cook_1.CookModel(user);
                    break;
                case 'waiter':
                    user = new Waiter_1.WaiterModel(user);
                    break;
            }
            return done(null, user);
        }
        else {
            return done(null, false, { statusCode: 500, error: true, errormessage: "Invalid password" });
        }
    });
}));
exports.verifyJWT = (0, express_jwt_1.expressjwt)({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"]
});
function isOwner(req, res, next) {
    const user = new User.UserModel(req.auth);
    if (user.isOwner()) {
        return next();
    }
    else {
        return next({ statusCode: 404, error: true, errormessage: "You are not Owner" });
    }
}
exports.isOwner = isOwner;
function isOwnerOfThisRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idOwnerAuthenticated = req.auth._id;
        const idRistoranteParameter = req.params.idr;
        const ownerAuthenticated = yield Owner.OwnerModel.findById(idOwnerAuthenticated);
        if (ownerAuthenticated !== null) {
            if (ownerAuthenticated.hasAlreadyARestaurant()) {
                if (ownerAuthenticated.isOwnerOf(idRistoranteParameter)) {
                    return next();
                }
                else {
                    next({ statusCode: 404, error: true, errormessage: "You are not owner of id: " + idRistoranteParameter + " restaurant." });
                }
            }
            else {
                return next({ statusCode: 404, error: true, errormessage: "owner:" + ownerAuthenticated._id + " has not restaurant" });
            }
        }
        else {
            next({ statusCode: 404, error: true, errormessage: "User not found" });
        }
    });
}
exports.isOwnerOfThisRestaurant = isOwnerOfThisRestaurant;
function hasNotAlreadyARestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idOwner = req.auth._id;
        const owner = yield Owner.OwnerModel.findById(idOwner);
        if (owner) {
            if (!owner.hasAlreadyARestaurant()) {
                next();
            }
            else {
                return next({ statusCode: 404, error: true, errormessage: "Owner: " + owner._id + " has already a restaurant. restaurantId:" + owner.restaurantOwn.toString() });
            }
        }
        else {
            return next({ statusCode: 404, error: true, errormessage: "Owner with id: " + req.auth._id + " doesn't exist" });
        }
    });
}
exports.hasNotAlreadyARestaurant = hasNotAlreadyARestaurant;
function isCookMemberOfThatRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("debug 2");
        const cookIdToRemove = req.params.idu;
        const restaurantIdInWhichRemoveCook = req.params.idr;
        const restaurant = yield Restaurant.RestaurantModel.findById(restaurantIdInWhichRemoveCook);
        if (restaurant.isCookPresent(cookIdToRemove)) {
            next();
        }
        else {
            next({ statusCode: 404, error: true, errormessage: "cook " + cookIdToRemove + " is not member of " + restaurantIdInWhichRemoveCook });
        }
    });
}
exports.isCookMemberOfThatRestaurant = isCookMemberOfThatRestaurant;
function isWaiterMemberOfThatRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const waiterIdToRemove = req.params.idu;
        const restaurantIdInWhichRemoveWaiter = req.params.idr;
        const restaurant = yield Restaurant.RestaurantModel.findById(restaurantIdInWhichRemoveWaiter);
        if (restaurant.isWaiterPresent(waiterIdToRemove)) {
            next();
        }
        else {
            next({ statusCode: 404, error: true, errormessage: "waiter " + waiterIdToRemove + " is not member of " + restaurantIdInWhichRemoveWaiter });
        }
    });
}
exports.isWaiterMemberOfThatRestaurant = isWaiterMemberOfThatRestaurant;
function isCashierMemberOfThatRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const cashierIdToRemove = req.params.idu;
        const restaurantIdInWhichRemoveCashier = req.params.idr;
        const restaurant = yield Restaurant.RestaurantModel.findById(restaurantIdInWhichRemoveCashier);
        if (restaurant.isCashierPresent(cashierIdToRemove)) {
            next();
        }
        else {
            next({ statusCode: 404, error: true, errormessage: "cashier " + cashierIdToRemove + " is not member of " + restaurantIdInWhichRemoveCashier });
        }
    });
}
exports.isCashierMemberOfThatRestaurant = isCashierMemberOfThatRestaurant;
function isBartenderMemberOfThatRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const bartenderIdToRemove = req.params.idu;
        const restaurantIdInWhichRemoveBartender = req.params.idr;
        const restaurant = yield Restaurant.RestaurantModel.findById(restaurantIdInWhichRemoveBartender);
        if (restaurant.isBartenderPresent(bartenderIdToRemove)) {
            next();
        }
        else {
            next({ statusCode: 404, error: true, errormessage: "bartender " + bartenderIdToRemove + " is not member of " + restaurantIdInWhichRemoveBartender });
        }
    });
}
exports.isBartenderMemberOfThatRestaurant = isBartenderMemberOfThatRestaurant;
function isDayOfThatRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idDayToRemove = req.params.idd;
        const restaurantIdInWhichRemoveDay = req.params.idr;
        const restaurant = yield Restaurant.RestaurantModel.findById(restaurantIdInWhichRemoveDay);
        if (restaurant.isDayPresent(idDayToRemove)) {
            next();
        }
        else {
            next({ statusCode: 404, error: true, errormessage: "day " + idDayToRemove + " is not day of " + restaurantIdInWhichRemoveDay });
        }
    });
}
exports.isDayOfThatRestaurant = isDayOfThatRestaurant;
function isValidRestaurantInput(req, res, next) {
    const restaurantNameBody = req.body.restaurantName;
    if (Restaurant.checkNameCorrectness(restaurantNameBody)) {
        next();
    }
    else {
        return next({ statusCode: 404, error: true, errormessage: "Restaurant name not valid. Name's length must be less than 16. restaurant name : " + restaurantNameBody });
    }
}
exports.isValidRestaurantInput = isValidRestaurantInput;
function isUserAlreadyExist(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const emailBody = req.body.email;
        const userFind = yield User.UserModel.findOne({ email: emailBody });
        if (!userFind) {
            next();
        }
        else {
            return next({ statusCode: 404, error: true, errormessage: "User : " + emailBody + " already exist." });
        }
    });
}
exports.isUserAlreadyExist = isUserAlreadyExist;
function isTableOfThatRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const tableIdToRemove = req.params.idt;
        const restaurantIdInWhichRemoveTable = req.params.idr;
        const restaurant = yield Restaurant.RestaurantModel.findById(restaurantIdInWhichRemoveTable);
        if (restaurant.isTablePresent(tableIdToRemove)) {
            next();
        }
        else {
            next({ statusCode: 404, error: true, errormessage: "table " + tableIdToRemove + " is not table of " + restaurantIdInWhichRemoveTable });
        }
    });
}
exports.isTableOfThatRestaurant = isTableOfThatRestaurant;
function isItemOfThatRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const itemIdToRemove = req.params.idi;
        const restaurantIdInWhichRemoveTable = req.params.idr;
        const restaurant = yield Restaurant.RestaurantModel.findById(restaurantIdInWhichRemoveTable);
        if (restaurant.isItemPresent(itemIdToRemove)) {
            next();
        }
        else {
            next({ statusCode: 404, error: true, errormessage: "item " + itemIdToRemove + " is not item of " + restaurantIdInWhichRemoveTable });
        }
    });
}
exports.isItemOfThatRestaurant = isItemOfThatRestaurant;
exports.basicAuthentication = passport.authenticate('basic', { session: false });
