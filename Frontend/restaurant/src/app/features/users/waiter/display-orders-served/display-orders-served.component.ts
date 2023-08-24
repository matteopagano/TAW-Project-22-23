import { Component } from '@angular/core';
import { SocketService } from 'src/app/socket.service';
import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { SelfUserRequestService } from 'src/app/common/api/http-requests/requests/self-user/self-user-request.service';
import { Router } from '@angular/router';


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
  selector: 'app-display-orders-served',
  templateUrl: './display-orders-served.component.html',
  styleUrls: ['./display-orders-served.component.css']
})
export class DisplayOrdersServedComponent {

  ordersServed: Order[] = [];

  constructor(private ups : UserPropertyService,
    private socketService: SocketService,
    private srus : SelfUserRequestService,
    private router: Router
  ) {
    this.get_myself()

    this.socketService.joinRestaurantRoom(this.ups.getRestaurant());
    const socket = socketService.getSocket()

    socket.fromEvent("fetchOrdersNeeded").subscribe((data) => {
      console.log("fetchItemsNeeded")
      this.get_myself()
    });
  }

  get_myself() {
    this.srus.getMySelf().subscribe((data: WaiterData) => {
      console.log(data);
      this.ordersServed = data.userDetails.ordersServed
    });
  }


}
