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
app.get('/restaurant/:idr', Middlewares.verifyJWT, Middlewares.isOwnerMiddleware, Endpoints.getRestaurantById)
app.get('/restaurant/:idr/employees', Middlewares.verifyJWT, Middlewares.isOwnerMiddleware, Endpoints.getEmployeesByRestaurant)
app.post('/restaurant', Middlewares.verifyJWT, Middlewares.isOwnerMiddleware, Endpoints.createRestaurant)

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
      .then(
        (user1)=>{
        console.log(user1)
        Restaurant.RestaurantModel.findOne({restaurantName:"D'alessio"})
          .then((restaurant) => {
            if(!restaurant){
              const nuovaPizzeria : Restaurant.Restaurant = new Restaurant.RestaurantModel({
                restaurantName : "D'alessio",
                employeesList : [],
                ownerId : user1._id,
                tablesList : [],
                DaysList : [],
                itemsList : []
              })
              const nuovoProprietario : Cashier.Cashier = new Cashier.CashierModel({
                username : "Alice Pagano",
                email : "alicepaga@gmail.com",
                role : User.RoleType.WAITER,
                employeesList : [],
                restaurantOwn : null,
              })
              nuovaPizzeria.save()
              user1.restaurantOwn = nuovaPizzeria._id
              user1.save()
            }else{
              console.log("Pizzeria gia esistente")
            }
          })
      })
      .then(() => {
        InitExpressServer();
      })

    
});

console.log("hellop world");