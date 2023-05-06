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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User = __importStar(require("../Model/User"));
const Item_1 = require("../Model/Item");
mongoose_1.default.connect("mongodb://localhost:27017/MioDB")
    .then(() => {
    console.log("Connesso al database MongoDB");
})
    .catch((error) => {
    console.error("Errore di connessione al database MongoDB:", error);
});
mongoose_1.default.connection.once('open', () => {
    const newItem1 = new Item_1.ItemModel({
        name: "Carbonara",
        price: 101,
        type: 'Drink',
        allergenes: [],
        idRestaurant: "ciao"
    });
    newItem1.save();
    const newWaiter = new User.WaiterModel({
        digest: 'Prova',
        email: 'prova',
        role: User.Role.WAITER,
        idRestaurant: 'prova',
        ordersTaken: [{ idOrder: 'prova' }],
        tablesObservered: [{ idTable: 'prova' }],
    });
    newWaiter.save()
        .then(result => console.log("inserito waiter"))
        .catch(error => console.log(error));
    console.log('Connessione al database aperta!');
});
console.log("hellop world");
