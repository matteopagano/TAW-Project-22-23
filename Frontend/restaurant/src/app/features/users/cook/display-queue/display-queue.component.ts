import { Component } from '@angular/core';
import { SocketService } from 'src/app/socket.service';

import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { TablesRequestService } from 'src/app/common/api/http-requests/requests/tables/tables-request.service';
import { OrdersRequestService } from 'src/app/common/api/http-requests/requests/orders/orders-request.service';
import { ItemsRequestService } from 'src/app/common/api/http-requests/requests/items/items-request.service';


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
  idTable : string
  __v: number;
}

export interface OrderItem {
  timeFinished: string | null;
  idItem: idItem;
  state: string;
  completedBy: string | null;
  count: number;
  _id: string;
}

interface idItem {
  countServered: number;
  idRestaurant: string;
  itemName: string;
  itemType: string;
  preparationTime: number;
  price: number;
  __v: number;
  _id: string;
}


@Component({
  selector: 'app-display-queue',
  templateUrl: './display-queue.component.html',
  styleUrls: ['./display-queue.component.css']
})
export class DisplayQueueComponent {
  tables: Table[] = [];
  orders: Order[] = [];

  constructor(private ups : UserPropertyService,
    private socketService: SocketService,
    private trs : TablesRequestService,
    private ors : OrdersRequestService,
  ) {
    this.getOrders()

    this.socketService.joinRestaurantRoom(this.ups.getRestaurant());
    const socket = socketService.getSocket()

    socket.fromEvent("fetchTableNeeded").subscribe((data) => {
      console.log("fetchItemsNeeded")
      this.getOrders()
    });


    socket.fromEvent("fetchNewOrderDish").subscribe((data : any) => {
      console.log("fetchNewOrderDish")
      data.order.idTable = data.idTable
      this.orders.push(data.order)
    })

    socket.fromEvent("fetchItemOfOrderDishStatus").subscribe((data: any) => {
      console.log("fetchItemOfOrderDishStatus");
      console.log(data);

      const index = this.orders.findIndex((order) => order._id === data.order._id);

      if (index !== -1) {
        this.orders[index] = data.order;

        console.log("Ordine modificato:", this.orders[index]);
      } else {
        console.log("Ordine non trovato");
      }
    });


    socket.fromEvent("fetchOrderDishStatus").subscribe((data: any) => {
      console.log("fetchOrderDishStatus");
      console.log(data);

      const index = this.orders.findIndex((order) => order._id === data.order._id);

      if (index !== -1) {
        this.orders.splice(index, 1);
      } else {
        console.log("Ordine non trovato");
      }

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
            this.ors.getOrdersDishNotStartedByTable(table._id).subscribe(
              (data) => {
                data.orders.forEach((order: { idTable: string; }) => {
                  order.idTable = table._id;
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
        console.log(tempOrders)
        this.orders = tempOrders
      } catch (error) {
        console.error('Errore durante il recupero degli ordini:', error);
      }
    });
  }


  itemCompleted(table : string, order: string, item : string) {
    this.ors.modifyItemOfOrderCompleted(table, order, item).subscribe((data) => {

      console.log("stampo data")
      console.log(data)

      const orderToModify = this.orders.find((orderObj) => orderObj._id === order);
      if (orderToModify) {
        console.log(orderToModify)
        console.log(item)

        const targetItem = orderToModify.items.find((orderItem) => orderItem.idItem._id === item);

        if (targetItem) {
          targetItem.state = "completed";
          this.socketService.emitItemOfOrderDishStatus(this.ups.getRestaurant(), data.orderModified)
        } else {
          console.log("Elemento non trovato");
        }
      } else {
        console.log("Ordine non trovato");
      }
    })
  }

  orderCompleted(tableId: string, orderId: string) {
    this.ors.modifyOrderReady(tableId, orderId).subscribe((data) => {

      const orderIndexToRemove = this.orders.findIndex((orderObj) => orderObj._id === orderId);

      if (orderIndexToRemove !== -1) {
        this.orders.splice(orderIndexToRemove, 1);
        console.log(data)
        this.socketService.emitOrderDishCompleted(this.ups.getRestaurant(), data.orderModifyied);
      } else {
        console.log("Ordine non trovato");
      }

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
