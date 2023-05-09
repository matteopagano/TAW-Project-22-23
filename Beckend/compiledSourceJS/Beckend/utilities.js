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
exports.deleteEmployeeFromRestaurant = exports.addBartenderToARestaurant = exports.addCashierToARestaurant = exports.addWaiterToARestaurant = exports.addCookToARestaurant = exports.createBartender = exports.createCashier = exports.createWaiter = exports.createCook = exports.generateRandomString = void 0;
const User = __importStar(require("../Model/User"));
const Cook = __importStar(require("../Model/Cook"));
const Waiter = __importStar(require("../Model/Waiter"));
const Cashier = __importStar(require("../Model/Cashier"));
const Bartender = __importStar(require("../Model/Bartender"));
function generateRandomString(n) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < n; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
exports.generateRandomString = generateRandomString;
function createCook(username, email, password, idRestaurant) {
    return __awaiter(this, void 0, void 0, function* () {
        const newCook = new Cook.CookModel({
            username: username,
            email: email,
            role: User.RoleType.COOK,
            dishesCooked: [],
            idRestaurant: idRestaurant
        });
        newCook.setPassword(password);
        return yield newCook.save();
    });
}
exports.createCook = createCook;
function createWaiter(username, email, password, idRestaurant) {
    return __awaiter(this, void 0, void 0, function* () {
        const newWaiter = new Waiter.WaiterModel({
            username: username,
            email: email,
            role: User.RoleType.WAITER,
            ordersTaken: [],
            tablesObservered: [],
            idRestaurant: idRestaurant
        });
        newWaiter.setPassword(password);
        return yield newWaiter.save();
    });
}
exports.createWaiter = createWaiter;
function createCashier(username, email, password, idRestaurant) {
    return __awaiter(this, void 0, void 0, function* () {
        const newCashier = new Cashier.CashierModel({
            username: username,
            email: email,
            role: User.RoleType.CASHIER,
            receiptsPrinted: [],
            idRestaurant: idRestaurant
        });
        newCashier.setPassword(password);
        return yield newCashier.save();
    });
}
exports.createCashier = createCashier;
function createBartender(username, email, password, idRestaurant) {
    return __awaiter(this, void 0, void 0, function* () {
        const newBartender = new Bartender.BartenderModel({
            username: username,
            email: email,
            role: User.RoleType.BARTENDER,
            drinkPrepared: [],
            idRestaurant: idRestaurant
        });
        newBartender.setPassword(password);
        return yield newBartender.save();
    });
}
exports.createBartender = createBartender;
function addCookToARestaurant(user, restaurant) {
    return __awaiter(this, void 0, void 0, function* () {
        restaurant.cookList.push(user._id);
        yield restaurant.save();
    });
}
exports.addCookToARestaurant = addCookToARestaurant;
function addWaiterToARestaurant(user, restaurant) {
    return __awaiter(this, void 0, void 0, function* () {
        restaurant.waiterList.push(user._id);
        yield restaurant.save();
    });
}
exports.addWaiterToARestaurant = addWaiterToARestaurant;
function addCashierToARestaurant(user, restaurant) {
    return __awaiter(this, void 0, void 0, function* () {
        restaurant.cashierList.push(user._id);
        yield restaurant.save();
    });
}
exports.addCashierToARestaurant = addCashierToARestaurant;
function addBartenderToARestaurant(user, restaurant) {
    return __awaiter(this, void 0, void 0, function* () {
        restaurant.bartenderList.push(user._id);
        yield restaurant.save();
    });
}
exports.addBartenderToARestaurant = addBartenderToARestaurant;
function deleteEmployeeFromRestaurant(idUser, idRestaurant) {
    return __awaiter(this, void 0, void 0, function* () {
        /*const restaurantFound : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(idRestaurant.toString())
        const index = restaurantFound.employeesList.indexOf(idUser);
        if (index !== -1) {
          restaurantFound.employeesList.splice(index, 1);
        }
        await restaurantFound.save()
        */
    });
}
exports.deleteEmployeeFromRestaurant = deleteEmployeeFromRestaurant;
