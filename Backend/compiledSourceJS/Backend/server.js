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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.http = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const EP = __importStar(require("./endpoints"));
const MW = __importStar(require("./middleware"));
const Owner = __importStar(require("../Model/Owner"));
const cors = require('cors');
const express = require("express");
const socketIo = require('socket.io');
let app = express();
app.use(cors());
exports.http = require('http');
const bodyParser = require('body-parser');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', EP.root);
app.get('/login', MW.basicAuthentication, EP.login);
// USERS ENDPOINTS
app.get('/restaurants/:idr', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, EP.getRestaurantById);
app.get('/restaurants/:idr/cooks', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, EP.getCooksByRestaurant);
app.get('/restaurants/:idr/waiters', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, EP.getWaitersByRestaurant);
app.get('/restaurants/:idr/cashiers', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, EP.getCashiersByRestaurant);
app.get('/restaurants/:idr/bartenders', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, EP.getBartenderByRestaurant);
app.post('/restaurants', MW.verifyJWT, MW.isValidRestaurantInput, MW.isOwner, MW.hasNotAlreadyARestaurant, EP.createRestaurant);
app.post('/restaurants/:idr/cooks', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isUserAlreadyExist, EP.createCookAndAddToARestaurant);
app.post('/restaurants/:idr/waiters', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isUserAlreadyExist, EP.createWaiterAndAddToARestaurant);
app.post('/restaurants/:idr/cashiers', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isUserAlreadyExist, EP.createCashierAndAddToARestaurant);
app.post('/restaurants/:idr/bartenders', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isUserAlreadyExist, EP.createBartenderAndAddToARestaurant);
app.delete('/restaurants/:idr/cooks/:idu', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isCookMemberOfThatRestaurant, EP.deleteCookAndRemoveFromRestaurant);
app.delete('/restaurants/:idr/waiters/:idu', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isWaiterMemberOfThatRestaurant, EP.deleteWaiterAndRemoveFromRestaurant);
app.delete('/restaurants/:idr/cashiers/:idu', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isCashierMemberOfThatRestaurant, EP.deleteCashierAndRemoveFromRestaurant);
app.delete('/restaurants/:idr/bartenders/:idu', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isBartenderMemberOfThatRestaurant, EP.deleteBartenderAndRemoveFromRestaurant);
// TABLES ENDPOINTS
app.get('/restaurants/:idr/tables', MW.verifyJWT, MW.isOwnerOrCashierOrWaiter, MW.isWorkerOfThisRestaurant, EP.getTablesListByRestaurant);
app.post('/restaurants/:idr/tables', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isTableAlreadyExist, EP.createTableAndAddToARestaurant);
app.delete('/restaurants/:idr/tables/:idt', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isTableOfThatRestaurant, EP.deleteTableAndRemoveFromRestaurant);
// ITEMS ENDPOINTS
app.get('/restaurants/:idr/items', MW.verifyJWT, MW.isOwnerOrCashierOrWaiter, MW.isWorkerOfThisRestaurant, EP.getItemsListByRestaurant);
app.post('/restaurants/:idr/items', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isItemAlreadyExist, EP.createItemAndAddToARestaurant);
app.delete('/restaurants/:idr/items/:idi', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isItemOfThatRestaurant, EP.deleteItemAndRemoveFromRestaurant);
// CUSTOMERGROUP ENDPOINTS
app.get('/restaurants/:idr/tables/:idt/group', MW.verifyJWT, MW.isOwnerOrCashierOrWaiter, MW.isWorkerOfThisRestaurant, MW.isTableOfThatRestaurant, EP.getCustomerGroupByRestaurantAndTable);
app.post('/restaurants/:idr/tables/:idt/group', MW.verifyJWT, MW.isWaiter, MW.isWorkerOfThisRestaurant, MW.isTableOfThatRestaurant, MW.isTableEmpty, EP.createGroupAndAddToATable);
app.delete('/restaurants/:idr/tables/:idt/group', MW.verifyJWT, MW.isCashier, MW.isWorkerOfThisRestaurant, MW.isTableOfThatRestaurant, MW.tableHasAGroup, EP.removeGroupFromTable);
app.get('/restaurants/:idr/groups', MW.verifyJWT, EP.getGroupsByRestaurant);
// ORDERS ENDPOINTS
app.get('/restaurants/:idr/tables/:idt/group/orders', MW.verifyJWT, MW.isCashier, MW.isWorkerOfThisRestaurant, MW.isTableOfThatRestaurant, MW.tableHasAGroup, EP.getOrdersByRestaurantAndTable);
app.post('/restaurants/:idr/tables/:idt/group/orders', MW.verifyJWT, MW.isWaiter, MW.isWorkerOfThisRestaurant, MW.isTableOfThatRestaurant, MW.tableHasAGroup, EP.createOrderAndAddToACustomerGroup);
// RECIPES ENDPOINTS
app.get('/restaurants/:idr/tables/:idt/group/recipe', MW.verifyJWT, MW.isCashier, MW.isWorkerOfThisRestaurant, MW.isTableOfThatRestaurant, MW.tableHasAGroup, MW.groupHasARecipe, EP.getRecipeByRestaurantAndTable);
app.post('/restaurants/:idr/tables/:idt/group/recipe', MW.verifyJWT, MW.isCashier, MW.isWorkerOfThisRestaurant, MW.isTableOfThatRestaurant, MW.tableHasAGroup, MW.groupHasNotARecipeYet, EP.createRecipeForGroupAndAddToARestaurant);
app.get('/restaurants/:idr/recipes', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, EP.getRecipesByRestaurant); // For visualizing all the recipes
app.use(function (err, req, res, next) {
    console.log("Request error: " + JSON.stringify(err));
    res.status(err.statusCode || 500).json(err);
});
app.use((req, res, next) => {
    res.status(404).json({ statusCode: 404, error: true, errormessage: "Invalid endpoint" });
});
function InitExpressServer() {
    let server = exports.http.createServer(app);
    const io = socketIo(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    io.on('connection', (socket) => {
        console.log('Nuova connessione socket:', socket.id);
        // Gestisci l'evento di join stanza
        socket.on('join-room', (room) => {
            socket.join(room); // Il socket entra nella stanza con l'ID del ristorante
            console.log(`Socket ${socket.id} si è unito alla stanza ${room}`);
        });
        socket.on('fetchTable', (room) => {
            console.log("iviato");
            io.to(room).emit('fetchTableNeeded');
        });
        socket.on('fetchItems', (room) => {
            console.log("iviato");
            io.to(room).emit('fetchItemsNeeded');
        });
        socket.on('fetchGroups', (room) => {
            console.log("iviato");
            io.to(room).emit('fetchGroupsNeeded');
        });
        socket.on('fetchRecipes', (room) => {
            console.log("iviato");
            io.to(room).emit('fetchRecipesNeeded');
        });
        // Altri gestori di eventi possono essere aggiunti qui
        // Esempio di come inviare un messaggio a una stanza specifica
        // socket.to(room).emit('nome-evento', dati);
        // Disconnessione
        socket.on('disconnect', () => {
            console.log(`Socket ${socket.id} si è disconnesso`);
        });
    });
    server.listen(3000, () => console.log("HTTP Server started on port 3000"));
}
mongoose_1.default.connect("mongodb://mongodb:27017/MioDB")
    .then(() => {
    console.log("Connesso al database MongoDB");
})
    .catch((error) => {
    console.error("Errore di connessione al database MongoDB:", error);
});
mongoose_1.default.connection.once('open', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Connessione al database aperta!');
    const admin = yield Owner.OwnerModel.findOne({ username: "matteo Pagano" });
    if (!admin) {
        console.log("Utente matteo non trovato");
        const newAdmin = new Owner.OwnerModel({
            username: "matteo Pagano",
            email: "metiupaga8@gmail.com",
            restaurantOwn: null,
        });
        newAdmin.setPassword("admin");
        yield newAdmin.save();
    }
    else {
        console.log("trovato utente matteo");
    }
    InitExpressServer();
}));
