import { Component } from '@angular/core';
import { UserHttpService } from '../user-http.service';
import { RestaurantHttpService } from '../restaurant-http.service';

import { FormsModule } from '@angular/forms'; // Assicurati di aver importato FormsModule


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



  constructor(private us: UserHttpService, private rs: RestaurantHttpService){
    this.get_cashiers();
    this.get_waiters()
    this.get_bartenders()
    this.get_cooks()
    this.fetchItems()

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
        this.fetchItems();
      },
      (error) => {
        console.error('Error deleting item:', error);
      }
    );
  }

}
