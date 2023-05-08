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
exports.getOrdersByRestaurantAndDay = exports.getDaysByRestaurant = exports.getTablesByRestaurant = exports.createStaffMember = exports.createRestaurant = exports.getEmployeesByRestaurant = exports.getRestaurantById = exports.login = exports.root = void 0;
const Restaurant = __importStar(require("../Model/Restaurant"));
const User = __importStar(require("../Model/User"));
const jsonwebtoken = require("jsonwebtoken"); //For sign the jwt data
const Owner = __importStar(require("../Model/Owner"));
const Utilities = __importStar(require("./utilities"));
const result = require('dotenv').config({ path: './compiledSourceJS/Beckend/.env' });
if (result.error) {
    console.log(process.cwd());
    console.log("Unable to load \".env\" file. Please provide one to store the JWT secret key");
    process.exit(-1);
}
if (!process.env.JWT_SECRET) {
    console.log("\".env\" file find but unable to locate JET_SECRET.");
}
function root(req, res) {
    res.status(200).json({ api_version: "1.0", endpoints: ["/", "login", "/restaurants/:idr", "/restaurants/:idr/employees", "/restaurants", ""] }); // json method sends a JSON response (setting the correct Content-Type) to the client
}
exports.root = root;
function login(req, res, next) {
    // If it's reached this point, req.user has been injected.
    const authenticatedUser = new User.UserModel(req.user);
    const token = {
        username: authenticatedUser.username,
        role: authenticatedUser.role,
        email: authenticatedUser.email,
        _id: authenticatedUser._id
    };
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT secret is not defined');
    }
    const options = {
        expiresIn: '5h'
    };
    const tokenSigned = jsonwebtoken.sign(token, secret, options);
    return res.status(200).json({ error: false, errormessage: "", token: tokenSigned });
}
exports.login = login;
function getRestaurantById(req, res, next) {
    Owner.OwnerModel.findById(req.auth._id)
        .then((user) => {
        if (user.isOwnerOf(req.params.idr)) {
            Restaurant.RestaurantModel.findById(req.params.idr)
                .then((restaurant) => {
                if (restaurant) {
                    return res.status(200).json(restaurant);
                }
                else {
                    return next({ statusCode: 404, error: true, errormessage: "Any restaurant found" });
                }
            })
                .catch((error) => {
                return next({ statusCode: 404, error: true, errormessage: "DB error" });
            });
        }
        else {
            return next({ statusCode: 404, error: true, errormessage: "Not your restaurant" });
        }
    });
}
exports.getRestaurantById = getRestaurantById;
function getEmployeesByRestaurant(req, res, next) {
    Owner.OwnerModel.findById(req.auth._id)
        .then((user) => {
        if (user.isOwnerOf(req.params.idr)) {
            Restaurant.RestaurantModel.findById(req.params.idr)
                .then((restaurant) => {
                if (restaurant) {
                    console.log(restaurant.employeesList);
                    return res.status(200).json(restaurant.employeesList);
                }
                else {
                    return next({ statusCode: 404, error: true, errormessage: "Any restaurant found" });
                }
            })
                .catch((error) => {
                return next({ statusCode: 404, error: true, errormessage: "DB error" });
            });
        }
        else {
            return next({ statusCode: 404, error: true, errormessage: "Not your restaurant" });
        }
    });
}
exports.getEmployeesByRestaurant = getEmployeesByRestaurant;
function createRestaurant(req, res, next) {
    console.log("sono nel createRestaurant e vuol dire che l'owner non ha gia un restaurant se sono arrivato qua");
    Owner.OwnerModel.findById(req.auth._id)
        .then((owner) => {
        const newRestaurant = new Restaurant.RestaurantModel({
            restaurantName: req.body.restaurantName,
            employeesList: [],
            ownerId: owner._id,
            tablesList: [],
            daysList: [],
            itemsList: []
        });
        newRestaurant.save()
            .then(() => {
            owner.restaurantOwn = newRestaurant._id;
            owner.save();
        })
            .then(() => {
            return res.status(200).json(newRestaurant._id);
        })
            .catch(() => {
            return next({ statusCode: 404, error: true, errormessage: "DB error while posting new restaurant" });
        });
    })
        .catch(() => {
        return next({ statusCode: 404, error: true, errormessage: "error while searching owner ownerId:" + req.auth._id });
    });
}
exports.createRestaurant = createRestaurant;
function createStaffMember(req, res, next) {
    const username = req.params.username;
    const email = req.params.email;
    const role = req.params.role;
    console.log(username + " " + email + " " + role);
    console.log("provo a creare");
    Owner.OwnerModel.findById(req.auth._id)
        .then((owner) => {
        if (owner) {
            console.log(req.params.role);
            switch (req.params.role) {
                case User.RoleType.COOK:
                    const newPassword = Utilities.generateRandomString(8);
                    return Utilities.createCook(username, email, newPassword, owner.restaurantOwn)
                        .then((cook) => {
                        Restaurant.RestaurantModel.findById(cook.idRestaurant)
                            .then((restaurant) => {
                            restaurant.employeesList.push(cook._id);
                            restaurant.save();
                        })
                            .then(() => {
                            return res.status(200).json({ error: false, errormessage: "", newCook: { username: username, email: email, newPassword: newPassword } });
                        })
                            .catch((error) => {
                            return next({ statusCode: 404, error: true, errormessage: error });
                        });
                    })
                        .catch((error) => {
                        return next({ statusCode: 404, error: true, errormessage: "error while creating new cook" });
                    });
                    break;
            }
        }
        else {
            return next({ statusCode: 404, error: true, errormessage: "no owner find ownerId:" + req.auth._id });
        }
    })
        .catch((error) => {
        return next({ statusCode: 404, error: true, errormessage: error });
    });
}
exports.createStaffMember = createStaffMember;
function getTablesByRestaurant(req, res, next) {
}
exports.getTablesByRestaurant = getTablesByRestaurant;
function getDaysByRestaurant(req, res, next) {
}
exports.getDaysByRestaurant = getDaysByRestaurant;
function getOrdersByRestaurantAndDay(req, res, next) {
}
exports.getOrdersByRestaurantAndDay = getOrdersByRestaurantAndDay;
