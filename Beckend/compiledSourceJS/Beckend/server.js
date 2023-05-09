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
const Endpoints = __importStar(require("./endpoints"));
const Middlewares = __importStar(require("./middleware"));
const User = __importStar(require("../Model/User"));
const Owner = __importStar(require("../Model/Owner"));
const express = require("express");
let app = express();
const http = require("http");
const bodyParser = require('body-parser');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', Endpoints.root);
app.get('/login', Middlewares.basicAuthentication, Endpoints.login);
app.get('/restaurants/:idr', Middlewares.verifyJWT, Middlewares.isOwner, Middlewares.isOwnerOfThisRestaurant, Endpoints.getRestaurantById);
app.get('/restaurants/:idr/cooks', Middlewares.verifyJWT, Middlewares.isOwner, Middlewares.isOwnerOfThisRestaurant, Endpoints.getCooksByRestaurant);
app.get('/restaurants/:idr/waiters', Middlewares.verifyJWT, Middlewares.isOwner, Middlewares.isOwnerOfThisRestaurant, Endpoints.getWaitersByRestaurant);
app.get('/restaurants/:idr/cashiers', Middlewares.verifyJWT, Middlewares.isOwner, Middlewares.isOwnerOfThisRestaurant, Endpoints.getCashiersByRestaurant);
app.get('/restaurants/:idr/bartenders', Middlewares.verifyJWT, Middlewares.isOwner, Middlewares.isOwnerOfThisRestaurant, Endpoints.getBartenderByRestaurant);
app.post('/restaurants', Middlewares.verifyJWT, Middlewares.isOwner, Middlewares.hasNotAlreadyARestaurant, Endpoints.createRestaurant);
app.post('/restaurants/:idr/cooks', Middlewares.verifyJWT, Middlewares.isOwner, Middlewares.isOwnerOfThisRestaurant, Endpoints.createCookAndAddToARestaurant);
app.post('/restaurants/:idr/waiters', Middlewares.verifyJWT, Middlewares.isOwner, Middlewares.isOwnerOfThisRestaurant, Endpoints.createWaiterAndAddToARestaurant);
app.post('/restaurants/:idr/cashiers', Middlewares.verifyJWT, Middlewares.isOwner, Middlewares.isOwnerOfThisRestaurant, Endpoints.createCashierAndAddToARestaurant);
app.post('/restaurants/:idr/bartenders', Middlewares.verifyJWT, Middlewares.isOwner, Middlewares.isOwnerOfThisRestaurant, Endpoints.createBartenderAndAddToARestaurant);
app.delete('/restaurants/:idr/cooks/:idu', Middlewares.verifyJWT, Middlewares.isOwner, Middlewares.isOwnerOfThisRestaurant, Middlewares.isCookMemberOfThatRestaurant, Endpoints.deleteCookAndRemoveFromRestaurant);
app.delete('/restaurants/:idr/waiters/:idu', Middlewares.verifyJWT, Middlewares.isOwner, Middlewares.isOwnerOfThisRestaurant, Middlewares.isWaiterMemberOfThatRestaurant, Endpoints.deleteWaiterAndRemoveFromRestaurant);
app.delete('/restaurants/:idr/cashiers/:idu', Middlewares.verifyJWT, Middlewares.isOwner, Middlewares.isOwnerOfThisRestaurant, Middlewares.isCashierMemberOfThatRestaurant, Endpoints.deleteCashierAndRemoveFromRestaurant);
app.delete('/restaurants/:idr/bartenders/:idu', Middlewares.verifyJWT, Middlewares.isOwner, Middlewares.isOwnerOfThisRestaurant, Middlewares.isBartenderMemberOfThatRestaurant, Endpoints.deleteBartenderAndRemoveFromRestaurant);
app.post('/restaurants/:idr/days', Middlewares.verifyJWT, Middlewares.isOwner, Middlewares.isOwnerOfThisRestaurant, Endpoints.createDayAndAddToARestaurant);
app.get('/restaurants/:idr/days', Middlewares.verifyJWT, Middlewares.isOwner, Middlewares.isOwnerOfThisRestaurant, Endpoints.getDaysListByRestaurant);
app.use(function (err, req, res, next) {
    console.log("Request error: " + JSON.stringify(err));
    res.status(err.statusCode || 500).json(err);
});
app.use((req, res, next) => {
    res.status(404).json({ statusCode: 404, error: true, errormessage: "Invalid endpoint" });
});
function InitExpressServer() {
    let server = http.createServer(app);
    server.listen(8080, () => console.log("HTTP Server started on port 8080"));
}
mongoose_1.default.connect("mongodb://localhost:27017/MioDB")
    .then(() => {
    console.log("Connesso al database MongoDB");
})
    .catch((error) => {
    console.error("Errore di connessione al database MongoDB:", error);
});
mongoose_1.default.connection.once('open', () => {
    console.log('Connessione al database aperta!');
    User.UserModel.findOne({ username: "matteo Pagano" })
        .then((user) => {
        if (!user) {
            console.log("Utente matteo non trovato");
            const nuovoProprietario = new Owner.OwnerModel({
                username: "matteo Pagano",
                email: "metiupaga8@gmail.com",
                role: User.RoleType.OWNER,
                employeesList: [],
                restaurantOwn: null,
            });
            nuovoProprietario.setPassword("admin");
            return nuovoProprietario.save();
        }
        else {
            console.log("trovato utente matteo");
        }
    })
        .then(() => {
        InitExpressServer();
    });
});
