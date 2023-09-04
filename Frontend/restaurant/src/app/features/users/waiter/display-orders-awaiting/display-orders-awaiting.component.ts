import { Component } from '@angular/core';
import { SocketService } from 'src/app/socket.service';

import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { OrdersRequestService } from 'src/app/common/api/http-requests/requests/orders/orders-request.service';
import { SelfUserRequestService } from 'src/app/common/api/http-requests/requests/self-user/self-user-request.service';

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
  idGroup: IdGroup;
  idWaiter: string;
  items: OrderItem[];
  state: string;
  timeCompleted: Date | null;
  timeStarted: Date;
  type: string;
  __v: number;
}

export interface IdGroup {
  _id: string;
  dateFinish: Date | null;
  dateStart: Date;
  idRecipe: string | null;
  idRestaurant: string;
  idTable: IdTable;
  numberOfPerson: number;
  ordersList: string[];
  __v: number;
}

export interface IdTable {
  _id: string;
  group: string;
  maxSeats: number;
  restaurantId: string;
  tableNumber: string;
  numberOfPerson: number;
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
  styleUrls: ['./display-orders-awaiting.component.css'],
})
export class DisplayOrdersAwaitingComponent {
  ordersAwaiting: Order[] = [];

  constructor(
    private ups: UserPropertyService,
    private socketService: SocketService,
    private ors: OrdersRequestService,
    private srus: SelfUserRequestService
  ) {
    this.get_myself();

    this.socketService.joinRestaurantRoom(
      this.ups.getRestaurant() + ups.getId() + 'ordersAwaited'
    );
    const socket = socketService.getSocket();

    socket.fromEvent('fetchOrderReady').subscribe((data: any) => {
      console.log('fetchOrderReady');

      const index = this.ordersAwaiting.findIndex(
        (order) => order._id === data.order._id
      );

      if (index !== -1) {
        this.ordersAwaiting[index] = data.order;

      } else {
        console.log('Ordine non trovato');
      }
    });
  }

  get_myself() {
    this.srus.getMySelf().subscribe((data: WaiterData) => {
      this.ordersAwaiting = data.userDetails.ordersAwaiting;
    });
  }

  serveOrder(order: Order) {
    const idTable = order.idGroup.idTable;

    if (idTable) {
      this.ors
        .modifyOrderServed(order.idGroup.idTable._id, order._id)
        .subscribe((data: WaiterData) => {
          const index = this.ordersAwaiting.findIndex(
            (orderAwaited) => orderAwaited._id === order._id
          );

          if (index !== -1) {
            this.ordersAwaiting.splice(index, 1);

          } else {
            console.log('Ordine non trovato');
          }
        });
    } else {
      console.error('Tavolo non trovato per il gruppo:', order.idGroup);
    }
  }
}
