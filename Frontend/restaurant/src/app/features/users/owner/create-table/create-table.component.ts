import { Component } from '@angular/core';
import { SocketService } from 'src/app/socket.service';

import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { TablesRequestService } from 'src/app/common/api/http-requests/requests/tables/tables-request.service';
import { OrdersRequestService } from 'src/app/common/api/http-requests/requests/orders/orders-request.service';
import { ItemsRequestService } from 'src/app/common/api/http-requests/requests/items/items-request.service';
import { GroupsRequestService } from 'src/app/common/api/http-requests/requests/groups/groups-request.service';
import { RecipesRequestService } from 'src/app/common/api/http-requests/requests/recipes/recipes-request.service';
import { UsersRequestService } from 'src/app/common/api/http-requests/requests/users/users-request.service';
import { Router } from '@angular/router';



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



@Component({
  selector: 'app-create-table',
  templateUrl: './create-table.component.html',
  styleUrls: ['./create-table.component.css']
})
export class CreateTableComponent {

  responseMessage: string;
  tables: Table[] = [];

  newTable: {
    tableNumber: string,
    maxSeats: number } =
    {
      tableNumber: '',
      maxSeats: 0
    };

  constructor(private ups : UserPropertyService,
    private socketService: SocketService,
    private trs : TablesRequestService,
  ){
    this.socketService.joinRestaurantRoom(this.ups.getRestaurant());
    this.responseMessage = ''

  }

  addNewTable() {
    this.trs.addTable(this.newTable).subscribe(
      response => {
        console.log('Tavolo aggiunto con successo:', response);

        this.responseMessage = "Added " + response.table.tableNumber
        this.newTable = { tableNumber: '', maxSeats: 0 };
        this.socketService.emitFetchTable(this.ups.getRestaurant())
      },
      error => {
        console.error('Errore durante l\'aggiunta del tavolo:', error);
      }
    );
  }





}
