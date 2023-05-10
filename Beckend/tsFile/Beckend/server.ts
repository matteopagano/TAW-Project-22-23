import mongoose from "mongoose";


import * as EP from './endpoints'
import * as MW from './middleware'
import {AllergeneModel} from '../Model/Allergene';
import {DayModel} from '../Model/Day';
import {ItemModel , ItemType, Item} from '../Model/Item';
import {OrderModel} from '../Model/Order';
import {RecipeModel} from '../Model/Recipe';
import * as Restaurant from '../Model/Restaurant';
import {TableModel} from '../Model/Table';

import * as User from '../Model/User';
import * as Owner from '../Model/Owner';
import * as Cashier from '../Model/Cashier';
import { Response, Request, NextFunction } from 'express';


import express = require('express');
let app = express();
import http = require('http');
const bodyParser = require('body-parser');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', EP.root)
app.get('/login', MW.basicAuthentication, EP.login)

app.get('/restaurants/:idr', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, EP.getRestaurantById)
app.get('/restaurants/:idr/cooks', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, EP.getCooksByRestaurant)
app.get('/restaurants/:idr/waiters', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, EP.getWaitersByRestaurant)
app.get('/restaurants/:idr/cashiers', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, EP.getCashiersByRestaurant)
app.get('/restaurants/:idr/bartenders', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, EP.getBartenderByRestaurant)

app.post('/restaurants', MW.verifyJWT, MW.isValidRestaurantInput, MW.isOwner, MW.hasNotAlreadyARestaurant, EP.createRestaurant)

app.post('/restaurants/:idr/cooks', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isUserAlreadyExist, EP.createCookAndAddToARestaurant);
app.post('/restaurants/:idr/waiters', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isUserAlreadyExist, EP.createWaiterAndAddToARestaurant);
app.post('/restaurants/:idr/cashiers', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isUserAlreadyExist, EP.createCashierAndAddToARestaurant);
app.post('/restaurants/:idr/bartenders', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isUserAlreadyExist, EP.createBartenderAndAddToARestaurant);


app.delete('/restaurants/:idr/cooks/:idu', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isCookMemberOfThatRestaurant, EP.deleteCookAndRemoveFromRestaurant);
app.delete('/restaurants/:idr/waiters/:idu', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isWaiterMemberOfThatRestaurant, EP.deleteWaiterAndRemoveFromRestaurant);
app.delete('/restaurants/:idr/cashiers/:idu', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isCashierMemberOfThatRestaurant, EP.deleteCashierAndRemoveFromRestaurant);
app.delete('/restaurants/:idr/bartenders/:idu', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isBartenderMemberOfThatRestaurant, EP.deleteBartenderAndRemoveFromRestaurant);


//DAYS ENDPOINTS
app.get('/restaurants/:idr/days', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, EP.getDaysListByRestaurant);
app.post('/restaurants/:idr/days', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, EP.createDayAndAddToARestaurant);
app.delete('/restaurants/:idr/days/:idd', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isDayOfThatRestaurant, EP.removeDayAndRemoveFromRestaurant);

//TABLES ENDPOINTS
app.get('/restaurants/:idr/tables', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, EP.getTablesListByRestaurant);
//app.post('/restaurants/:idr/tables', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, EP.createTableAndAddToARestaurant);
//app.delete('/restaurants/:idr/tables/:idt', MW.verifyJWT, MW.isOwner, MW.isOwnerOfThisRestaurant, MW.isTableOfThatRestaurant, EP.removeTablesAndRemoveFromRestaurant);

app.use( function(err : any, req : Request, res : Response, next : NextFunction) {

  console.log("Request error: " + JSON.stringify(err) );
  res.status( err.statusCode || 500 ).json( err );

});

app.use( (req,res,next) => {
  res.status(404).json({statusCode:404, error:true, errormessage: "Invalid endpoint"} );
})

function InitExpressServer(): void {
  let server = http.createServer(app);
  server.listen(8080, () => console.log("HTTP Server started on port 8080"));
}

mongoose.connect("mongodb://localhost:27017/MioDB", )
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
        role : User.RoleType.OWNER,
        mployeesList : [],
        restaurantOwn : null,
      })
      newAdmin.setPassword("admin");
      return newAdmin.save()
    }else{
      console.log("trovato utente matteo")
    }

    InitExpressServer();
})


