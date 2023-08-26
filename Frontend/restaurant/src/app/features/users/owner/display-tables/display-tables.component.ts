import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SocketService } from 'src/app/socket.service';
import { Chart } from 'chart.js';

import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { TablesRequestService } from 'src/app/common/api/http-requests/requests/tables/tables-request.service';


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
  selector: 'app-display-tables',
  templateUrl: './display-tables.component.html',
  styleUrls: ['./display-tables.component.css']
})
export class DisplayTablesComponent{

  tables: Table[] = [];
  constructor(private ups : UserPropertyService,
    private socketService: SocketService,
    private trs : TablesRequestService,
  ){
    this.getTables()
    this.socketService.joinRestaurantRoom(this.ups.getRestaurant());
    const socket = socketService.getSocket()
    socket.fromEvent("fetchTableNeeded").subscribe((data) => {
      console.log("fetchTableNeeded")
      this.getTables()
    });

  }
  getTables() {
    this.trs.getTables().subscribe((data: TablesResponse) => {
      this.tables = data.tables;
    });
  }

  deleteTable(tableId: string) {
    this.trs.deleteTable(tableId).subscribe(() => {
      this.socketService.emitFetchTable(this.ups.getRestaurant())
      this.getTables();
    });
  }



}
