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




// Interfaccia per una lista di ordini
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

@Component({
  selector: 'app-waiter',
  templateUrl: './waiter.component.html',
  styleUrls: ['./waiter.component.css']
})
export class WaiterComponent {

  selectedTable: any = null; // Inizialmente nessun tavolo selezionato
  tableDetails: CustomerGroupDetails = {
    _id: '',
    numberOfPerson: 0,
    dateStart: '',
    dateFinish: '',
    ordersList: [],
    idRestaurant: '',
    idRecipe: '',
    idTable: '',
    __v: 0 // Questa è una proprietà che sembra essere un numero
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

  // Aggiungi un metodo di inizializzazione per inizializzare numberOfPerson
  initializeCustomerGroup() {
    this.customerGroup = { numberOfPerson: 0 };
  }



  addCustomerGroup(tableId: string) {
    const table = this.tables.find(t => t._id === tableId);

    if (table) {
      // Utilizza numberOfPerson da customerGroup correttamente in questo punto
      this.rs.addGroupToTable(tableId, this.customerGroup).subscribe(
        response => {
          console.log('Customer Group aggiunto con successo:', response);
          this.socketService.emitFetchTable(this.rs.getRestaurantId())
          this.socketService.emitFetchGroups(this.rs.getRestaurantId())
          this.getTables()
          // Dopo l'aggiunta, reinizializza numberOfPerson
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
    this.rs.getMenuItems().subscribe((data: MenuItemsResponse) => {
      console.log("menu items")
      console.log(data.tables)
      this.menuItems = data.tables;
    });
  }

  // Metodo per aggiungere un item all'ordine temporaneo
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

        // Resetta i campi di selezione
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
      // Deseleziona il tavolo e i suoi dettagli se è già selezionato
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
        __v: 0 // Questa è una proprietà che sembra essere un numero
      };
    } else {
      // Seleziona il tavolo e carica i suoi dettagli
      this.selectedTable = table;

      // Qui puoi effettuare la chiamata HTTP per ottenere i dettagli del tavolo
      // Utilizza il servizio RestaurantHttpService e salva i dettagli nel componente
      this.rs.getTableGroupDetails(table._id).subscribe((data) => {
        console.log(data)
        this.tableDetails = data.group;
      });
      console.log(this.tableDetails)
    }
  }

  createOrder() {
    // Crea l'oggetto ordine con i dettagli necessari, ad esempio orderName e items.
    const order = {
      items: this.currentOrder // Assumi che selectedItems sia un array di oggetti selezionati dall'utente
    };

    // Chiamata al servizio per inviare l'ordine
    this.rs.createGroupOrder(this.selectedTable._id, order).subscribe((response) => {
      // Gestisci la risposta o aggiorna l'interfaccia utente come necessario
      console.log('Ordine inviato con successo', response);
      // Esegui altre azioni, come pulire il form
      this.resetForm();
    }, (error) => {
      console.error('Errore nell\'invio dell\'ordine', error);
    });
  }

  resetForm() {
    // Pulisci il form dopo aver inviato l'ordine
    this.orderName = '';
    this.currentOrder = []; // Assumi che selectedItems sia un array in cui mantieni gli oggetti selezionati dall'utente
  }




}
