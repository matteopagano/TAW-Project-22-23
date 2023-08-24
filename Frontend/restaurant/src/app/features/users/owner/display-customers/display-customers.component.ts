import { Component } from '@angular/core';
import { SocketService } from 'src/app/socket.service';

import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { GroupsRequestService } from 'src/app/common/api/http-requests/requests/groups/groups-request.service';
import { RecipesRequestService } from 'src/app/common/api/http-requests/requests/recipes/recipes-request.service';



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
  __v: number;
}
@Component({
  selector: 'app-display-customers',
  templateUrl: './display-customers.component.html',
  styleUrls: ['./display-customers.component.css']
})
export class DisplayCustomersComponent {


  public groups: Group[] = [];

  recipes: Recipe[] = [];

  constructor(private ups : UserPropertyService,
    private socketService: SocketService,
    private grs : GroupsRequestService,
    private rrs : RecipesRequestService,
  ){
    this.getGroups();
    this.getRecipes()
    this.socketService.joinRestaurantRoom(this.ups.getRestaurant());
    const socket = socketService.getSocket()

    socket.fromEvent("fetchGroupsNeeded").subscribe((data) => {
      console.log("fetchGroupsNeeded")
      this.getGroups()
    });

  }
  getGroups() {
    this.grs.getGroups().subscribe((data) => {
      this.groups = data.groups;
    }, (error) => {
      console.error('Errore nel recupero dei gruppi:', error);
    });
  }

  getRecipeById(recipeId: string): Recipe | undefined {
    return this.recipes.find((recipe) => recipe._id === recipeId);
  }

  getRecipes() {
    this.rrs.getRecipes().subscribe((data) => {
      this.recipes = data.recipes;
    }, (error) => {
      console.error('Errore nel recupero delle ricette:', error);
    });
  }


}
