import { Component} from '@angular/core';
import { formatDate } from '@angular/common';
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
  idRecipe: Recipe | null;
  idTable: string | null;
  __v: number;
}

interface Recipe {
  _id: string;
  costAmount: number;
  dateOfPrinting: Date;
  idCashier: string;
  idGroup: string;
  itemsBought: any[];
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
  ordersToShow: number = 5;
  orderSort: string = 'asc';
  filteredGroups: Group[] = [];
  startDate: string = '';
  endDate: string = '';
  finished: string | null = null;

  constructor(
    private ups: UserPropertyService,
    private socketService: SocketService,
    private grs: GroupsRequestService,
    private rrs: RecipesRequestService,
  ) {
    this.getGroups();
    this.socketService.joinRestaurantRoom(this.ups.getRestaurant());
    const socket = socketService.getSocket();
    this.finished = ""

    socket.fromEvent("fetchGroupsNeeded").subscribe((data) => {
      console.log("fetchGroupsNeeded");
      this.getGroups();
    });
  }

  getGroups() {
    this.grs.getGroups().subscribe((data) => {
      this.groups = data.groups;
      console.log(this.groups)
      this.startDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
      this.endDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
      this.applyFilters();

    }, (error) => {
      console.error('Errore nel recupero dei gruppi:', error);
    });
  }


applyFilters() {


  let filteredGroups = [...this.groups];


  if (this.finished !== "") {
    filteredGroups = filteredGroups.filter(group => {
      if (this.finished == "true") {
        return group.dateFinish !== null && group.dateFinish !== "";
      } else {
        return group.dateFinish === null || group.dateFinish === "";
      }
    });
  }

  if (this.startDate && this.endDate) {
    filteredGroups = filteredGroups.filter(group => {
      const groupDate = new Date(group.dateStart).toISOString().slice(0, 10);
      return groupDate >= this.startDate && groupDate <= this.endDate;
    });
  }

  if (this.orderSort === 'asc') {
    filteredGroups.sort((a, b) => new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime());
  } else if (this.orderSort === 'desc') {
    filteredGroups.sort((a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime());
  }

  filteredGroups = filteredGroups.slice(0, this.ordersToShow);

  this.filteredGroups = filteredGroups;
}

  showFilters: boolean = true;

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }
}
