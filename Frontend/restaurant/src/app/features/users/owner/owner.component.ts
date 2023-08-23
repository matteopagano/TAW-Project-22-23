import { Component } from '@angular/core';
import { SocketService } from '../../../socket.service';

import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { TablesRequestService } from 'src/app/common/api/http-requests/requests/tables/tables-request.service';
import { OrdersRequestService } from 'src/app/common/api/http-requests/requests/orders/orders-request.service';
import { ItemsRequestService } from 'src/app/common/api/http-requests/requests/items/items-request.service';
import { GroupsRequestService } from 'src/app/common/api/http-requests/requests/groups/groups-request.service';
import { RecipesRequestService } from 'src/app/common/api/http-requests/requests/recipes/recipes-request.service';
import { UsersRequestService } from 'src/app/common/api/http-requests/requests/users/users-request.service';


interface Cashier {
  _id: string;
  recipesPrinted: string[];
  username: string;
  email: string;
  role: string;
  idRestaurant: string;
  salt: string;
  digest: string;
  __v: number;
}

interface CashiersResponse {
  error: boolean;
  errormessage: string;
  cashiers: Cashier[];
}

interface Waiter {
  _id: string;
  ordersAwaiting: string[];
  ordersServed: string[];
  username: string;
  email: string;
  role: string;
  idRestaurant: string;
  salt: string;
  digest: string;
  __v: number;
}

interface WaitersResponse {
  error: boolean;
  errormessage: string;
  waiters: Waiter[];
}

interface Cooker {
  _id: string;
  username: string;
  email: string;
  role: string;
  idRestaurant: string;
}

interface Bartender {
  _id: string;
  username: string;
  email: string;
  role: string;
  idRestaurant: string;
}


interface CookersResponse {
  error: boolean;
  errormessage: string;
  cooks: Cooker[];
}

interface BartendersResponse {
  error: boolean;
  errormessage: string;
  bartenders: Bartender[];
}

interface Table {
  _id: string;
  tableNumber: string;
  maxSeats: number;
  group: string;
  restaurantId: string;
  __v: number;
}

interface TablesResponse {
  error: boolean;
  errormessage: string;
  tables: Table[];
}

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
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css']
})
export class OwnerComponent {

  newUserData: any;
  newRestaurant : string = ''

  cashiers: Cashier[] = [];
  waiters: Waiter[] = [];
  cooks: Cooker[] = [];
  bartenders: Bartender[] = [];
  items: any[] = [];
  tables: Table[] = [];

  public groups: Group[] = [];

  recipes: Recipe[] = [];

  newUser: any = {
    username: '',
    email: '',
    role: 'cashier'
  };

  newItem: any = {
    itemName: '',
    itemType: 'dish',
    price: 0,
    preparationTime: 0
  };

  newTable: {
    tableNumber: string,
    maxSeats: number } =
    {
      tableNumber: '',
      maxSeats: 0
    };



  constructor(private ups : UserPropertyService,
    private socketService: SocketService,
    private trs : TablesRequestService,
    private irs : ItemsRequestService,
    private grs : GroupsRequestService,
    private rrs : RecipesRequestService,
    private urs : UsersRequestService
  ){
    this.get_cashiers();
    this.get_waiters()
    this.get_bartenders()
    this.get_cooks()
    this.fetchItems()
    this.getTables()
    this.getGroups();
    this.getRecipes()



    this.socketService.joinRestaurantRoom(this.ups.getRestaurant());
    const socket = socketService.getSocket()
    socket.fromEvent("fetchTableNeeded").subscribe((data) => {
      console.log("fetchTableNeeded")
      this.getTables()
    });

    socket.fromEvent("fetchItemsNeeded").subscribe((data) => {
      console.log("fetchItemsNeeded")
      this.fetchItems()
    });

    socket.fromEvent("fetchGroupsNeeded").subscribe((data) => {
      console.log("fetchGroupsNeeded")
      this.getGroups()
    });

    socket.fromEvent("fetchRecipesNeeded").subscribe((data) => {
      console.log("fetchRecipesNeeded")
      this.getRecipes()
    });


  }


  get_cashiers(){
    this.urs.get_cashiers().subscribe((data: CashiersResponse) => {
      this.cashiers = data.cashiers;
    });
  }

  get_waiters(){
    this.urs.get_waiters().subscribe((data: WaitersResponse) => {
      this.waiters = data.waiters;
    });
  }

  deleteCashier(cashierId: string): void {
    this.urs.delete_cashier(cashierId).subscribe(() => {
      this.get_cashiers();
    });
  }

  deleteWaiter(waiterId: string): void {
    this.urs.delete_waiter(waiterId).subscribe(() => {
      this.get_waiters();
    });
  }

  get_cooks() {
    this.urs.get_cooks().subscribe((data: CookersResponse) => {
      this.cooks = data.cooks;
    });
  }

  get_bartenders() {
    this.urs.get_bartenders().subscribe((data: BartendersResponse) => {
      this.bartenders = data.bartenders;
    });
  }

  deleteCook(cookerId: string): void {
    this.urs.delete_cook(cookerId).subscribe(() => {
      this.get_cooks();
    });
  }

  deleteBartender(bartenderId: string): void {
    this.urs.delete_bartender(bartenderId).subscribe(() => {
      this.get_bartenders();
    });
  }


  createUser(): void {
    console.log(this.newUser)
    this.urs.create_user(this.newUser).subscribe((response) => {
      console.log(response)
      this.newUserData = response;
      if (this.newUser.role === 'cashier') {
        this.get_cashiers();
      } else if (this.newUser.role === 'waiter') {
        this.get_waiters();
      } else if (this.newUser.role === 'cooker') {
        this.get_cooks();
      } else if (this.newUser.role === 'bartender') {
        this.get_bartenders();
      }
      this.newUser = {
        username: '',
        email: '',
        role: 'cashier'
      };
    });
  }

  addNewItem() {
    this.irs.addItem(this.newItem).subscribe(
      response => {
        console.log('Item aggiunto con successo:', response);
        this.socketService.emitFetchItems(this.ups.getRestaurant())
        this.fetchItems()
        this.newItem = {};
      },
      error => {
        console.error('Errore durante l\'aggiunta dell\'item:', error);
      }
    );
  }

  fetchItems() {
    this.irs.getItems().subscribe(
      response => {
        this.items = response.tables;
      },
      error => {
        console.error('Errore durante il recupero degli item:', error);
      }
    );
  }

  deleteItem(itemId: string): void {
    this.irs.deleteItem(itemId).subscribe(
      () => {
        console.log('Item deleted successfully.');
        this.socketService.emitFetchItems(this.ups.getRestaurant())
        this.fetchItems();
      },
      (error) => {
        console.error('Error deleting item:', error);
      }
    );
  }

  addNewTable() {
    this.trs.addTable(this.newTable).subscribe(
      response => {
        console.log('Tavolo aggiunto con successo:', response);
        this.newTable = { tableNumber: '', maxSeats: 0 };
        this.socketService.emitFetchTable(this.ups.getRestaurant())
        this.getTables()
      },
      error => {
        console.error('Errore durante l\'aggiunta del tavolo:', error);
      }
    );
  }

  getTables() {
    this.trs.getTables().subscribe((data: TablesResponse) => {
      this.tables = data.tables;
    });
  }

  deleteTable(tableId: string) {
    this.trs.deleteTable(tableId).subscribe(() => {
      this.socketService.emitFetchTable(this.ups.getRestaurant())
      this.getTables();
    });
  }



  getGroups() {
    this.grs.getGroups().subscribe((data) => {
      this.groups = data.groups;
    }, (error) => {
      console.error('Errore nel recupero dei gruppi:', error);
    });
  }

  getRecipes() {
    this.rrs.getRecipes().subscribe((data) => {
      this.recipes = data.recipes;
    }, (error) => {
      console.error('Errore nel recupero delle ricette:', error);
    });
  }

  getRecipeById(recipeId: string): Recipe | undefined {
    return this.recipes.find((recipe) => recipe._id === recipeId);
  }

}
