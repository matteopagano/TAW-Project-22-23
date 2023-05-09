import mongoose from "mongoose";


import * as Endpoints from './endpoints'
import * as Middlewares from './middleware'
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

app.get('/', Endpoints.root)
app.get('/login', Middlewares.basicAuthentication, Endpoints.login)

app.get('/restaurants/:idr', Middlewares.verifyJWT, Middlewares.isOwner, Middlewares.isOwnerOfThisRestaurant, Endpoints.getRestaurantById)
app.get('/restaurants/:idr/cooks', Middlewares.verifyJWT, Middlewares.isOwner, Middlewares.isOwnerOfThisRestaurant, Endpoints.getCooksByRestaurant)
app.get('/restaurants/:idr/waiters', Middlewares.verifyJWT, Middlewares.isOwner, Middlewares.isOwnerOfThisRestaurant, Endpoints.getWaitersByRestaurant)
app.get('/restaurants/:idr/cashiers', Middlewares.verifyJWT, Middlewares.isOwner, Middlewares.isOwnerOfThisRestaurant, Endpoints.getCashiersByRestaurant)
app.get('/restaurants/:idr/bartenders', Middlewares.verifyJWT, Middlewares.isOwner, Middlewares.isOwnerOfThisRestaurant, Endpoints.getBartenderByRestaurant)

app.post('/restaurants', Middlewares.verifyJWT, Middlewares.isOwner, Middlewares.hasNotAlreadyARestaurant, Endpoints.createRestaurant)

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

mongoose.connection.once('open', () => {
    console.log('Connessione al database aperta!');
    User.UserModel.findOne({username:"matteo Pagano"})
      .then(
        (user) => {
          
          if(!user){
            console.log("Utente matteo non trovato")
            const nuovoProprietario : Owner.Owner = new Owner.OwnerModel({
              username : "matteo Pagano",
              email : "metiupaga8@gmail.com",
              role : User.RoleType.OWNER,
              employeesList : [],
              restaurantOwn : null,
            })
            nuovoProprietario.setPassword("admin");
            return nuovoProprietario.save()
          }else{
            console.log("trovato utente matteo")
          }
        }
      )
      .then(() => {
        InitExpressServer();
      })

    
});
