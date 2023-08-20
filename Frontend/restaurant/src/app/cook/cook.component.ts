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
@Component({
  selector: 'app-cook',
  templateUrl: './cook.component.html',
  styleUrls: ['./cook.component.css']
})
export class CookComponent {
  tables: any[] = []; // Assicurati di avere una struttura dati con gli ordini per ciascun tavolo

  constructor(private rs: RestaurantHttpService) {
    this.getTables();
  }


  getTables() {
    this.rs.getTables().subscribe((data: TablesResponse) => {
      this.tables = data.tables;
    });
  }
}
