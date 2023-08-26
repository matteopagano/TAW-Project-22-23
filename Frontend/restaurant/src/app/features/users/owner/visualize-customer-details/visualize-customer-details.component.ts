import { Component } from '@angular/core';
import { SocketService } from 'src/app/socket.service';

import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { GroupsRequestService } from 'src/app/common/api/http-requests/requests/groups/groups-request.service';
import { RecipesRequestService } from 'src/app/common/api/http-requests/requests/recipes/recipes-request.service';
import { ActivatedRoute } from '@angular/router';
import { PdfGeneratorService } from 'src/app/pdf-generator.service';



export interface Group {
  _id: string;
  numberOfPerson: number;
  dateStart: string;
  dateFinish: string | null;
  ordersList: string[];
  idRestaurant: string;
  idRecipe: string | null;
  idTable: string | null;
  __v: number;
}



export interface Recipe {
  _id: string;
  costAmount: number;
  dateOfPrinting: Date;
  idGroup: string;
  idCashier: string;
  itemsBought : ItemBought[]
  __v: number;
}

interface Item {
  _id: string;
  idRestaurant: string;
  itemName: string;
  itemType: string;
  preparationTime: number;
  price: number;
  __v: number;
}

export interface ItemBought {
  quantity: number;
  _id : Item;
}

export interface ItemForTable {
  name: string;
  price: number;
  quantity: number;
  _id: string;
  type: string;
}

@Component({
  selector: 'app-visualize-customer-details',
  templateUrl: './visualize-customer-details.component.html',
  styleUrls: ['./visualize-customer-details.component.css']
})
export class VisualizeCustomerDetailsComponent {

  idRecipe = ''

  recipe!: Recipe;

  constructor(private ups : UserPropertyService,
    private socketService: SocketService,
    private route: ActivatedRoute,
    private rrs : RecipesRequestService,
    private pdfService : PdfGeneratorService,

  ){

    this.socketService.joinRestaurantRoom(this.ups.getRestaurant());
    const socket = socketService.getSocket()



    this.route.params.subscribe(params => {
      this.idRecipe = params['id'];
      this.getRecipe(this.idRecipe)
    });


  }

  printReceipt(){
    const itemsForTable : ItemForTable[] = []
    for(let item of this.recipe.itemsBought){
      const itemForTable: ItemForTable = {
        name: item._id.itemName,
        price: item._id.price,
        quantity: item.quantity,
        _id: item._id._id,
        type: item._id.itemType
      };
      itemsForTable.push(itemForTable)
    }
    this.pdfService.generateReceipt(this.recipe.costAmount, itemsForTable)
  }

  getRecipe(idRecipe : string) {
    this.rrs.getRecipe(idRecipe).subscribe((data) => {
      this.recipe = data.recipe;
      console.log("Ricetta ottenute:", this.recipe);
    }, (error) => {
      console.error('Errore nel recupero delle ricette:', error);
    });
  }
}
