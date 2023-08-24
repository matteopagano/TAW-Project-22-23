import { Component } from '@angular/core';
import { SocketService } from 'src/app/socket.service';
import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { TablesRequestService } from 'src/app/common/api/http-requests/requests/tables/tables-request.service';
import { OrdersRequestService } from 'src/app/common/api/http-requests/requests/orders/orders-request.service';
import { ItemsRequestService } from 'src/app/common/api/http-requests/requests/items/items-request.service';
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

export interface Table {
  _id: string;
  tableNumber: string;
  maxSeats: number;
  group: string | null;
  restaurantId: string;
  __v: number;
}

export interface Order {
  _id: string;
  idGroup: string;
  idWaiter: string;
  items: OrderItem[];
  state: string;
  timeCompleted: string | null;
  timeStarted: string;
  tableId : string
  __v: number;
}

export interface OrderItem {
  timeFinished: string | null;
  idItem: string;
  state: string;
  completedBy: string | null;
  count: number;
  _id: string;
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
  selector: 'app-display-queue',
  templateUrl: './display-queue.component.html',
  styleUrls: ['./display-queue.component.css']
})
export class DisplayQueueComponent {
  tables: Table[] = [];
  orders: Order[] = [];
  menuItems: MenuItem[] = [];

  constructor(
      private ups : UserPropertyService,
      private socketService: SocketService,
      private trs : TablesRequestService,
      private ors : OrdersRequestService,
      private irs : ItemsRequestService,
      private router : Router
    ) {
    this.getOrders()
    this.getMenuItems()

    this.socketService.joinRestaurantRoom(ups.getRestaurant());
    const socket = socketService.getSocket()

    socket.fromEvent("fetchTableNeeded").subscribe((data) => {
      console.log("fetchItemsNeeded")
      this.getOrders()
    });



    socket.fromEvent("fetchOrdersNeeded").subscribe((data) => {
      console.log("fetchOrdersNeeded")
      this.getOrders()
    });

    socket.fromEvent("fetchItemsNeeded").subscribe((data) => {
      console.log("fetchItemsNeeded")
      this.getMenuItems()
    });


  }


  async getOrders() {
    this.trs.getTablesNotEmpty().subscribe(async (data) => {
      this.tables = data.tables;

      const orderPromises = [];

      let tempOrders : Order[] = [];
      for (const table of this.tables) {
        if (table) {
          const orderPromise = new Promise<void>((resolve, reject) => {
            this.ors.getOrdersDrinkNotStartedByTable(table._id).subscribe(
              (data) => {
                data.orders.forEach((order: { tableId: string; }) => {
                  order.tableId = table._id;
                });

                tempOrders = tempOrders.concat(data.orders);
                resolve();
              },
              (error) => {
                reject(error);
              }
            );
          });
          orderPromises.push(orderPromise);
        }
      }

      try {
        await Promise.all(orderPromises);

        tempOrders.sort((a, b) => {
          return new Date(a.timeStarted).getTime() - new Date(b.timeStarted).getTime();
        });
        this.orders = tempOrders
        console.log(tempOrders)

      } catch (error) {
        console.error('Errore durante il recupero degli ordini:', error);
      }
    });
  }


  getMenuItems() {
    this.irs.getItems().subscribe((data: MenuItemsResponse) => {
      this.menuItems = data.tables;
    });
  }

  findItemName(target : string){
    return this.menuItems.find(item => item._id === target)?.itemName
  }

  itemCompleted(table : string, order: string, item : string) {
    this.ors.modifyItemOfOrderCompleted(table, order, item).subscribe((data) => {
      this.socketService.emitFetchOrders(this.ups.getRestaurant())

    })


  }


  orderCompleted(tableId: string, orderId: string) {
    this.ors.modifyOrderReady(tableId, orderId).subscribe((data) => {
      this.socketService.emitFetchOrders(this.ups.getRestaurant())
      console.log(data)

    })
  }

  isOrderCompleted(order: Order): boolean {
    for (const item of order.items) {
      if (item.state !== 'completed') {
        return false;
      }
    }
    return true;
  }
}
