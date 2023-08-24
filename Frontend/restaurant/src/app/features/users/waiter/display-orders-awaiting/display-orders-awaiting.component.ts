import { Component } from '@angular/core';
import { SocketService } from 'src/app/socket.service';

import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { TablesRequestService } from 'src/app/common/api/http-requests/requests/tables/tables-request.service';
import { OrdersRequestService } from 'src/app/common/api/http-requests/requests/orders/orders-request.service';
import { ItemsRequestService } from 'src/app/common/api/http-requests/requests/items/items-request.service';
import { GroupsRequestService } from 'src/app/common/api/http-requests/requests/groups/groups-request.service';
import { RecipesRequestService } from 'src/app/common/api/http-requests/requests/recipes/recipes-request.service';
import { SelfUserRequestService } from 'src/app/common/api/http-requests/requests/self-user/self-user-request.service';
import { Router } from '@angular/router';


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




interface OrdersList {
  items: OrderItem[];
}

interface CustomerGroupDetails {
  _id: string;
  numberOfPerson: number;
  dateStart: string;
  dateFinish: string | null;
  ordersList: string[];
  idRestaurant: string;
  idRecipe: string;
  idTable: string;
  __v: number;
}

interface OrderItem {
  itemId: string;
  itemName: string;
  count: number;
}

export interface Order {
  _id: string;
  idGroup: string;
  idWaiter: string;
  items: OrderItem[];
  state: string;
  timeCompleted: Date | null;
  timeStarted: Date;
  type: string;
  __v: number;
}

export interface WaiterData {
  error: boolean;
  errormessage: string;
  userDetails: {
    _id: string;
    ordersAwaiting: Order[];
    ordersServed: Order[];
    username: string;
    email: string;
    role: string;
    idRestaurant: string;
    salt: string;
    digest: string;
    __v: number;
  };
}

@Component({
  selector: 'app-display-orders-awaiting',
  templateUrl: './display-orders-awaiting.component.html',
  styleUrls: ['./display-orders-awaiting.component.css']
})
export class DisplayOrdersAwaitingComponent {

  tables: Table[] = [];

  ordersAwaiting: Order[] = [];
  ordersServed: Order[] = [];




  constructor(private ups : UserPropertyService,
    private socketService: SocketService,
    private trs : TablesRequestService,
    private ors : OrdersRequestService,
    private srus : SelfUserRequestService,
    private router: Router
  ) {
    this.getTables();
    this.get_myself()

    this.socketService.joinRestaurantRoom(this.ups.getRestaurant());
    const socket = socketService.getSocket()

    socket.fromEvent("fetchTableNeeded").subscribe((data) => {
      console.log("fetchItemsNeeded")
      this.getTables()
    });


    socket.fromEvent("fetchOrdersNeeded").subscribe((data) => {
      console.log("fetchItemsNeeded")
      this.get_myself()
    });
  }

  getTables() {
    this.trs.getTables().subscribe((data: TablesResponse) => {
      this.tables = data.tables;
    });
  }

  get_myself() {
    this.srus.getMySelf().subscribe((data: WaiterData) => {
      console.log(data);
      this.ordersAwaiting = data.userDetails.ordersAwaiting;
      this.ordersServed = data.userDetails.ordersServed
    });
  }

  getTableByGroup(idGroup: string): string | undefined {
    const table = this.tables.find(table => table.group === idGroup);
    return table ? table._id : undefined;
  }

  getTableNameByGroup(idGroup: string): string | undefined {
    const table = this.tables.find(table => table.group === idGroup);
    return table ? table.tableNumber : undefined;
  }

  serveOrder(order: Order) {
    const idTable = this.getTableByGroup(order.idGroup);

    if (idTable) {
      this.ors.modifyOrderServed(idTable, order._id).subscribe((data: WaiterData) => {
        this.get_myself();
      });
    } else {
      console.error('Tavolo non trovato per il gruppo:', order.idGroup);
    }
  }
}
