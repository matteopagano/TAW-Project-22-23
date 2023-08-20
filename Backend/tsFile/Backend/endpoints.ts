

import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import {OrderModel} from '../Model/Order';
import * as Recipe from '../Model/Recipe';
import * as Restaurant from '../Model/Restaurant';
import * as Table from '../Model/Table';
import * as Item from '../Model/Item';
import * as Order from '../Model/Order';

import * as User from '../Model/User';
import * as Cook from '../Model/Cook';
import * as Waiter from '../Model/Waiter';
import * as Cashier from '../Model/Cashier';
import * as Bartender from '../Model/Bartender';
import * as Group from '../Model/Group';

import { Schema, model, Document} from 'mongoose';
import jsonwebtoken = require('jsonwebtoken'); //For sign the jwt data
import * as Owner from '../Model/Owner';
import * as Utilities from './utilities';


const result = require('dotenv').config({ path: './compiledSourceJS/Backend/.env' })

if (result.error) {
    console.log("Unable to load \".env\" file. Please provide one to store the JWT secret key");
    process.exit(-1);
    
}

if( !process.env.JWT_SECRET ) {
    console.log("\".env\" file find but unable to locate JET_SECRET.");
}

export function root(req : Request, res : Response) : void {
    res.status(200).json( { api_version: "1.0", endpoints: [ "/", "login", "/restaurants/:idr", "/restaurants/:idr/employees", "/restaurants", "" ] } ); // json method sends a JSON response (setting the correct Content-Type) to the client
}

export function login(req : Request, res : Response, next : NextFunction) {
    // If it's reached this point, req.user has been injected.


    const authenticatedUser : any = new User.UserModel(req.user);


    var token

    if(authenticatedUser.role === 'owner'){
        token = {
            restaurantId : authenticatedUser.restaurantOwn,
            username: authenticatedUser.username,
            role: authenticatedUser.role,
            email: authenticatedUser.email,
            _id: authenticatedUser._id
        }
    }else{
        token = {
            restaurantId : authenticatedUser.idRestaurant,
            username: authenticatedUser.username,
            role: authenticatedUser.role,
            email: authenticatedUser.email,
            _id: authenticatedUser._id
        }
    }

    

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT secret is not defined');
    }
    
    const options = {
        expiresIn: '5h'
    }
    const tokenSigned = jsonwebtoken.sign(token, secret, options);

    return res.status(200).json( {error:false, errormessage:"", token: tokenSigned} );
}

export async function getRestaurantById(req : Request, res : Response , next : NextFunction ){
    const idRestorantParameter = req.params.idr ;
    const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(idRestorantParameter)
        
    if(restaurant){
        return res.status(200).json({error: false, errormessage: "", restaurant : restaurant})
    }else{
        return next({statusCode:404, error: true, errormessage: "Any restaurant found"})
    }
}

export async function getCooksByRestaurant(req : Request, res : Response , next : NextFunction ){
    const idRistoranteParameter = req.params.idr ;
    const restaurant : Restaurant.Restaurant = await (Restaurant.RestaurantModel.findById(idRistoranteParameter).populate('cookers'))

    if(restaurant){
        return res.status(200).json({error: false, errormessage: "", cooks : restaurant.getcookers()})
    }else{
        return next({statusCode:404, error: true, errormessage: "Any restaurant found"})
    }
}

export async function getWaitersByRestaurant(req : Request, res : Response , next : NextFunction ){
    const idRistoranteParameter = req.params.idr ;
    const restaurant : Restaurant.Restaurant = await (Restaurant.RestaurantModel.findById(idRistoranteParameter).populate('waiters'))

    if(restaurant){
        return res.status(200).json({error: false, errormessage: "", waiters : restaurant.getwaiters()})
    }else{
        return next({statusCode:404, error: true, errormessage: "Any restaurant found"})
    }
    
}
export async function getCashiersByRestaurant(req : Request, res : Response , next : NextFunction ){
    const idRistoranteParameter = req.params.idr ;
    const restaurant : Restaurant.Restaurant = await (Restaurant.RestaurantModel.findById(idRistoranteParameter).populate('cashiers'))
    
    if(restaurant){
        return res.status(200).json({error: false, errormessage: "", cashiers : restaurant.getcashiers()})
    }else{
        return next({statusCode:404, error: true, errormessage: "Any restaurant found"})
    }
}
export async function getBartenderByRestaurant(req : Request, res : Response , next : NextFunction ){
    const idRistoranteParameter = req.params.idr;

    const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(idRistoranteParameter).populate('bartenders')
    
    if(restaurant){
        return res.status(200).json({error: false, errormessage: "", bartenders : restaurant.getbartenders()})
    }else{
        return next({statusCode:404, error: true, errormessage: "Any restaurant found"})
    }
    
}

export async function createRestaurant(req : Request, res : Response, next : NextFunction) {

    //If i reached this point all the middleware have done correctly all the input checks and are correct
    const customRequest = req as Request & { auth: any }; // For error type at compile time
    const idOwner = customRequest.auth._id
    const restaurantNameBody = req.body.restaurantName
    const owner : Owner.Owner = await Owner.OwnerModel.findById(idOwner)
    const newRestaurant = Restaurant.newRestaurant(restaurantNameBody, owner)
    owner.setRestaurantOwn(newRestaurant.getId())
    await owner.save()
    await newRestaurant.save()
    return res.status(200).json({error: false, errormessage: "", newRestaurantId : newRestaurant.getId()})    
}


export async function createCookAndAddToARestaurant(req : Request, res : Response , next : NextFunction) {
    const restaurantId : string = req.params.idr
    const username = req.body.username;
    const email = req.body.email;

    if(!await User.checkNameCorrectness(username) || !User.checkEmailCorrectness(email)){
        return next({statusCode:404, error: true, errormessage: "Email or Name input not valid"})
    }

    const newPassword = Utilities.generateRandomString(8)
    const restaurant = await Restaurant.RestaurantModel.findById(restaurantId)
    const cook : Cook.Cook = Cook.createCook(username, email, newPassword, new Types.ObjectId(restaurantId))
    Restaurant.addCookToARestaurant(cook, restaurant)

    cook.save()
    restaurant.save()

    return res.status(200).json({error: false, errormessage: "", idNewCook : cook.getId(), usernameNewCook : cook.getUsername(), email : cook.getEmail(), passwordToChange : newPassword});
}

export async function createWaiterAndAddToARestaurant(req : Request, res : Response , next : NextFunction) {
    const restaurantId : string = req.params.idr
    const username = req.body.username;
    const email = req.body.email;
    if(!await User.checkNameCorrectness(username) || !User.checkEmailCorrectness(email)){
        return next({statusCode:404, error: true, errormessage: "Email or Name input not valid"})
    }
    const newPassword = Utilities.generateRandomString(8)
    const restaurant = await Restaurant.RestaurantModel.findById(restaurantId)
    const waiter : Waiter.Waiter = Waiter.createWaiter(username, email, newPassword, new Types.ObjectId(restaurantId))
    Restaurant.addWaiterToARestaurant(waiter, restaurant)

    await waiter.save()
    await restaurant.save()

    return res.status(200).json({error: false, errormessage: "", idNewWaiter : waiter.getId(), usernameNewWaiter : waiter.getUsername(), emailNewWaiter : waiter.getEmail(), passwordToChange : newPassword});   
}

export async function createCashierAndAddToARestaurant(req : Request, res : Response , next : NextFunction) {
    const restaurantId : string = req.params.idr
    const username = req.body.username;
    const email = req.body.email;
    if(!await User.checkNameCorrectness(username) || !User.checkEmailCorrectness(email)){
        return next({statusCode:404, error: true, errormessage: "Email or Name input not valid"})
    }
    const newPassword = Utilities.generateRandomString(8)
    const restaurant = await Restaurant.RestaurantModel.findById(restaurantId)
    const cashier : Cashier.Cashier = Cashier.createCashier(username, email, newPassword, new Types.ObjectId(restaurantId))
    Restaurant.addCashierToARestaurant(cashier, restaurant)

    await cashier.save()
    await restaurant.save()

    return res.status(200).json({error: false, errormessage: "", idNewCashier : cashier.getId(), usernameNewCashier : cashier.getUsername(), emailnewCashier : cashier.getEmail(), passwordToChange : newPassword});
}

export async function createBartenderAndAddToARestaurant(req : Request, res : Response , next : NextFunction) {
    const customRequest = req as Request & { auth: any }; // For error type at compile time
    const idOwner = customRequest.auth._id



    const restaurantId : string = req.params.idr
    const username = req.body.username;
    const email = req.body.email;
    if(!await User.checkNameCorrectness(username) || !User.checkEmailCorrectness(email)){
        return next({statusCode:404, error: true, errormessage: "Email or Name input not valid"})
    }
    const newPassword = Utilities.generateRandomString(8)
    const restaurant = await Restaurant.RestaurantModel.findById(restaurantId)
    const bartender : Bartender.Bartender = Bartender.createBartender(username, email, newPassword, new Types.ObjectId(restaurantId))
    Restaurant.addBartenderToARestaurant(bartender, restaurant)

    await bartender.save()
    await restaurant.save()

    return res.status(200).json({error: false, errormessage: "", idNewBartender : bartender.getId(), usernameNewBartender : bartender.getUsername(), emailNewBartender : bartender.getEmail(), passwordToChange : newPassword});
}

export async function deleteCookAndRemoveFromRestaurant(req : Request, res : Response , next : NextFunction) {
    const idRestaurant = req.params.idr;
    const idCook = req.params.idu;
    const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(idRestaurant);

    if(restaurant.removeCook(idCook)){
        await restaurant.save()
        await Cook.CookModel.deleteOne({_id : idCook})
        return res.status(200).json({error: false, errormessage: "", idCookDeleted : idCook});
    }else{
        return next({statusCode:404, error: true, errormessage: "Cook not deleted"})
    }
        
    
}

export async function deleteWaiterAndRemoveFromRestaurant(req : Request, res : Response , next : NextFunction) {
    const idRestaurant = req.params.idr;
    const idWaiter = req.params.idu;
    const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(idRestaurant);
    if(restaurant.removeWaiter(idWaiter)){
        await restaurant.save()
        await Waiter.WaiterModel.deleteOne({_id : idWaiter})
        return res.status(200).json({error: false, errormessage: "", idWaiterDeleted : idWaiter});
    }else{
        return next({statusCode:404, error: true, errormessage: "waiter not deleted"})
    }
}

export async function deleteCashierAndRemoveFromRestaurant(req : Request, res : Response , next : NextFunction) {
    const idRestaurant = req.params.idr;
    const idCashier = req.params.idu;
    const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(idRestaurant);
    if(restaurant.removeCashier(idCashier)){
        await restaurant.save()
        await Cashier.CashierModel.deleteOne({_id : idCashier})
        return res.status(200).json({error: false, errormessage: "", idCashierDeleted : idCashier});
    }else{
        return next({statusCode:404, error: true, errormessage: "cashier not deleted"})
    }
}

export async function deleteBartenderAndRemoveFromRestaurant(req : Request, res : Response , next : NextFunction) {
    const idRestaurant = req.params.idr;
    const idBartender = req.params.idu;
    const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(idRestaurant);
    if(restaurant.removeBartender(idBartender)){
        await restaurant.save()
        await Bartender.BartenderModel.deleteOne({_id : idBartender})
        return res.status(200).json({error: false, errormessage: "", idBartenderDeleted : idBartender});
    }else{
        return next({statusCode:404, error: true, errormessage: "bartender not deleted"})
    }
}

export async function getTablesListByRestaurant(req : Request, res : Response , next : NextFunction){
    const idRestaurant = req.params.idr
    

    const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(idRestaurant).populate("tables")
    
    if(restaurant){
        return res.status(200).json({error: false, errormessage: "", tables : restaurant.tables})
    }else{
        return next({statusCode:404, error: true, errormessage: "not valid restaurant"})
    }

}

export async function createTableAndAddToARestaurant(req : Request, res : Response , next : NextFunction){
    const idRestaurant = req.params.idr
    const tableNumber = req.body.tableNumber
    const maxSeats = req.body.maxSeats

    const restaurant = await Restaurant.RestaurantModel.findById(idRestaurant)
    const newTable : Table.Table = Table.createTable(tableNumber, maxSeats, new Types.ObjectId(idRestaurant))
    Restaurant.addTableToARestaurant(newTable, restaurant)
    
    await newTable.save()
    await restaurant.save()
    
    return res.status(200).json({error: false, errormessage: "", table : newTable});

}



export async function deleteTableAndRemoveFromRestaurant(req : Request, res : Response , next : NextFunction) {
    const idRestaurant = req.params.idr;
    const idTable = req.params.idt;

    const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(idRestaurant);
    if(restaurant.removeTable(idTable)){
        await restaurant.save()
        await Table.TableModel.deleteOne({_id : idTable})
        return res.status(200).json({error: false, errormessage: "", idTableDeleted : idTable});
    }else{
        return next({statusCode:404, error: true, errormessage: "table not deleted"})
    }
}

export async function getItemsListByRestaurant(req : Request, res : Response , next : NextFunction){
    const idRestaurant = req.params.idr
    

    const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(idRestaurant).populate("items")
    
    if(restaurant){
        return res.status(200).json({error: false, errormessage: "", tables : restaurant.items})
    }else{
        return next({statusCode:404, error: true, errormessage: "not valid restaurant"})
    }

}

export async function createItemAndAddToARestaurant(req : Request, res : Response , next : NextFunction){
    const idRestaurant = req.params.idr
    const itemName = req.body.itemName
    const itemType = req.body.itemType
    const price = req.body.price
    const preparationTime = req.body.preparationTime

    switch (itemType) {
        case 'drink':
            break;
        case 'dish':
            break;
        default:
            next({ statusCode : 404, error: true, errormessage: "Item type " + itemType + " is not correct, please select itemtype from [dish, drink] " })
    }

    const restaurant = await Restaurant.RestaurantModel.findById(idRestaurant)
    const newItem : Item.Item = Item.createItem(itemName, itemType, price, preparationTime, new Types.ObjectId(idRestaurant))
    Restaurant.addItemToARestaurant(newItem, restaurant)
    
    
    

    await newItem.save()
    await restaurant.save()
    
    return res.status(200).json({error: false, errormessage: "", newItem : newItem});

}



export async function deleteItemAndRemoveFromRestaurant(req : Request, res : Response , next : NextFunction) {
    const idRestaurant = req.params.idr;
    const idItem = req.params.idi;

    const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(idRestaurant);
    if(restaurant.removeItem(idItem)){
        await restaurant.save()
        await Item.ItemModel.deleteOne({_id : idItem})
        return res.status(200).json({error: false, errormessage: "", idItemDeleted : idItem});
    }else{
        return next({statusCode:404, error: true, errormessage: "item not deleted"})
    }
}

export async function getCustomerGroupByRestaurantAndTable(req : Request, res : Response , next : NextFunction){
    const idtable = req.params.idt
    

    const table : Table.Table = await Table.TableModel.findById(idtable).populate("group")
    
    if(table){
        return res.status(200).json({error: false, errormessage: "", group : table.group})
    }else{
        return next({statusCode:404, error: true, errormessage: "not valid table"})
    }

}

export async function getOrdersByRestaurantAndTable(req : Request, res : Response , next : NextFunction){
    const idtable = req.params.idt
    

    const table : Table.Table = await Table.TableModel.findById(idtable)
    const group : Group.Group = await Group.GroupModel.findById(table.group).populate("ordersList")

    
    if(group){
        return res.status(200).json({error: false, errormessage: "", orders : group.ordersList})
    }else{
        return next({statusCode:404, error: true, errormessage: "not valid group"})
    }

}

export async function getRecipeByRestaurantAndTable(req : Request, res : Response , next : NextFunction){
    const idtable = req.params.idt
    

    const table : Table.Table = await Table.TableModel.findById(idtable).populate("group")

    const group : Group.Group = await Group.GroupModel.findById(table.group).populate("idRecipe")


    
    
    if(table){
        return res.status(200).json({error: false, errormessage: "", recipe : group.idRecipe})
    }else{
        return next({statusCode:404, error: true, errormessage: "not valid table"})
    }

}

export async function getGroupsByRestaurant(req : Request, res : Response , next : NextFunction){
    const idRestaurant = req.params.idr
    const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(idRestaurant).populate("groups")
    
    if(restaurant){
        return res.status(200).json({error: false, errormessage: "", groups : restaurant.groups})
    }else{
        return next({statusCode:404, error: true, errormessage: "restaurant doesn't exist"})
    }

}

export async function getRecipesByRestaurant(req : Request, res : Response , next : NextFunction){
    const idRestaurant = req.params.idr
    const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(idRestaurant).populate("recipes")
    
    if(restaurant){
        return res.status(200).json({error: false, errormessage: "", recipes : restaurant.recipes})
    }else{
        return next({statusCode:404, error: true, errormessage: "restaurant doesn't exist"})
    }

}

export async function createGroupAndAddToATable(req : Request, res : Response , next : NextFunction){
    const idRestaurant = req.params.idr
    const idTable = req.params.idt
    const numberOfPerson = req.body.numberOfPerson

    const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(idRestaurant)
    const table : Table.Table= await Table.TableModel.findById(idTable)
    
    //Restaurant.RestaurantModel.updateOne({ _id: documentoId }, { $set: { nome: nuovoValoreProprieta } })

    const newGroup : Group.Group = Group.createGroup(numberOfPerson,new Types.ObjectId(idTable), new Types.ObjectId(idRestaurant))
    


    Restaurant.addGroupToARestaurant(newGroup, restaurant)
    Table.addGroupToATable(newGroup, table)

    
    
    await newGroup.save()
    await restaurant.save()
    await table.save()
    
    return res.status(200).json({error: false, errormessage: "", newGroup : newGroup});

}

export async function removeGroupFromTable(req : Request, res : Response , next : NextFunction){
    const idTable = req.params.idt

    const table : Table.Table = await Table.TableModel.findById(idTable)
    const group : Group.Group = await Group.GroupModel.findById(table.group)

    Table.removeGroupFromTable(table)
    const date = new Date()
    group.dateFinish = date
    group.idTable = null

    
    await group.save()
    await table.save()
    
    return res.status(200).json({error: false, errormessage: "", newGroup : table});

}

export async function createOrderAndAddToACustomerGroup(req, res, next : NextFunction){
    const idTable= req.params.idt
    const idWaiterAuthenticated = req.auth._id
    const itemsList = req.body.items

    const table : Table.Table = await Table.TableModel.findById(idTable)
    const group : Group.Group = await Group.GroupModel.findById(table.group)
    
    const waiter : Waiter.Waiter = await Waiter.WaiterModel.findById(idWaiterAuthenticated)
    const newOrder : Order.Order = Order.createOrder(new Types.ObjectId(table.group.toString()), new Types.ObjectId(idWaiterAuthenticated), itemsList)

    Waiter.addOrderAwaited(newOrder, waiter)
    Group.addOrder(newOrder, group)

    await waiter.save()
    await newOrder.save()
    await group.save()
    
    return res.status(200).json({error: false, errormessage: "", newOrder : newOrder});

}


export async function createRecipeForGroupAndAddToARestaurant(req, res, next : NextFunction){
    const idTable= req.params.idt
    const idRestaurant = req.params.idr
    const idCashierAuthenticated = req.auth._id

    const restaurant : Restaurant.Restaurant = await Restaurant.RestaurantModel.findById(idRestaurant)
    const cashier : Cashier.Cashier = await Cashier.CashierModel.findById(idCashierAuthenticated)
    const table : Table.Table = await Table.TableModel.findById(idTable)
    
    const orderList = await (await Group.GroupModel.findById(table.group).populate("ordersList")).ordersList


    const group : Group.Group = await Group.GroupModel.findById(table.group.toString())

    const newRecipe : Recipe.Recipe = await Recipe.createRecipe(new Types.ObjectId(idCashierAuthenticated), new Types.ObjectId(table.group.toString()), new Types.ObjectId(idRestaurant), orderList)

    Restaurant.addRecipeToRestaurant(newRecipe, restaurant)
    Group.addRecipeToGroup(newRecipe, group)
    Cashier.addRecipe(newRecipe, cashier)

    await newRecipe.save()
    await restaurant.save()
    await group.save()
    await cashier.save()

    
    return res.status(200).json({error: false, errormessage: "", newRecipe : newRecipe});

}
