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
//ENDPOINTS
const endpoints_1 = require("./endpoints");
const User = __importStar(require("../Model/User"));
const express = require("express");
let app = express();
const http = require("http");
app.use(express.json());
app.get('/', endpoints_1.root);
app.post('/owner', endpoints_1.postOwner);
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
    // To start an HTTPS server we create an https.Server instance 
    // passing the express application middleware. Then, we start listening
    // on port 8443
    //
    /*
    https.createServer({
      key: fs.readFileSync('keys/key.pem'),
      cert: fs.readFileSync('keys/cert.pem')
    }, app).listen(8443);
    */
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
    User.UserModel.findOne({ username: "matteo Pagano" }).exec()
        .then((user) => {
        if (!user) {
            console.log("Utente matteo non trovato");
            const nuovoProprietario = new User.OwnerModel({
                username: "matteo Pagano",
                email: "metiupaga8@gmail.com",
                digest: "prova",
                role: User.RoleType.OWNER,
                salt: "saleprova",
                employeesList: [],
                restaurantOwn: null,
            });
            nuovoProprietario.save();
        }
        else {
            console.log("trovato utente matteo");
        }
    })
        .then(() => {
        InitExpressServer();
    });
});
console.log("hellop world");
