import { Component } from '@angular/core';
import { SocketService } from 'src/app/socket.service';

import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { TablesRequestService } from 'src/app/common/api/http-requests/requests/tables/tables-request.service';
import { GroupsRequestService } from 'src/app/common/api/http-requests/requests/groups/groups-request.service';
import { Router } from '@angular/router';

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

@Component({
  selector: 'app-display-tables',
  templateUrl: './display-tables.component.html',
  styleUrls: ['./display-tables.component.css'],
})
export class DisplayTablesComponent {
  tables: Table[] = [];
  numberOfPersons: { [tableId: string]: number } = {};

  constructor(
    private ups: UserPropertyService,
    private socketService: SocketService,
    private trs: TablesRequestService,
    private grs: GroupsRequestService,
    private router: Router
  ) {
    this.getTables();

    this.socketService.joinRestaurantRoom(this.ups.getRestaurant());
    const socket = socketService.getSocket();

    socket.fromEvent('fetchTableNeeded').subscribe((data) => {
      console.log('fetchItemsNeeded');
      this.getTables();
    });
  }

  getTables() {
    this.trs.getTables().subscribe((data: TablesResponse) => {
      this.tables = data.tables;
    });
  }

  initializeCustomerGroup() {
    this.numberOfPersons = {  };
  }

  addCustomerGroup(tableId: string) {
    const table = this.tables.find((t) => t._id === tableId);

    if (table) {
      const numberOfPerson = this.numberOfPersons[tableId];

      if (numberOfPerson !== undefined && numberOfPerson > 0) {
        const newGroup = {
          numberOfPerson: numberOfPerson
        };

        this.grs.addGroupToTable(tableId, newGroup).subscribe(
          (response) => {
            console.log('Customer Group aggiunto con successo:', response);
            this.socketService.emitFetchTable(this.ups.getRestaurant());
            this.socketService.emitFetchGroups(this.ups.getRestaurant());
            this.getTables();
            this.initializeCustomerGroup();
          },
          (error) => {
            console.error("Errore durante l'aggiunta del Customer Group:", error);
          }
        );

      }


    } else {
      console.error('Tavolo non trovato:', tableId);
    }
  }

  getTableByGroup(idGroup: string): string | undefined {
    const table = this.tables.find((table) => table.group === idGroup);
    return table ? table._id : undefined;
  }

  getTableNameByGroup(idGroup: string): string | undefined {
    const table = this.tables.find((table) => table.group === idGroup);
    return table ? table.tableNumber : undefined;
  }

  logout() {
    this.ups.logout();
    this.router.navigate(['/authentication/login']);
  }
}
