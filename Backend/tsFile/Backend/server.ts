import mongoose from "mongoose";


import * as EP from './endpoints'
import * as MW from './middleware'
import * as Owner from '../Model/Owner';
import { Response, Request, NextFunction } from 'express';
const cors = require('cors');


import express = require('express');
const socketIo = require('socket.io');
let app = express();
app.use(cors());




export const http = require('http');



const bodyParser = require('body-parser');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(`Nuova richiesta in entrata: ${req.method} ${req.url}`);
  next();
});

const apiVersion = "/api/v1"

// AUTH ENDPOINTS
app.get(apiVersion + '/', EP.root)
app.get(apiVersion + '/login', MW.basicAuthentication, EP.login)
app.post(apiVersion + '/signup', EP.signup);


// USERS ENDPOINTS
app.get(apiVersion + '/restaurants/:idr', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, EP.getRestaurantById)
app.get(apiVersion + '/restaurants/:idr/cooks', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, EP.getCooksByRestaurant)
app.get(apiVersion +'/restaurants/:idr/waiters', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, EP.getWaitersByRestaurant)
app.get(apiVersion + '/restaurants/:idr/cashiers', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, EP.getCashiersByRestaurant)
app.get(apiVersion + '/restaurants/:idr/bartenders', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, EP.getBartenderByRestaurant)

app.post(apiVersion + '/restaurants', MW.verifyJWT, MW.isValidRestaurantInput, MW.isOwner, MW.hasNotAlreadyARestaurant, EP.createRestaurant)

app.post(apiVersion + '/restaurants/:idr/cooks', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isUserAlreadyExist, EP.createCookAndAddToARestaurant);
app.post(apiVersion + '/restaurants/:idr/waiters', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isUserAlreadyExist, EP.createWaiterAndAddToARestaurant);
app.post(apiVersion +'/restaurants/:idr/cashiers', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isUserAlreadyExist, EP.createCashierAndAddToARestaurant);
app.post(apiVersion + '/restaurants/:idr/bartenders', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isUserAlreadyExist, EP.createBartenderAndAddToARestaurant);

app.delete(apiVersion + '/restaurants/:idr/cooks/:idu', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isCookMemberOfThatRestaurant, EP.deleteCookAndRemoveFromRestaurant);
app.delete(apiVersion + '/restaurants/:idr/waiters/:idu', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isWaiterMemberOfThatRestaurant, EP.deleteWaiterAndRemoveFromRestaurant);
app.delete(apiVersion + '/restaurants/:idr/cashiers/:idu', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isCashierMemberOfThatRestaurant, EP.deleteCashierAndRemoveFromRestaurant);
app.delete(apiVersion + '/restaurants/:idr/bartenders/:idu', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isBartenderMemberOfThatRestaurant, EP.deleteBartenderAndRemoveFromRestaurant);

app.get(apiVersion + '/users/:idu', MW.verifyJWT, MW.isThatUser, EP.getUser)
app.put(apiVersion + '/users/:idu', MW.verifyJWT, MW.isThatUser, EP.modifyPassword)

// TABLES ENDPOINTS
app.get(apiVersion + '/restaurants/:idr/tables', MW.verifyJWT, MW.isWorkerOfThisRestaurant, EP.getTablesListByRestaurant);
app.post(apiVersion + '/restaurants/:idr/tables', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isTableAlreadyExist, EP.createTableAndAddToARestaurant);
app.delete(apiVersion + '/restaurants/:idr/tables/:idt', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isTableOfThatRestaurant, EP.deleteTableAndRemoveFromRestaurant);

// ITEMS ENDPOINTS
app.get(apiVersion + '/restaurants/:idr/items', MW.verifyJWT, MW.isWorkerOfThisRestaurant, EP.getItemsListByRestaurant);
app.post(apiVersion + '/restaurants/:idr/items', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isItemAlreadyExist, EP.createItemAndAddToARestaurant);
app.delete(apiVersion + '/restaurants/:idr/items/:idi', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isItemOfThatRestaurant, EP.deleteItemAndRemoveFromRestaurant);

// CUSTOMERGROUP ENDPOINTS
app.get(apiVersion + '/restaurants/:idr/tables/:idt/group', MW.verifyJWT, MW.isOwnerOrCashierOrWaiter, MW.isWorkerOfThisRestaurant, MW.isTableOfThatRestaurant, EP.getCustomerGroupByRestaurantAndTable);
app.post(apiVersion + '/restaurants/:idr/tables/:idt/group', MW.verifyJWT, MW.isWaiter, MW.isWorkerOfThisRestaurant, MW.isTableOfThatRestaurant, MW.isTableEmpty, EP.createGroupAndAddToATable);
app.delete(apiVersion + '/restaurants/:idr/tables/:idt/group', MW.verifyJWT, MW.isCashier, MW.isWorkerOfThisRestaurant ,MW.isTableOfThatRestaurant, MW.tableHasAGroup, MW.groupHasARecipeYet, EP.removeGroupFromTable);
app.get(apiVersion + '/restaurants/:idr/groups', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, EP.getGroupsByRestaurant)


// ORDERS ENDPOINTS
app.get(apiVersion + '/restaurants/:idr/tables/:idt/group/orders', MW.verifyJWT, MW.isWorkerOfThisRestaurant, MW.isTableOfThatRestaurant, MW.tableHasAGroup, EP.getOrdersByRestaurantAndTable);
app.post(apiVersion + '/restaurants/:idr/tables/:idt/group/orders', MW.verifyJWT, MW.isWaiter, MW.isWorkerOfThisRestaurant,  MW.isTableOfThatRestaurant, MW.tableHasAGroup, EP.createOrderAndAddToACustomerGroup);
app.put(apiVersion + '/restaurants/:idr/tables/:idt/group/orders/:ido', MW.verifyJWT, MW.isCookOrWaiterOrBartender, MW.isWorkerOfThisRestaurant,  MW.isTableOfThatRestaurant, MW.tableHasAGroup, MW.isOrderOfThatGroup, EP.modifyOrder);
app.put(apiVersion + '/restaurants/:idr/tables/:idt/group/orders/:ido/items/:idi', MW.verifyJWT, MW.isCookOrBartender, MW.isWorkerOfThisRestaurant,  MW.isTableOfThatRestaurant, MW.tableHasAGroup, MW.isOrderOfThatGroup, EP.modifyItemOrder);


// RECIPES ENDPOINTS
app.get(apiVersion + '/restaurants/:idr/tables/:idt/group/recipe', MW.verifyJWT, MW.isCashier,  MW.isWorkerOfThisRestaurant, MW.isTableOfThatRestaurant, MW.tableHasAGroup, MW.groupHasARecipe, EP.getRecipeByRestaurantAndTable);
app.post(apiVersion + '/restaurants/:idr/tables/:idt/group/recipe', MW.verifyJWT, MW.isCashier, MW.isWorkerOfThisRestaurant, MW.isTableOfThatRestaurant, MW.tableHasAGroup, MW.areOrdersFinished, MW.groupHasNotARecipeYet, EP.createRecipeForGroupAndAddToARestaurant);
app.get(apiVersion + '/restaurants/:idr/recipes', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, EP.getRecipesByRestaurant) 
app.get(apiVersion + '/restaurants/:idr/recipes/:idre', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, EP.getRecipeByRestaurant) 



app.use( function(err : any, req : Request, res : Response, next : NextFunction) {

  console.log("Request error: " + JSON.stringify(err) );
  res.status( err.statusCode || 500 ).json( err );

});

app.use( (req,res,next) => {
  res.status(404).json({statusCode:404, error:true, errormessage: "Invalid endpoint"} );
})

function InitExpressServer(): void {
  let server = http.createServer(app);
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  io.on('connection', (socket) => {
    console.log('Nuova connessione socket:', socket.id);
  
    socket.on('join-room', (room) => {
      socket.join(room); 
      console.log(`Socket ${socket.id} si è unito alla stanza ${room}`);
    });

    socket.on('fetchTable', (room) => {
      console.log("Inviato fetchTableNeeded")
      
      io.to(room).emit('fetchTableNeeded');
    });

    socket.on('fetchItems', (room) => {
      console.log("Inviato fetchItemsNeeded")
      
      io.to(room).emit('fetchItemsNeeded');
    });

    socket.on('fetchGroups', (room) => {
      console.log("Inviato fetchGroupsNeeded")
      
      io.to(room).emit('fetchGroupsNeeded');
    });

    socket.on('fetchRecipes', (room) => {
      console.log("Inviato fetchRecipesNeeded")
      
      io.to(room).emit('fetchRecipesNeeded');
    });

    socket.on('fetchOrders', (room) => {
      console.log("Inviato fetchOrdersNeeded")
      
      io.to(room).emit('fetchOrdersNeeded');
    });

    socket.on('newOrderDrink', (room, order, idTable) => {
      console.log("Inviato fetchNewOrderDrink")
  
      socket.broadcast.to(room).emit('fetchNewOrderDrink', {order : order, idTable : idTable});
    });

    socket.on('newOrderDish', (room, order, idTable) => {
      console.log("Inviato fetchNewOrderDish");
      //io.to(room).emit('fetchNewOrderDish', {order : order, idTable : idTable});
      socket.broadcast.to(room).emit('fetchNewOrderDish', {order : order, idTable : idTable});
    });

    socket.on('setItemOfOrderDrinkStatus', (room, order, idTable) => {
      console.log("Inviato fetchItemOfOrderDrinkStatus");
      //io.to(room).emit('fetchNewOrderDish', {order : order, idTable : idTable});
      socket.broadcast.to(room).emit('fetchItemOfOrderDrinkStatus', {order : order});
    });

    socket.on('setItemOfOrderDishStatus', (room, order) => {
      console.log("Inviato fetchItemOfOrderDishStatus");
      //io.to(room).emit('fetchNewOrderDish', {order : order, idTable : idTable});
      socket.broadcast.to(room).emit('fetchItemOfOrderDishStatus', {order : order});
    });

    ////////////////////////

    socket.on('setOrderDrinkStatus', (room, order) => {
      console.log("Inviato setOrderDishStatus");
      //io.to(room).emit('fetchNewOrderDish', {order : order, idTable : idTable});
      socket.broadcast.to(room).emit('fetchOrderDrinkStatus', {order : order});
      console.log("Inviato newOrderCompleted");
      const str = room + order.idWaiter + "ordersAwaited"
      console.log("iviando nella stanza: " + str)
      io.to(room + order.idWaiter + "ordersAwaited").emit('fetchOrderReady', {order : order});
    });

    socket.on('setOrderDishStatus', (room, order) => {
      console.log("Inviato setOrderDishStatus");
      //io.to(room).emit('fetchNewOrderDish', {order : order, idTable : idTable});
      socket.broadcast.to(room).emit('fetchOrderDishStatus', {order : order});
      console.log("Inviato newOrderCompleted");
      const str = room + order.idWaiter + "ordersAwaited"
      console.log("iviando nella stanza: " + str)
      io.to(room + order.idWaiter + "ordersAwaited").emit('fetchOrderReady', {order : order});
    });


    socket.on('disconnect', () => {
      console.log(`Socket ${socket.id} si è disconnesso`);
    });
  });
  server.listen(3000, () => console.log("HTTP Server started on port 3000"));
}




mongoose.connect("mongodb://mongodb:27017/MioDB",)
.then(() => {
  console.log("Connesso al database MongoDB");
})
.catch((error) => {
  console.error("Errore di connessione al database MongoDB:", error);
});

mongoose.connection.once('open', async() => {
    console.log('Connessione al database aperta!');
    
    const admin : Owner.Owner = await Owner.OwnerModel.findOne({username:"matteo Pagano"})
    
    if(!admin){
      console.log("Utente matteo non trovato")
      const newAdmin : Owner.Owner = new Owner.OwnerModel({
        username : "matteo Pagano",
        email : "metiupaga8@gmail.com",
        restaurantOwn : null,
      })
      newAdmin.setPassword("admin");
      await newAdmin.save()
    }else{
      console.log("trovato utente matteo")
    }
    

    InitExpressServer();


    
})


