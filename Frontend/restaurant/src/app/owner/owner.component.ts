import { Component } from '@angular/core';
import { UserHttpService } from '../user-http.service';
import { RestaurantHttpService } from '../restaurant-http.service';

import { FormsModule } from '@angular/forms'; // Assicurati di aver importato FormsModule
import { SocketService } from '../socket.service';


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
  // Altre proprietà specifiche dei cuochi
}

interface Bartender {
  _id: string;
  username: string;
  email: string;
  role: string;
  idRestaurant: string;
  // Altre proprietà specifiche dei barman
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

  cashiers: Cashier[] = [];
  waiters: Waiter[] = [];
  cooks: Cooker[] = [];
  bartenders: Bartender[] = [];
  items: any[] = [];
  tables: Table[] = [];

  public groups: Group[] = []; // Assicurati che il tipo sia corretto in base alla struttura dei tuoi dati

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
    }; // Inizializza i dati del nuovo tavolo



  constructor(private rs: RestaurantHttpService, private socketService: SocketService){
    this.get_cashiers();
    this.get_waiters()
    this.get_bartenders()
    this.get_cooks()
    this.fetchItems()
    this.getTables()
    this.getGroups();
    this.getRecipes()


    this.socketService.joinRestaurantRoom(rs.getRestaurantId());
    const socket = socketService.getSocket()
    socket.fromEvent("fetchTableNeeded").subscribe((data) => {
      console.log("fetchTableNeeded")
      // Questa funzione verrà chiamata quando arriva un evento con il nome specificato
      this.getTables()
      // Puoi aggiungere qui la logica per gestire i dati ricevuti
    });

    socket.fromEvent("fetchItemsNeeded").subscribe((data) => {
      console.log("fetchItemsNeeded")
      // Questa funzione verrà chiamata quando arriva un evento con il nome specificato
      this.fetchItems()
      // Puoi aggiungere qui la logica per gestire i dati ricevuti
    });

    socket.fromEvent("fetchGroupsNeeded").subscribe((data) => {
      console.log("fetchGroupsNeeded")
      // Questa funzione verrà chiamata quando arriva un evento con il nome specificato
      this.getGroups()
      // Puoi aggiungere qui la logica per gestire i dati ricevuti
    });

    socket.fromEvent("fetchRecipesNeeded").subscribe((data) => {
      console.log("fetchRecipesNeeded")
      // Questa funzione verrà chiamata quando arriva un evento con il nome specificato
      this.getRecipes()
      // Puoi aggiungere qui la logica per gestire i dati ricevuti
    });


  }

  get_cashiers(){
    this.rs.get_cashiers().subscribe((data: CashiersResponse) => {
      this.cashiers = data.cashiers;
    });
  }

  get_waiters(){
    this.rs.get_waiters().subscribe((data: WaitersResponse) => {
      this.waiters = data.waiters;
    });
  }

  deleteCashier(cashierId: string): void {
    this.rs.delete_cashier(cashierId).subscribe(() => {
      this.get_cashiers();
    });
  }

  deleteWaiter(waiterId: string): void {
    this.rs.delete_waiter(waiterId).subscribe(() => {
      this.get_waiters();
    });
  }

  get_cooks() {
    this.rs.get_cooks().subscribe((data: CookersResponse) => {
      this.cooks = data.cooks;
    });
  }

  get_bartenders() {
    this.rs.get_bartenders().subscribe((data: BartendersResponse) => {
      this.bartenders = data.bartenders;
    });
  }

  deleteCook(cookerId: string): void {
    this.rs.delete_cook(cookerId).subscribe(() => {
      this.get_cooks();
    });
  }

  deleteBartender(bartenderId: string): void {
    this.rs.delete_bartender(bartenderId).subscribe(() => {
      this.get_bartenders();
    });
  }


  createUser(): void {
    console.log(this.newUser)
    this.rs.create_user(this.newUser).subscribe((response) => {
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
    this.rs.addNewItem(this.newItem).subscribe(
      response => {
        console.log('Item aggiunto con successo:', response);
        this.socketService.emitFetchItems(this.rs.getRestaurantId())
        this.fetchItems()
        this.newItem = {};
      },
      error => {
        console.error('Errore durante l\'aggiunta dell\'item:', error);
      }
    );
  }

  fetchItems() {
    this.rs.getAllItems().subscribe(
      response => {
        this.items = response.tables;
      },
      error => {
        console.error('Errore durante il recupero degli item:', error);
      }
    );
  }

  deleteItem(itemId: string): void {
    this.rs.deleteItem(itemId).subscribe(
      () => {
        console.log('Item deleted successfully.');
        this.socketService.emitFetchItems(this.rs.getRestaurantId())
        this.fetchItems();
      },
      (error) => {
        console.error('Error deleting item:', error);
      }
    );
  }

  addNewTable() {
    this.rs.addTable(this.newTable).subscribe(
      response => {
        console.log('Tavolo aggiunto con successo:', response);
        // Esegui qualsiasi azione aggiuntiva necessaria dopo l'aggiunta del tavolo
        this.newTable = { tableNumber: '', maxSeats: 0 }; // Resetta i dati del nuovo tavolo
        this.socketService.emitFetchTable(this.rs.getRestaurantId())
        this.getTables()
      },
      error => {
        console.error('Errore durante l\'aggiunta del tavolo:', error);
      }
    );
  }

  getTables() {
    this.rs.getTables().subscribe((data: TablesResponse) => {
      this.tables = data.tables;
    });
  }

  deleteTable(tableId: string) {
    this.rs.deleteTable(tableId).subscribe(() => {
      this.socketService.emitFetchTable(this.rs.getRestaurantId())
      // Dopo aver eliminato il tavolo, aggiorniamo la lista dei tavoli
      this.getTables();
    });
  }



  getGroups() {
    this.rs.getGroups().subscribe((data) => {
      this.groups = data.groups; // Assegna i dati ricevuti dal servizio alla variabile groups
    }, (error) => {
      console.error('Errore nel recupero dei gruppi:', error);
    });
  }

  getRecipes() {
    this.rs.getRecipes().subscribe((data) => {
      this.recipes = data.recipes; // Assegna i dati ricevuti dal servizio alla variabile groups
    }, (error) => {
      console.error('Errore nel recupero delle ricette:', error);
    });
  }

  getRecipeById(recipeId: string): Recipe | undefined {
    return this.recipes.find((recipe) => recipe._id === recipeId);
  }

}
