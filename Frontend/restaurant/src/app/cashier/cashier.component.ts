import { Component } from '@angular/core';
import { RestaurantHttpService } from '../restaurant-http.service';
import { SocketService } from '../socket.service';

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
  selector: 'app-cashier',
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.css']
})
export class CashierComponent {
  tables: Table[] = [];
  customerGroup: { numberOfPerson: number } = { numberOfPerson: 0 };
  selectedTable: any = null;
  ordersForTable: Order[] = [];
  menuItems: MenuItem[] = []; // Assumi che tu abbia un'interfaccia MenuItem

  constructor(private rs: RestaurantHttpService, private socketService: SocketService) {
    this.getTables();
    this.getMenuItems();

    this.socketService.joinRestaurantRoom(rs.getRestaurantId());
    const socket = socketService.getSocket()

    socket.fromEvent("fetchTableNeeded").subscribe((data) => {
      console.log("fetchItemsNeeded")
      this.getTables()
    });

    socket.fromEvent("fetchItemsNeeded").subscribe((data) => {
      console.log("fetchItemsNeeded")
      // Questa funzione verrà chiamata quando arriva un evento con il nome specificato
      this.getMenuItems()
      // Puoi aggiungere qui la logica per gestire i dati ricevuti
    });


  }

  getTables() {
    this.rs.getTables().subscribe((data: TablesResponse) => {
      this.tables = data.tables;
    });
  }

  removeCustomer(tableId: string) {
    this.rs.removeCustomerFromTable(tableId).subscribe((data) => {
      // Aggiorna la lista dei tavoli dopo la rimozione del cliente
      this.socketService.emitFetchTable(this.rs.getRestaurantId())
      this.socketService.emitFetchGroups(this.rs.getRestaurantId())
      this.getTables();
    });
  }

  calculateRecipe(tableId: string) {
    this.rs.calculateRecipe(tableId).subscribe(response => {
      if (!response.error) {
        this.socketService.emitFetchRecipes(this.rs.getRestaurantId())
        this.socketService.emitFetchGroups(this.rs.getRestaurantId())
      }
    });
  }

  viewOrders(tableId: string) {
  }

  toggleTableDetails(table: string) {
    this.selectedTable = this.selectedTable === table ? null : table;
    console.log("table")
    console.log(table)
    // Chiamata per ottenere gli ordini del tavolo selezionato
    if (this.selectedTable) {
      this.getOrders(table);
    }
  }

  getOrders(tableId: string) {
    this.rs.getOrdersByGroup(tableId).subscribe(response => {
      if (!response.error) {
        // Aggiorna la variabile ordersForTable con gli ordini ricevuti
        console.log(response.orders)
        this.ordersForTable = response.orders;
      }
    });
  }

  getMenuItems() {
    this.rs.getMenuItems().subscribe((data: MenuItemsResponse) => {
      console.log("menu items")
      console.log(data.tables)
      this.menuItems = data.tables;
    });
  }

  findItemName(target : string){
    return this.menuItems.find(item => item._id === target)?.itemName
  }
}




