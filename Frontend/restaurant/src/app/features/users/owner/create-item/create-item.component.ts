import { Component } from '@angular/core';
import { SocketService } from 'src/app/socket.service';

import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { ItemsRequestService } from 'src/app/common/api/http-requests/requests/items/items-request.service';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.css']
})
export class CreateItemComponent {
  items: any[] = [];
  responseMessage: string = ''

  newItem: any = {
    itemName: '',
    itemType: 'dish',
    price: 0,
    preparationTime: 0
  };


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

  addNewItem() {
    this.irs.addItem(this.newItem).subscribe(
      response => {
        console.log('Item aggiunto con successo:', response);
        console.log(response)
        this.responseMessage = "Added " + response.newItem.itemName
        this.socketService.emitFetchItems(this.ups.getRestaurant())
        this.fetchItems()
        this.newItem = {};
      },
      error => {
        console.error('Errore durante l\'aggiunta dell\'item:', error);
      }
    );
  }

  fetchItems() {
    this.irs.getItems().subscribe(
      response => {
        this.items = response.tables;
      },
      error => {
        console.error('Errore durante il recupero degli item:', error);
      }
    );
  }
}
