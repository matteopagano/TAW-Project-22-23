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
exports.getDaysListByRestaurant = exports.createDayAndAddToARestaurant = exports.deleteBartenderAndRemoveFromRestaurant = exports.deleteCashierAndRemoveFromRestaurant = exports.deleteWaiterAndRemoveFromRestaurant = exports.deleteCookAndRemoveFromRestaurant = exports.createBartenderAndAddToARestaurant = exports.createCashierAndAddToARestaurant = exports.createWaiterAndAddToARestaurant = exports.createCookAndAddToARestaurant = exports.createRestaurant = exports.getBartenderByRestaurant = exports.getCashiersByRestaurant = exports.getWaitersByRestaurant = exports.getCooksByRestaurant = exports.getRestaurantById = exports.login = exports.root = void 0;
const Restaurant = __importStar(require("../Model/Restaurant"));
const User = __importStar(require("../Model/User"));
const Cook = __importStar(require("../Model/Cook"));
const Waiter = __importStar(require("../Model/Waiter"));
const Cashier = __importStar(require("../Model/Cashier"));
const Bartender = __importStar(require("../Model/Bartender"));
const Day = __importStar(require("../Model/Day"));
const jsonwebtoken = require("jsonwebtoken"); //For sign the jwt data
const Owner = __importStar(require("../Model/Owner"));
const Utilities = __importStar(require("./utilities"));
const result = require('dotenv').config({ path: './compiledSourceJS/Beckend/.env' });
if (result.error) {
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
    return __awaiter(this, void 0, void 0, function* () {
        const idRestorantParameter = req.params.idr;
        const restaurant = yield Restaurant.RestaurantModel.findById(idRestorantParameter);
        if (restaurant) {
            return res.status(200).json({ error: false, errormessage: "", restaurant: restaurant });
        }
        else {
            return next({ statusCode: 404, error: true, errormessage: "Any restaurant found" });
        }
    });
}
exports.getRestaurantById = getRestaurantById;
function getCooksByRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idRistoranteParameter = req.params.idr;
        const restaurant = yield (Restaurant.RestaurantModel.findById(idRistoranteParameter).populate('cookList'));
        if (restaurant) {
            return res.status(200).json({ error: false, errormessage: "", cooks: restaurant.getCookList() });
        }
        else {
            return next({ statusCode: 404, error: true, errormessage: "Any restaurant found" });
        }
    });
}
exports.getCooksByRestaurant = getCooksByRestaurant;
function getWaitersByRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idRistoranteParameter = req.params.idr;
        const restaurant = yield (Restaurant.RestaurantModel.findById(idRistoranteParameter).populate('waiterList'));
        if (restaurant) {
            return res.status(200).json({ error: false, errormessage: "", waiters: restaurant.getWaiterList() });
        }
        else {
            return next({ statusCode: 404, error: true, errormessage: "Any restaurant found" });
        }
    });
}
exports.getWaitersByRestaurant = getWaitersByRestaurant;
function getCashiersByRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idRistoranteParameter = req.params.idr;
        const restaurant = yield (Restaurant.RestaurantModel.findById(idRistoranteParameter).populate('cashierList'));
        if (restaurant) {
            return res.status(200).json({ error: false, errormessage: "", cashiers: restaurant.getCashierList() });
        }
        else {
            return next({ statusCode: 404, error: true, errormessage: "Any restaurant found" });
        }
    });
}
exports.getCashiersByRestaurant = getCashiersByRestaurant;
function getBartenderByRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idRistoranteParameter = req.params.idr;
        const restaurant = yield Restaurant.RestaurantModel.findById(idRistoranteParameter).populate('bartenderList');
        if (restaurant) {
            return res.status(200).json({ error: false, errormessage: "", bartenders: restaurant.getBartenderList() });
        }
        else {
            return next({ statusCode: 404, error: true, errormessage: "Any restaurant found" });
        }
    });
}
exports.getBartenderByRestaurant = getBartenderByRestaurant;
function createRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const customRequest = req; // For error type at compile time
        const idOwner = customRequest.auth._id;
        const restaurantNameBody = req.body.restaurantName;
        const owner = yield Owner.OwnerModel.findById(idOwner);
        if (Restaurant.RestaurantModel.checkNameCorrectness(restaurantNameBody)) {
            const newRestaurant = new Restaurant.RestaurantModel({
                restaurantName: restaurantNameBody,
                employeesList: [],
                ownerId: owner.getId(),
                tablesList: [],
                daysList: [],
                itemsList: []
            });
            owner.setRestaurantOwn(newRestaurant.getId());
            yield owner.save();
            yield newRestaurant.save();
            return res.status(200).json({ error: false, errormessage: "", newRestaurantId: newRestaurant.getId() });
        }
        else {
            return next({ statusCode: 404, error: true, errormessage: "Restaurant name not valid. Name's length must be less than 16. restaurant name : " + restaurantNameBody });
        }
    });
}
exports.createRestaurant = createRestaurant;
function createCookAndAddToARestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const customRequest = req; // For error type at compile time
        const username = req.body.username;
        const email = req.body.email;
        const role = req.body.role;
        const newPassword = Utilities.generateRandomString(8);
        const owner = yield Owner.OwnerModel.findById(customRequest.auth._id);
        const restaurant = yield Restaurant.RestaurantModel.findById(owner.restaurantOwn.toString());
        const cook = yield Utilities.createCook(username, email, newPassword, owner.restaurantOwn);
        Utilities.addCookToARestaurant(cook, restaurant);
        return res.status(200).json({ idNewCook: cook._id, usernameNewCook: cook.username, email: cook.email, passwordToChange: newPassword });
        //return next({statusCode : 404, error: true, errormessage: "no owner find ownerId:" + customRequest.auth._id});
    });
}
exports.createCookAndAddToARestaurant = createCookAndAddToARestaurant;
function createWaiterAndAddToARestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const customRequest = req; // For error type at compile time
        const username = req.body.username;
        const email = req.body.email;
        const role = req.body.role;
        const newPassword = Utilities.generateRandomString(8);
        const owner = yield Owner.OwnerModel.findById(customRequest.auth._id);
        const restaurant = yield Restaurant.RestaurantModel.findById(owner.restaurantOwn.toString());
        const waiter = yield Utilities.createWaiter(username, email, newPassword, owner.restaurantOwn);
        Utilities.addWaiterToARestaurant(waiter, restaurant);
        return res.status(200).json({ idNewCook: waiter._id, usernameNewCook: waiter.username, email: waiter.email, passwordToChange: newPassword });
        //return next({statusCode : 404, error: true, errormessage: "no owner find ownerId:" + customRequest.auth._id});
    });
}
exports.createWaiterAndAddToARestaurant = createWaiterAndAddToARestaurant;
function createCashierAndAddToARestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const customRequest = req; // For error type at compile time
        const username = req.body.username;
        const email = req.body.email;
        const role = req.body.role;
        const newPassword = Utilities.generateRandomString(8);
        const owner = yield Owner.OwnerModel.findById(customRequest.auth._id);
        const restaurant = yield Restaurant.RestaurantModel.findById(owner.restaurantOwn.toString());
        const cashier = yield Utilities.createCashier(username, email, newPassword, owner.restaurantOwn);
        Utilities.addCashierToARestaurant(cashier, restaurant);
        return res.status(200).json({ idNewCook: cashier._id, usernameNewCook: cashier.username, email: cashier.email, passwordToChange: newPassword });
        //return next({statusCode : 404, error: true, errormessage: "no owner find ownerId:" + customRequest.auth._id});
    });
}
exports.createCashierAndAddToARestaurant = createCashierAndAddToARestaurant;
function createBartenderAndAddToARestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const customRequest = req; // For error type at compile time
        const username = req.body.username;
        const email = req.body.email;
        const role = req.body.role;
        const newPassword = Utilities.generateRandomString(8);
        const owner = yield Owner.OwnerModel.findById(customRequest.auth._id);
        const restaurant = yield Restaurant.RestaurantModel.findById(owner.restaurantOwn.toString());
        const bartender = yield Utilities.createBartender(username, email, newPassword, owner.restaurantOwn);
        Utilities.addBartenderToARestaurant(bartender, restaurant);
        return res.status(200).json({ idNewCook: bartender._id, usernameNewCook: bartender.username, email: bartender.email, passwordToChange: newPassword });
        //return next({statusCode : 404, error: true, errormessage: "no owner find ownerId:" + customRequest.auth._id});
    });
}
exports.createBartenderAndAddToARestaurant = createBartenderAndAddToARestaurant;
function deleteCookAndRemoveFromRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idRestaurant = req.params.idr;
        const idCook = req.params.idu;
        const restaurant = yield Restaurant.RestaurantModel.findById(idRestaurant);
        if (restaurant.isCookPresent(idCook)) {
            if (restaurant.removeCook(idCook)) {
                yield restaurant.save();
                yield Cook.CookModel.deleteOne({ _id: idCook });
                return res.status(200).json({ idCookDeleted: idCook });
            }
            else {
                return next({ statusCode: 404, error: true, errormessage: "Cook not deleted" });
            }
        }
    });
}
exports.deleteCookAndRemoveFromRestaurant = deleteCookAndRemoveFromRestaurant;
function deleteWaiterAndRemoveFromRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idRestaurant = req.params.idr;
        const idWaiter = req.params.idu;
        const restaurant = yield Restaurant.RestaurantModel.findById(idRestaurant);
        if (restaurant.isWaiterPresent(idWaiter)) {
            if (restaurant.removeWaiter(idWaiter)) {
                yield restaurant.save();
                yield Waiter.WaiterModel.deleteOne({ _id: idWaiter });
                return res.status(200).json({ idWaiterDeleted: idWaiter });
            }
            else {
                return next({ statusCode: 404, error: true, errormessage: "Cook not deleted" });
            }
        }
    });
}
exports.deleteWaiterAndRemoveFromRestaurant = deleteWaiterAndRemoveFromRestaurant;
function deleteCashierAndRemoveFromRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idRestaurant = req.params.idr;
        const idCashier = req.params.idu;
        const restaurant = yield Restaurant.RestaurantModel.findById(idRestaurant);
        if (restaurant.isCashierPresent(idCashier)) {
            if (restaurant.removeCashier(idCashier)) {
                yield restaurant.save();
                yield Cashier.CashierModel.deleteOne({ _id: idCashier });
                return res.status(200).json({ idCashierDeleted: idCashier });
            }
            else {
                return next({ statusCode: 404, error: true, errormessage: "Cook not deleted" });
            }
        }
    });
}
exports.deleteCashierAndRemoveFromRestaurant = deleteCashierAndRemoveFromRestaurant;
function deleteBartenderAndRemoveFromRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idRestaurant = req.params.idr;
        const idBartender = req.params.idu;
        const restaurant = yield Restaurant.RestaurantModel.findById(idRestaurant);
        if (restaurant.isBartenderPresent(idBartender)) {
            if (restaurant.removeBartender(idBartender)) {
                yield restaurant.save();
                yield Bartender.BartenderModel.deleteOne({ _id: idBartender });
                return res.status(200).json({ idCBartenderDeleted: idBartender });
            }
            else {
                return next({ statusCode: 404, error: true, errormessage: "Cook not deleted" });
            }
        }
    });
}
exports.deleteBartenderAndRemoveFromRestaurant = deleteBartenderAndRemoveFromRestaurant;
function createDayAndAddToARestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const customRequest = req; // For error type at compile time
        const owner = yield Owner.OwnerModel.findById(customRequest.auth._id);
        const restaurant = yield Restaurant.RestaurantModel.findById(owner.restaurantOwn).populate("daysList");
        console.log("printod io bono");
        console.log(restaurant.daysList);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(req.body.date)) {
            return next({ statusCode: 404, error: true, errormessage: "not valid date" });
        }
        const newDate = new Date(req.body.date);
        let alreadyExist = false;
        restaurant.daysList.forEach((item) => {
            item = item;
            if (item.date.getTime() === newDate.getTime()) {
                alreadyExist = true;
            }
        });
        const newDay = new Day.DayModel({
            date: newDate,
            ordersList: [],
            recipeList: [],
            idRestaurant: owner.restaurantOwn
        });
        if (newDay.isValidDate()) {
            if (!alreadyExist) {
                yield newDay.save();
                restaurant.daysList.push(newDay._id);
                yield restaurant.save();
                return res.status(200).json({ valid: true });
            }
            else {
                return next({ statusCode: 404, error: true, errormessage: "Day " + newDay.date + " already present in restaurant:" + restaurant._id });
            }
        }
        else {
            return next({ statusCode: 404, error: true, errormessage: "not valid date" });
        }
    });
}
exports.createDayAndAddToARestaurant = createDayAndAddToARestaurant;
function getDaysListByRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const restaurant = yield Restaurant.RestaurantModel.findById(req.params.idr).populate("daysList");
        if (restaurant) {
            return res.status(200).json(restaurant.daysList);
        }
        else {
            console.log("debugf");
            return next({ statusCode: 404, error: true, errormessage: "not valid restaurant" });
        }
    });
}
exports.getDaysListByRestaurant = getDaysListByRestaurant;
