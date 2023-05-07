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
exports.basicAuthentication = exports.isOwnerMiddleware = exports.verifyJWT = void 0;
const passport = require("passport"); // authentication middleware for Express
const passportHTTP = require("passport-http");
const User = __importStar(require("../Model/User"));
const Owner_1 = require("../Model/Owner");
const Bartender_1 = require("../Model/Bartender");
const Cashier_1 = require("../Model/Cashier");
const Cook_1 = require("../Model/Cook");
const Waiter_1 = require("../Model/Waiter");
const express_jwt_1 = require("express-jwt");
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
                    user = new Owner_1.OwnerModel(user);
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
    console.log("STAMPO SUER");
    console.log(req.auth);
    //User.UserModel.find
    const user = new User.UserModel(req.auth);
    console.log("user :" + user);
    if (user.isOwner()) {
        return next();
    }
    else {
        return next({ statusCode: 404, error: true, errormessage: "You are not Owner" });
    }
}
exports.isOwnerMiddleware = isOwnerMiddleware;
exports.basicAuthentication = passport.authenticate('basic', { session: false });
