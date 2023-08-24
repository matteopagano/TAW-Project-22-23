import { Component } from '@angular/core';
import { SocketService } from 'src/app/socket.service';
import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { TablesRequestService } from 'src/app/common/api/http-requests/requests/tables/tables-request.service';
import { OrdersRequestService } from 'src/app/common/api/http-requests/requests/orders/orders-request.service';
import { ItemsRequestService } from 'src/app/common/api/http-requests/requests/items/items-request.service';
import { GroupsRequestService } from 'src/app/common/api/http-requests/requests/groups/groups-request.service';
import { RecipesRequestService } from 'src/app/common/api/http-requests/requests/recipes/recipes-request.service';

interface TablesResponse {
  error: boolean;
  errormessage: string;
  tables: {
      _id: string;
      tableNumber: string;
      maxSeats: number;
      group: string;
      restaurantId: string;
      __v: number;
  }[];
}

interface Order {
  _id: string;
  idGroup: string;
  idWaiter: string;
  items: OrderItem[];
  state: string;
  timeCompleted: string | null;
  timeStarted: string;
  __v: number;
}
interface OrderItem {
  timeFinished: string | null;
  idItem: string;
  state: string;
  completedBy: string | null;
  count: number;
  _id: string;
}
interface Table {
  _id: string;
  tableNumber: string;
  maxSeats: number;
  group: string;
  restaurantId: string;
  __v: number;
}

interface MenuItem {
  _id: string;
  itemName: string;
  itemType: string;
  price: number;
  preparationTime: number;
  idRestaurant: string;
  __v: number;
}

interface MenuItemsResponse {
  error: boolean;
  errormessage: string;
  tables: MenuItem[];
}

@Component({
  selector: 'app-display-tables',
  templateUrl: './display-tables.component.html',
  styleUrls: ['./display-tables.component.css']
})
export class DisplayTablesComponent {
  tables: Table[] = [];
  customerGroup: { numberOfPerson: number } = { numberOfPerson: 0 };
  selectedTable: any = null;
  ordersForTable: Order[] = [];
  menuItems: MenuItem[] = [];

  constructor(private ups : UserPropertyService,
    private socketService: SocketService,
    private trs : TablesRequestService,
    private ors : OrdersRequestService,
    private irs : ItemsRequestService,
    private grs : GroupsRequestService,
    private rrs : RecipesRequestService
  ) {
    this.getTables();
    this.getMenuItems();

    this.socketService.joinRestaurantRoom(this.ups.getRestaurant());
    const socket = socketService.getSocket()

    socket.fromEvent("fetchTableNeeded").subscribe((data) => {
      console.log("fetchTableNeeded")
      this.getTables()
    });

    socket.fromEvent("fetchItemsNeeded").subscribe((data) => {
      console.log("fetchItemsNeeded")

      this.getMenuItems()

    });


  }

  getTables() {
    this.trs.getTables().subscribe((data: TablesResponse) => {
      this.tables = data.tables;
    });
  }

  removeCustomer(tableId: string) {
    this.grs.removeGroupFromTable(tableId).subscribe((data) => {
      this.socketService.emitFetchTable(this.ups.getRestaurant())
      this.socketService.emitFetchGroups(this.ups.getRestaurant())
      this.getTables();
    });
  }

  calculateRecipe(tableId: string) {
    this.rrs.calculateRecipe(tableId).subscribe(response => {
      if (!response.error) {
        this.socketService.emitFetchRecipes(this.ups.getRestaurant())
        this.socketService.emitFetchGroups(this.ups.getRestaurant())
      }
    });
  }

  viewOrders(tableId: string) {
  }

  toggleTableDetails(table: string) {
    this.selectedTable = this.selectedTable === table ? null : table;
    console.log("table")
    console.log(table)
    if (this.selectedTable) {
      this.getOrders(table);
    }
  }

  getOrders(tableId: string) {
    this.ors.getOrdersByTable(tableId).subscribe(response => {
      if (!response.error) {
        console.log(response.orders)
        this.ordersForTable = response.orders;

      }
    });
  }


  getMenuItems() {
    this.irs.getItems().subscribe((data: MenuItemsResponse) => {
      console.log("menu items")
      console.log(data.tables)
      this.menuItems = data.tables;
    });
  }

  findItemName(target : string){
    return this.menuItems.find(item => item._id === target)?.itemName
  }

  logout(){}
}
