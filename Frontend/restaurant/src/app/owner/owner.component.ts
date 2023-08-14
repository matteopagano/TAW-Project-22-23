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

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css']
})
export class OwnerComponent {

  cashiers: Cashier[] = [];
  waiters: Waiter[] = [];

  newUser: any = {
    username: '',
    email: '',
    role: 'cashier'
  };

  constructor(private us: UserHttpService, private rs: RestaurantHttpService){
    this.get_cashiers();
    this.get_waiters()
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

  createUser(): void {
    this.rs.create_user(this.newUser).subscribe(() => {
      if (this.newUser.role === 'cashier') {
        this.get_cashiers();
      } else {
        this.get_waiters();
      }
      this.newUser = {
        username: '',
        email: '',
        role: 'cashier'
      };
    });
  }

}
