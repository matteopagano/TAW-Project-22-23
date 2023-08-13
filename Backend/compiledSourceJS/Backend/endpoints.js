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
exports.createRecipeForGroupAndAddToARestaurant = exports.createOrderAndAddToACustomerGroup = exports.removeGroupFromTable = exports.createGroupAndAddToATable = exports.getRecipesByRestaurant = exports.getGroupsByRestaurant = exports.getRecipeByRestaurantAndTable = exports.getOrdersByRestaurantAndTable = exports.getCustomerGroupByRestaurantAndTable = exports.deleteItemAndRemoveFromRestaurant = exports.createItemAndAddToARestaurant = exports.getItemsListByRestaurant = exports.deleteTableAndRemoveFromRestaurant = exports.createTableAndAddToARestaurant = exports.getTablesListByRestaurant = exports.deleteBartenderAndRemoveFromRestaurant = exports.deleteCashierAndRemoveFromRestaurant = exports.deleteWaiterAndRemoveFromRestaurant = exports.deleteCookAndRemoveFromRestaurant = exports.createBartenderAndAddToARestaurant = exports.createCashierAndAddToARestaurant = exports.createWaiterAndAddToARestaurant = exports.createCookAndAddToARestaurant = exports.createRestaurant = exports.getBartenderByRestaurant = exports.getCashiersByRestaurant = exports.getWaitersByRestaurant = exports.getCooksByRestaurant = exports.getRestaurantById = exports.login = exports.root = void 0;
const mongoose_1 = require("mongoose");
const Recipe = __importStar(require("../Model/Recipe"));
const Restaurant = __importStar(require("../Model/Restaurant"));
const Table = __importStar(require("../Model/Table"));
const Item = __importStar(require("../Model/Item"));
const Order = __importStar(require("../Model/Order"));
const User = __importStar(require("../Model/User"));
const Cook = __importStar(require("../Model/Cook"));
const Waiter = __importStar(require("../Model/Waiter"));
const Cashier = __importStar(require("../Model/Cashier"));
const Bartender = __importStar(require("../Model/Bartender"));
const Group = __importStar(require("../Model/Group"));
const jsonwebtoken = require("jsonwebtoken"); //For sign the jwt data
const Owner = __importStar(require("../Model/Owner"));
const Utilities = __importStar(require("./utilities"));
const result = require('dotenv').config({ path: './compiledSourceJS/Backend/.env' });
if (result.error) {
    console.log("Unable to load \".env\" file. Please provide one to store the JWT secret key");
    process.exit(-1);
}
if (!process.env.JWT_SECRET) {
    console.log("\".env\" file find but unable to locate JET_SECRET.");
}
function root(req, res) {
    res.status(200).json({ api_version: "1.0", endpoints: ["/", "login", "/restaurants/:idr", "/restaurants/:idr/employees", "/restaurants", ""] }); // json method sends a JSON response (setting the correct Content-Type) to the client
}
exports.root = root;
function login(req, res, next) {
    // If it's reached this point, req.user has been injected.
    const authenticatedUser = new User.UserModel(req.user);
    console.log(authenticatedUser);
    const token = {
        username: authenticatedUser.username,
        role: authenticatedUser.role,
        email: authenticatedUser.email,
        _id: authenticatedUser._id
    };
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT secret is not defined');
    }
    const options = {
        expiresIn: '5h'
    };
    const tokenSigned = jsonwebtoken.sign(token, secret, options);
    return res.status(200).json({ error: false, errormessage: "", token: tokenSigned });
}
exports.login = login;
function getRestaurantById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idRestorantParameter = req.params.idr;
        const restaurant = yield Restaurant.RestaurantModel.findById(idRestorantParameter);
        if (restaurant) {
            return res.status(200).json({ error: false, errormessage: "", restaurant: restaurant });
        }
        else {
            return next({ statusCode: 404, error: true, errormessage: "Any restaurant found" });
        }
    });
}
exports.getRestaurantById = getRestaurantById;
function getCooksByRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idRistoranteParameter = req.params.idr;
        const restaurant = yield (Restaurant.RestaurantModel.findById(idRistoranteParameter).populate('cookers'));
        if (restaurant) {
            return res.status(200).json({ error: false, errormessage: "", cooks: restaurant.getcookers() });
        }
        else {
            return next({ statusCode: 404, error: true, errormessage: "Any restaurant found" });
        }
    });
}
exports.getCooksByRestaurant = getCooksByRestaurant;
function getWaitersByRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idRistoranteParameter = req.params.idr;
        const restaurant = yield (Restaurant.RestaurantModel.findById(idRistoranteParameter).populate('waiters'));
        if (restaurant) {
            return res.status(200).json({ error: false, errormessage: "", waiters: restaurant.getwaiters() });
        }
        else {
            return next({ statusCode: 404, error: true, errormessage: "Any restaurant found" });
        }
    });
}
exports.getWaitersByRestaurant = getWaitersByRestaurant;
function getCashiersByRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idRistoranteParameter = req.params.idr;
        const restaurant = yield (Restaurant.RestaurantModel.findById(idRistoranteParameter).populate('cashiers'));
        if (restaurant) {
            return res.status(200).json({ error: false, errormessage: "", cashiers: restaurant.getcashiers() });
        }
        else {
            return next({ statusCode: 404, error: true, errormessage: "Any restaurant found" });
        }
    });
}
exports.getCashiersByRestaurant = getCashiersByRestaurant;
function getBartenderByRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idRistoranteParameter = req.params.idr;
        const restaurant = yield Restaurant.RestaurantModel.findById(idRistoranteParameter).populate('bartenders');
        if (restaurant) {
            return res.status(200).json({ error: false, errormessage: "", bartenders: restaurant.getbartenders() });
        }
        else {
            return next({ statusCode: 404, error: true, errormessage: "Any restaurant found" });
        }
    });
}
exports.getBartenderByRestaurant = getBartenderByRestaurant;
function createRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        //If i reached this point all the middleware have done correctly all the input checks and are correct
        const customRequest = req; // For error type at compile time
        const idOwner = customRequest.auth._id;
        const restaurantNameBody = req.body.restaurantName;
        const owner = yield Owner.OwnerModel.findById(idOwner);
        const newRestaurant = Restaurant.newRestaurant(restaurantNameBody, owner);
        owner.setRestaurantOwn(newRestaurant.getId());
        yield owner.save();
        yield newRestaurant.save();
        return res.status(200).json({ error: false, errormessage: "", newRestaurantId: newRestaurant.getId() });
    });
}
exports.createRestaurant = createRestaurant;
function createCookAndAddToARestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const restaurantId = req.params.idr;
        const username = req.body.username;
        const email = req.body.email;
        if (!(yield User.checkNameCorrectness(username)) || !User.checkEmailCorrectness(email)) {
            return next({ statusCode: 404, error: true, errormessage: "Email or password input not valid" });
        }
        const newPassword = Utilities.generateRandomString(8);
        const restaurant = yield Restaurant.RestaurantModel.findById(restaurantId);
        const cook = Cook.createCook(username, email, newPassword, new mongoose_1.Types.ObjectId(restaurantId));
        Restaurant.addCookToARestaurant(cook, restaurant);
        cook.save();
        restaurant.save();
        return res.status(200).json({ error: false, errormessage: "", idNewCook: cook.getId(), usernameNewCook: cook.getUsername(), email: cook.getEmail(), passwordToChange: newPassword });
    });
}
exports.createCookAndAddToARestaurant = createCookAndAddToARestaurant;
function createWaiterAndAddToARestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const restaurantId = req.params.idr;
        const username = req.body.username;
        const email = req.body.email;
        if (!(yield User.checkNameCorrectness(username)) || !User.checkEmailCorrectness(email)) {
            return next({ statusCode: 404, error: true, errormessage: "Email or password input not valid" });
        }
        const newPassword = Utilities.generateRandomString(8);
        const restaurant = yield Restaurant.RestaurantModel.findById(restaurantId);
        const waiter = Waiter.createWaiter(username, email, newPassword, new mongoose_1.Types.ObjectId(restaurantId));
        Restaurant.addWaiterToARestaurant(waiter, restaurant);
        yield waiter.save();
        yield restaurant.save();
        return res.status(200).json({ error: false, errormessage: "", idNewWaiter: waiter.getId(), usernameNewWaiter: waiter.getUsername(), emailNewWaiter: waiter.getEmail(), passwordToChange: newPassword });
    });
}
exports.createWaiterAndAddToARestaurant = createWaiterAndAddToARestaurant;
function createCashierAndAddToARestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const restaurantId = req.params.idr;
        const username = req.body.username;
        const email = req.body.email;
        if (!(yield User.checkNameCorrectness(username)) || !User.checkEmailCorrectness(email)) {
            return next({ statusCode: 404, error: true, errormessage: "Email or password input not valid" });
        }
        const newPassword = Utilities.generateRandomString(8);
        const restaurant = yield Restaurant.RestaurantModel.findById(restaurantId);
        const cashier = Cashier.createCashier(username, email, newPassword, new mongoose_1.Types.ObjectId(restaurantId));
        Restaurant.addCashierToARestaurant(cashier, restaurant);
        yield cashier.save();
        yield restaurant.save();
        return res.status(200).json({ error: false, errormessage: "", idNewCashier: cashier.getId(), usernameNewCashier: cashier.getUsername(), emailnewCashier: cashier.getEmail(), passwordToChange: newPassword });
    });
}
exports.createCashierAndAddToARestaurant = createCashierAndAddToARestaurant;
function createBartenderAndAddToARestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const customRequest = req; // For error type at compile time
        const idOwner = customRequest.auth._id;
        const restaurantId = req.params.idr;
        const username = req.body.username;
        const email = req.body.email;
        if (!(yield User.checkNameCorrectness(username)) || !User.checkEmailCorrectness(email)) {
            return next({ statusCode: 404, error: true, errormessage: "Email or password input not valid" });
        }
        const newPassword = Utilities.generateRandomString(8);
        const restaurant = yield Restaurant.RestaurantModel.findById(restaurantId);
        const bartender = Bartender.createBartender(username, email, newPassword, new mongoose_1.Types.ObjectId(restaurantId));
        Restaurant.addBartenderToARestaurant(bartender, restaurant);
        yield bartender.save();
        yield restaurant.save();
        return res.status(200).json({ error: false, errormessage: "", idNewBartender: bartender.getId(), usernameNewBartender: bartender.getUsername(), emailNewBartender: bartender.getEmail(), passwordToChange: newPassword });
    });
}
exports.createBartenderAndAddToARestaurant = createBartenderAndAddToARestaurant;
function deleteCookAndRemoveFromRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idRestaurant = req.params.idr;
        const idCook = req.params.idu;
        const restaurant = yield Restaurant.RestaurantModel.findById(idRestaurant);
        if (restaurant.removeCook(idCook)) {
            yield restaurant.save();
            yield Cook.CookModel.deleteOne({ _id: idCook });
            return res.status(200).json({ error: false, errormessage: "", idCookDeleted: idCook });
        }
        else {
            return next({ statusCode: 404, error: true, errormessage: "Cook not deleted" });
        }
    });
}
exports.deleteCookAndRemoveFromRestaurant = deleteCookAndRemoveFromRestaurant;
function deleteWaiterAndRemoveFromRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idRestaurant = req.params.idr;
        const idWaiter = req.params.idu;
        const restaurant = yield Restaurant.RestaurantModel.findById(idRestaurant);
        if (restaurant.removeWaiter(idWaiter)) {
            yield restaurant.save();
            yield Waiter.WaiterModel.deleteOne({ _id: idWaiter });
            return res.status(200).json({ error: false, errormessage: "", idWaiterDeleted: idWaiter });
        }
        else {
            return next({ statusCode: 404, error: true, errormessage: "waiter not deleted" });
        }
    });
}
exports.deleteWaiterAndRemoveFromRestaurant = deleteWaiterAndRemoveFromRestaurant;
function deleteCashierAndRemoveFromRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idRestaurant = req.params.idr;
        const idCashier = req.params.idu;
        const restaurant = yield Restaurant.RestaurantModel.findById(idRestaurant);
        if (restaurant.removeCashier(idCashier)) {
            yield restaurant.save();
            yield Cashier.CashierModel.deleteOne({ _id: idCashier });
            return res.status(200).json({ error: false, errormessage: "", idCashierDeleted: idCashier });
        }
        else {
            return next({ statusCode: 404, error: true, errormessage: "cashier not deleted" });
        }
    });
}
exports.deleteCashierAndRemoveFromRestaurant = deleteCashierAndRemoveFromRestaurant;
function deleteBartenderAndRemoveFromRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idRestaurant = req.params.idr;
        const idBartender = req.params.idu;
        const restaurant = yield Restaurant.RestaurantModel.findById(idRestaurant);
        if (restaurant.removeBartender(idBartender)) {
            yield restaurant.save();
            yield Bartender.BartenderModel.deleteOne({ _id: idBartender });
            return res.status(200).json({ error: false, errormessage: "", idBartenderDeleted: idBartender });
        }
        else {
            return next({ statusCode: 404, error: true, errormessage: "bartender not deleted" });
        }
    });
}
exports.deleteBartenderAndRemoveFromRestaurant = deleteBartenderAndRemoveFromRestaurant;
function getTablesListByRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idRestaurant = req.params.idr;
        const restaurant = yield Restaurant.RestaurantModel.findById(idRestaurant).populate("tables");
        if (restaurant) {
            return res.status(200).json({ error: false, errormessage: "", tables: restaurant.tables });
        }
        else {
            return next({ statusCode: 404, error: true, errormessage: "not valid restaurant" });
        }
    });
}
exports.getTablesListByRestaurant = getTablesListByRestaurant;
function createTableAndAddToARestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idRestaurant = req.params.idr;
        const tableNumber = req.body.tableNumber;
        const maxSeats = req.body.maxSeats;
        const restaurant = yield Restaurant.RestaurantModel.findById(idRestaurant);
        const newTable = Table.createTable(tableNumber, maxSeats, new mongoose_1.Types.ObjectId(idRestaurant));
        Restaurant.addTableToARestaurant(newTable, restaurant);
        yield newTable.save();
        yield restaurant.save();
        return res.status(200).json({ error: false, errormessage: "", table: newTable });
    });
}
exports.createTableAndAddToARestaurant = createTableAndAddToARestaurant;
function deleteTableAndRemoveFromRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idRestaurant = req.params.idr;
        const idTable = req.params.idt;
        const restaurant = yield Restaurant.RestaurantModel.findById(idRestaurant);
        if (restaurant.removeTable(idTable)) {
            yield restaurant.save();
            yield Table.TableModel.deleteOne({ _id: idTable });
            return res.status(200).json({ error: false, errormessage: "", idTableDeleted: idTable });
        }
        else {
            return next({ statusCode: 404, error: true, errormessage: "table not deleted" });
        }
    });
}
exports.deleteTableAndRemoveFromRestaurant = deleteTableAndRemoveFromRestaurant;
function getItemsListByRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idRestaurant = req.params.idr;
        const restaurant = yield Restaurant.RestaurantModel.findById(idRestaurant).populate("items");
        if (restaurant) {
            return res.status(200).json({ error: false, errormessage: "", tables: restaurant.items });
        }
        else {
            return next({ statusCode: 404, error: true, errormessage: "not valid restaurant" });
        }
    });
}
exports.getItemsListByRestaurant = getItemsListByRestaurant;
function createItemAndAddToARestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idRestaurant = req.params.idr;
        const itemName = req.body.itemName;
        const itemType = req.body.itemType;
        const price = req.body.price;
        const preparationTime = req.body.preparationTime;
        switch (itemType) {
            case 'drink':
                break;
            case 'dish':
                break;
            default:
                next({ statusCode: 404, error: true, errormessage: "Item type " + itemType + " is not correct, please select itemtype from [dish, drink] " });
        }
        const restaurant = yield Restaurant.RestaurantModel.findById(idRestaurant);
        const newItem = Item.createItem(itemName, itemType, price, preparationTime, new mongoose_1.Types.ObjectId(idRestaurant));
        Restaurant.addItemToARestaurant(newItem, restaurant);
        yield newItem.save();
        yield restaurant.save();
        return res.status(200).json({ error: false, errormessage: "", newItem: newItem });
    });
}
exports.createItemAndAddToARestaurant = createItemAndAddToARestaurant;
function deleteItemAndRemoveFromRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idRestaurant = req.params.idr;
        const idItem = req.params.idi;
        const restaurant = yield Restaurant.RestaurantModel.findById(idRestaurant);
        if (restaurant.removeItem(idItem)) {
            yield restaurant.save();
            yield Item.ItemModel.deleteOne({ _id: idItem });
            return res.status(200).json({ error: false, errormessage: "", idItemDeleted: idItem });
        }
        else {
            return next({ statusCode: 404, error: true, errormessage: "item not deleted" });
        }
    });
}
exports.deleteItemAndRemoveFromRestaurant = deleteItemAndRemoveFromRestaurant;
function getCustomerGroupByRestaurantAndTable(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idtable = req.params.idt;
        const table = yield Table.TableModel.findById(idtable).populate("group");
        if (table) {
            return res.status(200).json({ error: false, errormessage: "", group: table.group });
        }
        else {
            return next({ statusCode: 404, error: true, errormessage: "not valid table" });
        }
    });
}
exports.getCustomerGroupByRestaurantAndTable = getCustomerGroupByRestaurantAndTable;
function getOrdersByRestaurantAndTable(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idtable = req.params.idt;
        const table = yield Table.TableModel.findById(idtable);
        const group = yield Group.GroupModel.findById(table.group).populate("ordersList");
        if (group) {
            return res.status(200).json({ error: false, errormessage: "", orders: group.ordersList });
        }
        else {
            return next({ statusCode: 404, error: true, errormessage: "not valid group" });
        }
    });
}
exports.getOrdersByRestaurantAndTable = getOrdersByRestaurantAndTable;
function getRecipeByRestaurantAndTable(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idtable = req.params.idt;
        const table = yield Table.TableModel.findById(idtable).populate("group");
        const group = yield Group.GroupModel.findById(table.group).populate("idRecipe");
        if (table) {
            return res.status(200).json({ error: false, errormessage: "", recipe: group.idRecipe });
        }
        else {
            return next({ statusCode: 404, error: true, errormessage: "not valid table" });
        }
    });
}
exports.getRecipeByRestaurantAndTable = getRecipeByRestaurantAndTable;
function getGroupsByRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idRestaurant = req.params.idr;
        const restaurant = yield Restaurant.RestaurantModel.findById(idRestaurant).populate("groups");
        if (restaurant) {
            return res.status(200).json({ error: false, errormessage: "", groups: restaurant.groups });
        }
        else {
            return next({ statusCode: 404, error: true, errormessage: "restaurant doesn't exist" });
        }
    });
}
exports.getGroupsByRestaurant = getGroupsByRestaurant;
function getRecipesByRestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idRestaurant = req.params.idr;
        const restaurant = yield Restaurant.RestaurantModel.findById(idRestaurant).populate("recipes");
        if (restaurant) {
            return res.status(200).json({ error: false, errormessage: "", recipes: restaurant.recipes });
        }
        else {
            return next({ statusCode: 404, error: true, errormessage: "restaurant doesn't exist" });
        }
    });
}
exports.getRecipesByRestaurant = getRecipesByRestaurant;
function createGroupAndAddToATable(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idRestaurant = req.params.idr;
        const idTable = req.params.idt;
        const NumberOfPerson = req.body.numberOfPerson;
        const restaurant = yield Restaurant.RestaurantModel.findById(idRestaurant);
        const table = yield Table.TableModel.findById(idTable);
        //Restaurant.RestaurantModel.updateOne({ _id: documentoId }, { $set: { nome: nuovoValoreProprieta } })
        const newGroup = Group.createGroup(NumberOfPerson, new mongoose_1.Types.ObjectId(idTable), new mongoose_1.Types.ObjectId(idRestaurant));
        Restaurant.addGroupToARestaurant(newGroup, restaurant);
        Table.addGroupToATable(newGroup, table);
        yield newGroup.save();
        yield restaurant.save();
        yield table.save();
        return res.status(200).json({ error: false, errormessage: "", newGroup: newGroup });
    });
}
exports.createGroupAndAddToATable = createGroupAndAddToATable;
function removeGroupFromTable(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idTable = req.params.idt;
        const table = yield Table.TableModel.findById(idTable);
        const group = yield Group.GroupModel.findById(table.group);
        Table.removeGroupFromTable(table);
        const date = new Date();
        console.log(date);
        group.dateFinish = date;
        console.log("ciao 1");
        group.idTable = null;
        console.log("ciao 2");
        yield group.save();
        yield table.save();
        return res.status(200).json({ error: false, errormessage: "", newGroup: table });
    });
}
exports.removeGroupFromTable = removeGroupFromTable;
function createOrderAndAddToACustomerGroup(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idCustomerGroup = req.params.idc;
        const idWaiterAuthenticated = req.auth._id;
        const itemsList = req.body.items;
        const customerGroup = yield Group.GroupModel.findById(idCustomerGroup);
        const waiter = yield Waiter.WaiterModel.findById(idWaiterAuthenticated);
        const newOrder = Order.createOrder(new mongoose_1.Types.ObjectId(idCustomerGroup), new mongoose_1.Types.ObjectId(idWaiterAuthenticated), itemsList);
        Waiter.addOrderAwaited(newOrder, waiter);
        Group.addOrder(newOrder, customerGroup);
        waiter.save();
        newOrder.save();
        customerGroup.save();
        return res.status(200).json({ error: false, errormessage: "", newOrder: newOrder });
    });
}
exports.createOrderAndAddToACustomerGroup = createOrderAndAddToACustomerGroup;
function createRecipeForGroupAndAddToARestaurant(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idTable = req.params.idt;
        const idRestaurant = req.params.idr;
        const idCashierAuthenticated = req.auth._id;
        const restaurant = yield Restaurant.RestaurantModel.findById(idRestaurant);
        const cashier = yield Cashier.CashierModel.findById(idCashierAuthenticated);
        const table = yield Table.TableModel.findById(idTable);
        const orderList = yield (yield Group.GroupModel.findById(table.group).populate("ordersList")).ordersList;
        console.log(orderList);
        const group = yield Group.GroupModel.findById(table.group.toString());
        const newRecipe = yield Recipe.createRecipe(new mongoose_1.Types.ObjectId(idCashierAuthenticated), new mongoose_1.Types.ObjectId(table.group.toString()), new mongoose_1.Types.ObjectId(idRestaurant), orderList);
        Restaurant.addRecipeToRestaurant(newRecipe, restaurant);
        Group.addRecipeToGroup(newRecipe, group);
        Cashier.addRecipe(newRecipe, cashier);
        newRecipe.save();
        restaurant.save();
        group.save();
        cashier.save();
        return res.status(200).json({ error: false, errormessage: "", newRecipe: newRecipe });
    });
}
exports.createRecipeForGroupAndAddToARestaurant = createRecipeForGroupAndAddToARestaurant;
