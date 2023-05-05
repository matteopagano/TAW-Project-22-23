"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UsersSchema_1 = require("../Model/UsersSchema");
const Item_1 = require("../Model/Item");
mongoose_1.default.connect("mongodb://localhost:27017/MioDB")
    .then(() => {
    console.log("Connesso al database MongoDB");
})
    .catch((error) => {
    console.error("Errore di connessione al database MongoDB:", error);
});
mongoose_1.default.connection.once('open', () => {
    const newChef = new UsersSchema_1.Chef({
        name: 'Mario Rossi',
        email: 'mario.rossi@example.com',
        role: 'chef',
        specialty: 'cucina italiana',
    });
    const newWaiter = new UsersSchema_1.Waiter({
        name: 'Maria Bianchi',
        email: 'maria.bianchi@example.com',
        role: 'waiter',
        shift: 'sera',
    });
    const newItem1 = new Item_1.ItemModel({
        name: "Carbonara",
        price: 101,
        type: 'Drink',
        allergenes: [],
        idRestaurant: "ciao"
    });
    const save1 = newChef.save();
    const save2 = newWaiter.save();
    newItem1.save();
    console.log('Connessione al database aperta!');
});
console.log("hellop world");
