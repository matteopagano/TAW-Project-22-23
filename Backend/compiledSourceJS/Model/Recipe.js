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
exports.RecipeModel = exports.createRecipe = exports.StateItem = void 0;
const mongoose_1 = require("mongoose");
const Order = __importStar(require("./Order"));
const Item = __importStar(require("./Item"));
const recipeSchema = new mongoose_1.Schema({
    costAmount: {
        type: mongoose_1.Schema.Types.Number,
        required: true,
    },
    dateOfPrinting: {
        type: mongoose_1.Schema.Types.Date,
        required: true,
    },
    idGroup: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Group",
    },
    idCashier: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Cashier",
    },
    itemsBought: {
        type: [
            {
                quantity: { type: mongoose_1.Schema.Types.Number, required: true },
                _id: { type: mongoose_1.Schema.Types.ObjectId, ref: "Item", required: true },
            },
        ],
        required: true,
    },
});
var StateItem;
(function (StateItem) {
    StateItem["COMPLETED"] = "completed";
    StateItem["NOTCOMPLETED"] = "notcompleted";
})(StateItem || (exports.StateItem = StateItem = {}));
function createRecipe(idCashier, idGroup, idRestaurant, orderList) {
    return __awaiter(this, void 0, void 0, function* () {
        const itemsMap = new Map();
        var sumTotal = 0;
        function calculateTotal() {
            return __awaiter(this, void 0, void 0, function* () {
                for (const order of orderList) {
                    const populatedOrder = (yield Order.OrderModel.findById(order._id).populate("items")).items;
                    for (const item of populatedOrder) {
                        const idItem = item.idItem;
                        const quantity = item.count;
                        const existingItem = itemsMap.get(idItem.toString());
                        if (existingItem) {
                            existingItem.quantity += quantity;
                        }
                        else {
                            const newItem = {
                                _id: idItem,
                                quantity,
                            };
                            itemsMap.set(idItem.toString(), newItem);
                        }
                    }
                    var sumOrder = 0;
                    for (const item of populatedOrder) {
                        const priceItem = (yield Item.ItemModel.findById(item.idItem.toString())).price;
                        sumOrder += priceItem * item.count;
                    }
                    sumTotal += sumOrder;
                }
            });
        }
        yield calculateTotal().catch((error) => {
            console.error(error);
        });
        const itemsForTable = Array.from(itemsMap.values());
        const newRecipe = new exports.RecipeModel({
            costAmount: sumTotal,
            dateOfPrinting: new Date(),
            idGroup: idGroup,
            idCashier: idCashier,
            idRestaurant: idRestaurant,
            itemsBought: itemsForTable,
        });
        return newRecipe;
    });
}
exports.createRecipe = createRecipe;
exports.RecipeModel = (0, mongoose_1.model)("Recipe", recipeSchema);
