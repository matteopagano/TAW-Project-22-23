import mongoose from "mongoose";

//ENDPOINTS





import {postOwner, root} from './endpoints'
import {AllergeneModel} from '../Model/Allergene';
import {DayModel} from '../Model/Day';
import {ItemModel , ItemType, Item} from '../Model/Item';
import {OrderModel} from '../Model/Order';
import {RecipeModel} from '../Model/Recipe';
import {RestaurantModel} from '../Model/Restaurant';
import {TableModel} from '../Model/Table';
import * as User from '../Model/User';
import { Response, Request, NextFunction } from 'express';

import express = require('express');
let app = express();
import http = require('http');

app.use(express.json());

app.get('/', root)
app.post('/owner', postOwner)

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


mongoose.connect("mongodb://localhost:27017/MioDB", )
.then(() => {
  console.log("Connesso al database MongoDB");
  
})
.catch((error) => {
  console.error("Errore di connessione al database MongoDB:", error);
});

mongoose.connection.once('open', () => {
    console.log('Connessione al database aperta!');
    User.UserModel.findOne({username:"matteo Pagano"}).exec()
      .then(
        (user)=>{
          
          if(!user){
            console.log("Utente matteo non trovato")
            const nuovoProprietario : User.Owner = new User.OwnerModel({
              username : "matteo Pagano",
              email : "metiupaga8@gmail.com",
              digest : "prova",
              role : User.RoleType.OWNER,
              salt : "saleprova",
              employeesList : [],
              restaurantOwn : null,
            })
            nuovoProprietario.save()
          }else{
            console.log("trovato utente matteo")
          }
          
        }
      )
      .then(() => {
        InitExpressServer();
      })

    
});

console.log("hellop world");