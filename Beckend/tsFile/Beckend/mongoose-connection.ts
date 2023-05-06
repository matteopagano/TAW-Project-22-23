import mongoose from "mongoose"
import * as User from '../Model/User';
import {ItemModel} from '../Model/Item'

mongoose.connect("mongodb://localhost:27017/MioDB", )
.then(() => {
  console.log("Connesso al database MongoDB");
  
})
.catch((error) => {
  console.error("Errore di connessione al database MongoDB:", error);
});

mongoose.connection.once('open', () => {
    

    const newItem1 = new ItemModel({
      name: "Carbonara",
      price: 101,
      type : 'Drink',
      allergenes : [],
      idRestaurant : "ciao"
    })
    newItem1.save();
    


    console.log('Connessione al database aperta!');
});

console.log("hellop world");