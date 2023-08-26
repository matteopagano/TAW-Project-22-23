import { Component } from '@angular/core';
import { SocketService } from 'src/app/socket.service';
import { CurveFactory } from 'd3-shape';

import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { UsersRequestService } from 'src/app/common/api/http-requests/requests/users/users-request.service';
import { Cashier, CashiersResponse, Waiter, WaitersResponse, Cooker, CookersResponse, Bartender, BartendersResponse } from 'src/app/common/interfaces/api/users/users-api-interfaces';


@Component({
  selector: 'app-display-users',
  templateUrl: './display-users.component.html',
  styleUrls: ['./display-users.component.css']
})
export class DisplayUsersComponent {
  newUserData: any;
  newRestaurant : string = ''

  cashiers: Cashier[] = [];
  waiters: Waiter[] = [];
  cooks: Cooker[] = [];
  bartenders: Bartender[] = [];

  constructor(private ups : UserPropertyService,
    private socketService: SocketService,
    private urs : UsersRequestService,
  ){
    this.get_cashiers();
    this.get_waiters()
    this.get_bartenders()
    this.get_cooks()
    this.socketService.joinRestaurantRoom(this.ups.getRestaurant());
  }


  get_cashiers(){
    this.urs.get_cashiers().subscribe((data: CashiersResponse) => {
      this.cashiers = data.cashiers;
    });
  }

  get_waiters(){
    this.urs.get_waiters().subscribe((data: WaitersResponse) => {
      this.waiters = data.waiters;
    });
  }

  get_cooks() {
    this.urs.get_cooks().subscribe((data: CookersResponse) => {
      this.cooks = data.cooks;
    });
  }

  get_bartenders() {
    this.urs.get_bartenders().subscribe((data: BartendersResponse) => {
      this.bartenders = data.bartenders;
    });
  }

  deleteCashier(cashierId: string): void {
    this.urs.delete_cashier(cashierId).subscribe(() => {
      this.get_cashiers();
    });
  }

  deleteWaiter(waiterId: string): void {
    this.urs.delete_waiter(waiterId).subscribe(() => {
      this.get_waiters();
    });
  }


  deleteCook(cookerId: string): void {
    this.urs.delete_cook(cookerId).subscribe(() => {
      this.get_cooks();
    });
  }

  deleteBartender(bartenderId: string): void {
    this.urs.delete_bartender(bartenderId).subscribe(() => {
      this.get_bartenders();
    });
  }


}
