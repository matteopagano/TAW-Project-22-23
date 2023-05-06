"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../Model/User");
mongoose_1.default.connect("mongodb://localhost:27017/MioDB")
    .then(() => {
    console.log("Connesso al database MongoDB");
})
    .catch((error) => {
    console.error("Errore di connessione al database MongoDB:", error);
});
mongoose_1.default.connection.once('open', () => {
    const nuovoProprietario = new User_1.OwnerModel({
        username: "matteo Pagano",
        email: "metiupaga8@gmail.com",
        digest: "prova",
        role: User_1.RoleType.OWNER,
        salt: "saleprova",
        employeesList: [],
        restaurantOwn: null,
    });
    nuovoProprietario.save()
        .then(() => {
        return User_1.OwnerModel.findOne({ email: "metiupaga8@gmail.com" });
    })
        .then((u) => { console.log(u.email); });
    console.log('Connessione al database aperta!');
});
console.log("hellop world");
