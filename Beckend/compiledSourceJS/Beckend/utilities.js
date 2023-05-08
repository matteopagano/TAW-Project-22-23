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
exports.addEmployeeToARestaurant = exports.createCook = exports.generateRandomString = void 0;
const Cook = __importStar(require("../Model/Cook"));
const User = __importStar(require("../Model/User"));
const Restaurant = __importStar(require("../Model/Restaurant"));
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
    const newCook = new Cook.CookModel({
        username: username,
        email: email,
        role: User.RoleType.COOK,
        dishesCooked: [],
        idRestaurant: idRestaurant
    });
    newCook.setPassword(password);
    return newCook.save();
}
exports.createCook = createCook;
function addEmployeeToARestaurant(idUser, idRestaurant) {
    return __awaiter(this, void 0, void 0, function* () {
        const restaurantFound = yield Restaurant.RestaurantModel.findById(idRestaurant.toString());
        restaurantFound.employeesList.push(idUser);
        yield restaurantFound.save();
    });
}
exports.addEmployeeToARestaurant = addEmployeeToARestaurant;
