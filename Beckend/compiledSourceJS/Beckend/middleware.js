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
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicAuthentication = exports.hasAlreadyARestaurant = exports.hasNotAlreadyARestaurant = exports.isOwnerOfThisRestaurant = exports.isOwnerMiddleware = exports.verifyJWT = void 0;
const passport = require("passport"); // authentication middleware for Express
const passportHTTP = require("passport-http");
const User = __importStar(require("../Model/User"));
const Owner = __importStar(require("../Model/Owner"));
const Bartender_1 = require("../Model/Bartender");
const Cashier_1 = require("../Model/Cashier");
const Cook_1 = require("../Model/Cook");
const Waiter_1 = require("../Model/Waiter");
const express_jwt_1 = require("express-jwt");
const mongoose_1 = require("mongoose");
passport.use(new passportHTTP.BasicStrategy(function (username, password, done) {
    console.log("New login attempt from " + username);
    User.UserModel.findOne({ email: username })
        .then((user) => {
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
            console.log(user);
            return done(null, user);
        }
        return done(null, false, { statusCode: 500, error: true, errormessage: "Invalid password" });
    })
        .catch((err) => {
        return done({ statusCode: 500, error: true, errormessage: err });
    });
}));
exports.verifyJWT = (0, express_jwt_1.expressjwt)({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"]
});
function isOwnerMiddleware(req, res, next) {
    const user = new User.UserModel(req.auth);
    if (user.isOwner()) {
        return next();
    }
    else {
        return next({ statusCode: 404, error: true, errormessage: "You are not Owner" });
    }
}
exports.isOwnerMiddleware = isOwnerMiddleware;
function isOwnerOfThisRestaurant(req, res, next) {
    Owner.OwnerModel.findById(req.auth._id)
        .then((ownerFind) => {
        if (ownerFind) {
            if (ownerFind.isOwnerOf(req.params.idr)) {
                return next();
            }
            else {
                next({ statusCode: 404, error: true, errormessage: "You are not owner of id: " + req.params.idr + " restaurant." });
            }
        }
        else {
            next({ statusCode: 404, error: true, errormessage: "User not found" });
        }
        const idRestaurant = new mongoose_1.Schema.Types.ObjectId(req.params.idr);
    }).catch((error) => {
        next({ statusCode: 404, error: true, errormessage: "error in the DB" });
    });
}
exports.isOwnerOfThisRestaurant = isOwnerOfThisRestaurant;
function hasNotAlreadyARestaurant(req, res, next) {
    console.log("sono in hasAlreadyARestaurant e provo a capire se ha gia un ristorante");
    Owner.OwnerModel.findById(req.auth._id)
        .then((owner) => {
        if (!owner.hasAlreadyARestaurant()) {
            console.log("non ha gia ristoranti");
            next();
        }
        else {
            console.log("ha gia ristoranti");
            return next({ statusCode: 404, error: true, errormessage: "Owner: " + owner._id + " has already a restaurant. restaurantId:" + owner.restaurantOwn.toString() });
        }
    })
        .catch(() => {
        return next({ statusCode: 404, error: true, errormessage: "error while searching owner ownerId:" + req.auth._id });
    });
}
exports.hasNotAlreadyARestaurant = hasNotAlreadyARestaurant;
function hasAlreadyARestaurant(req, res, next) {
    console.log("sono in hasAlreadyARestaurant e provo a capire se ha gia un ristorante");
    Owner.OwnerModel.findById(req.auth._id)
        .then((owner) => {
        if (owner.hasAlreadyARestaurant()) {
            console.log("ha gia ristoranti");
            next();
        }
        else {
            console.log("non ha gia ristoranti");
            return next({ statusCode: 404, error: true, errormessage: "Owner: " + owner._id + " has already a restaurant. restaurantId:" + owner.restaurantOwn.toString() });
        }
    })
        .catch(() => {
        return next({ statusCode: 404, error: true, errormessage: "error while searching owner ownerId:" + req.auth._id });
    });
}
exports.hasAlreadyARestaurant = hasAlreadyARestaurant;
exports.basicAuthentication = passport.authenticate('basic', { session: false });
