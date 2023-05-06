import mongoose from "mongoose";

import {AllergeneModel} from '../Model/Allergene';
import {DayModel} from '../Model/Day';
import {ItemModel , ItemType, Item} from '../Model/Item';
import {OrderModel} from '../Model/Order';
import {RecipeModel} from '../Model/Recipe';
import {RestaurantModel} from '../Model/Restaurant';
import {TableModel} from '../Model/Table';
import {OwnerModel, CashierModel, CookModel, BartenderModel, WaiterModel, Owner, RoleType} from '../Model/User';



mongoose.connect("mongodb://localhost:27017/MioDB", )
.then(() => {
  console.log("Connesso al database MongoDB");
  
})
.catch((error) => {
  console.error("Errore di connessione al database MongoDB:", error);
});

mongoose.connection.once('open', () => {
    
    

    const nuovoProprietario : Owner = new OwnerModel({
      username : "matteo Pagano",
      email : "metiupaga8@gmail.com",
      digest : "prova",
      role : RoleType.OWNER,
      salt : "saleprova",
      employeesList : [],
      restaurantOwn : null,
    })

    nuovoProprietario.save()
      .then(() => {
        return OwnerModel.findOne({email:"metiupaga8@gmail.com"})
      })
      .then((u) => {console.log(u?.email)})

     

    

    console.log('Connessione al database aperta!');
});

console.log("hellop world");