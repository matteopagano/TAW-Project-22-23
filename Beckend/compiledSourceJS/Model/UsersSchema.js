"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Waiter = exports.Chef = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Definizione dello schema principale per gli utenti
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
});
// Definizione dello schema per i cuochi
const chefSchema = new mongoose_1.default.Schema({
    specialty: { type: String, required: true },
});
// Definizione dello schema per le cameriere
const waiterSchema = new mongoose_1.default.Schema({
    shift: { type: String, required: true },
});
// Creazione del modello principale utente
const User = mongoose_1.default.model('User', userSchema);
exports.User = User;
//Il metodo discriminator() di Mongoose consente di definire sotto-schemi che ereditano dallo schema padre.
// Creazione del modello per i cuochi che estende lo schema principale utente
const Chef = User.discriminator('Chef', chefSchema);
exports.Chef = Chef;
// Creazione del modello per le cameriere che estende lo schema principale utente
const Waiter = User.discriminator('Waiter', waiterSchema);
exports.Waiter = Waiter;
