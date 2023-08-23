import { Component } from '@angular/core';
import { SocketService } from '../../../socket.service';

import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { TablesRequestService } from 'src/app/common/api/http-requests/requests/tables/tables-request.service';
import { OrdersRequestService } from 'src/app/common/api/http-requests/requests/orders/orders-request.service';
import { ItemsRequestService } from 'src/app/common/api/http-requests/requests/items/items-request.service';
import { GroupsRequestService } from 'src/app/common/api/http-requests/requests/groups/groups-request.service';
import { RecipesRequestService } from 'src/app/common/api/http-requests/requests/recipes/recipes-request.service';
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
  waiter: {
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
  selector: 'app-waiter',
  templateUrl: './waiter.component.html',
  styleUrls: ['./waiter.component.css']
})
export class WaiterComponent {

  selectedTable: any = null;
  tableDetails: CustomerGroupDetails = {
    _id: '',
    numberOfPerson: 0,
    dateStart: '',
    dateFinish: '',
    ordersList: [],
    idRestaurant: '',
    idRecipe: '',
    idTable: '',
    __v: 0
  };

  orderName: string = '';
  selectedItem: string = '';
  selectedItemQuantity: number = 1;
  currentOrder: OrderItem[] = [];

  customerGroupId: string ='';
  customerGroupDetails: any = null;
  tables: Table[] = [];
  customerGroup: any = { numberOfPerson: 0 };
  orderCount: number = 0;
  menuItems: MenuItem[] = [];

  ordersAwaiting: Order[] = [];
  ordersServed: Order[] = [];




  constructor(private ups : UserPropertyService,
    private socketService: SocketService,
    private trs : TablesRequestService,
    private ors : OrdersRequestService,
    private irs : ItemsRequestService,
    private grs : GroupsRequestService,
    private rrs : RecipesRequestService,
    private srus : SelfUserRequestService
  ) {
    this.getTables();
    this.getMenuItems();
    this.get_myself()

    this.socketService.joinRestaurantRoom(this.ups.getRestaurant());
    const socket = socketService.getSocket()

    socket.fromEvent("fetchTableNeeded").subscribe((data) => {
      console.log("fetchItemsNeeded")
      this.getTables()
    });

    socket.fromEvent("fetchItemsNeeded").subscribe((data) => {
      console.log("fetchItemsNeeded")
      this.getMenuItems()
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

  initializeCustomerGroup() {
    this.customerGroup = { numberOfPerson: 0 };
  }



  addCustomerGroup(tableId: string) {
    const table = this.tables.find(t => t._id === tableId);

    if (table) {
      this.grs.addGroupToTable(tableId, this.customerGroup).subscribe(
        response => {
          console.log('Customer Group aggiunto con successo:', response);
          this.socketService.emitFetchTable(this.ups.getRestaurant())
          this.socketService.emitFetchGroups(this.ups.getRestaurant())
          this.getTables()
          this.initializeCustomerGroup();
        },
        error => {
          console.error('Errore durante l\'aggiunta del Customer Group:', error);
        }
      );
    } else {
      console.error('Tavolo non trovato:', tableId);
    }
  }
  getMenuItems() {
    this.irs.getItems().subscribe((data: MenuItemsResponse) => {
      console.log("menu items")
      console.log(data.tables)
      this.menuItems = data.tables;
    });
  }

  addItemToOrder() {
    if (this.selectedItem && this.selectedItemQuantity > 0) {
      const selectedItemInfo = this.menuItems.find(item => item._id === this.selectedItem);

      if (selectedItemInfo) {
        const orderItem: OrderItem = {
          itemId: this.selectedItem,
          itemName: selectedItemInfo.itemName,
          count: this.selectedItemQuantity
        };

        this.currentOrder.push(orderItem);
        this.selectedItem = '';
        this.selectedItemQuantity = 1;
      }
    }
  }

  getOrderItemName(itemId: string): string {
    const menuItem = this.menuItems.find(item => item._id === itemId);
    return menuItem ? menuItem.itemName : 'Item non trovato';
  }

  toggleTableDetails(table: any) {
    if (this.selectedTable === table) {
      this.selectedTable = null;
      this.tableDetails = {
        _id: '',
        numberOfPerson: 0,
        dateStart: '',
        dateFinish: '',
        ordersList: [],
        idRestaurant: '',
        idRecipe: '',
        idTable: '',
        __v: 0
      };
    } else {
      this.selectedTable = table;
      this.grs.getGroupFromTable(table._id).subscribe((data) => {
        console.log(data)
        this.tableDetails = data.group;
      });
      console.log(this.tableDetails)
    }
  }

  createOrder() {
    const order = {
      items: this.currentOrder
    };

    this.ors.createGroupOrder(this.selectedTable._id, order).subscribe((response) => {
      console.log('Ordine inviato con successo', response);
      this.socketService.emitFetchOrders(this.ups.getRestaurant())
      this.get_myself()
      this.resetForm();
    }, (error) => {
      console.error('Errore nell\'invio dell\'ordine', error);
    });
  }

  resetForm() {
    this.orderName = '';
    this.currentOrder = [];
  }

  get_myself() {
    this.srus.getMySelf().subscribe((data: WaiterData) => {
      console.log(data);
      this.ordersAwaiting = data.waiter.ordersAwaiting;
      console.log( data.waiter.ordersServed)
      console.log("order served")
      this.ordersServed = data.waiter.ordersServed
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
