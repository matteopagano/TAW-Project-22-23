import { Component , OnInit} from '@angular/core';
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

    this.socketService.joinRestaurantRoom(this.ups.getRestaurant() + ups.getId() + "ordersAwaited");
    const socket = socketService.getSocket()

    socket.fromEvent("fetchOrdersNeeded").subscribe((data) => {
      console.log("fetchItemsNeeded")
      this.get_myself()
    });

    socket.fromEvent("fetchOrderComplete").subscribe((data) => {
      console.log("fetchOrderComplete")
      console.log(data)
    });


    socket.fromEvent("fetchOrdersReady").subscribe((data) => {
      console.log("fetchOrdersReady")
      console.log(data)


    });

     const today = new Date();
     const year = today.getFullYear();
     const month = (today.getMonth() + 1).toString().padStart(2, '0');
     const day = today.getDate().toString().padStart(2, '0');
     this.orderDate = `${year}-${month}-${day}`;

  }

  get_myself() {
    this.srus.getMySelf().subscribe((data: WaiterData) => {
      console.log(data);
      this.ordersServed = data.userDetails.ordersServed
      this.updateOrdersToShow();
    });
  }

  ordersToShow: number = 5;
  orderDate: string = '';
  orderSort: string = 'asc';



  filteredOrders: Order[] = [];


  updateOrdersToShow() {

    let filteredOrders = [...this.ordersServed];


    if (this.orderDate) {
      filteredOrders = filteredOrders.filter(order => {
        const orderDate = new Date(order.timeStarted).toISOString().slice(0, 10);
        return orderDate === this.orderDate;
      });
    }


    if (this.orderSort === 'asc') {
      filteredOrders.sort((a, b) => new Date(b.timeStarted).getTime() - new Date(a.timeStarted).getTime());
    } else if (this.orderSort === 'desc') {
      filteredOrders.sort((a, b) => new Date(a.timeStarted).getTime() - new Date(b.timeStarted).getTime());
    }

    filteredOrders = filteredOrders.slice(0, this.ordersToShow);

    this.filteredOrders = filteredOrders;
  }







}
