import { Component } from '@angular/core';
import { SocketService } from 'src/app/socket.service';

import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { ItemsRequestService } from 'src/app/common/api/http-requests/requests/items/items-request.service';
import { Item } from 'src/app/common/interfaces/api/users/users-api-interfaces';


@Component({
  selector: 'app-display-items',
  templateUrl: './display-items.component.html',
  styleUrls: ['./display-items.component.css']
})
export class DisplayItemsComponent {

  items: Item[] = [];
  sortBy: string = 'name';
  showType: string = 'All';

  filteredItems : any[] = [];



  constructor(private ups : UserPropertyService,
    private socketService: SocketService,
    private irs : ItemsRequestService,
  ){
    this.fetchItems()


    this.socketService.joinRestaurantRoom(this.ups.getRestaurant());
    const socket = socketService.getSocket()

    socket.fromEvent("fetchItemsNeeded").subscribe((data) => {
      console.log("fetchItemsNeeded")
      this.fetchItems()
    });



  }

  fetchItems() {
    this.irs.getItems().subscribe(
      response => {
        this.items = response.tables;
        this.applyFilters()
      },
      error => {
        console.error('Errore durante il recupero degli item:', error);
      }
    );
  }

  deleteItem(itemId: string): void {
    this.irs.deleteItem(itemId).subscribe(
      () => {
        console.log('Item deleted successfully.');
        this.socketService.emitFetchItems(this.ups.getRestaurant())
        this.fetchItems();
      },
      (error) => {
        console.error('Error deleting item:', error);
      }
    );
  }

  applyFilters() {
    let filteredItems = [...this.items];

    if (this.showType !== 'All') {
      filteredItems = filteredItems.filter((item) => item.itemType === this.showType);
    }

    if (this.sortBy === 'name') {
      filteredItems.sort((a, b) => a.itemName.localeCompare(b.itemName));
    } else if (this.sortBy === 'priceLE') {
      filteredItems.sort((a, b) => a.price - b.price);
    }else {
      filteredItems.sort((a, b) => b.price - a.price);
    }

    this.filteredItems = filteredItems;
  }



}
