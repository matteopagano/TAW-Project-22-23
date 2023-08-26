import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemsRequestService } from 'src/app/common/api/http-requests/requests/items/items-request.service';
import { OrdersRequestService } from 'src/app/common/api/http-requests/requests/orders/orders-request.service';
import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { SocketService } from 'src/app/socket.service';


interface MenuItem {
  _id: string;
  itemName: string;
  itemType: string;
  price: number;
  preparationTime: number;
  idRestaurant: string;
  __v: number;
}

interface OrderItem {
  itemId: string;
  itemName: string;
  count: number;
}

interface MenuItemsResponse {
  error: boolean;
  errormessage: string;
  tables: MenuItem[];
}

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent {
  menuItems: MenuItem[] = [];
  cartItems: OrderItem[] = [];
  addedItemName = '';
  idTable : string = '';

  constructor(private irs : ItemsRequestService, private ors : OrdersRequestService, private route: ActivatedRoute, private socketService: SocketService,private ups : UserPropertyService,){
    this.getMenuItems();
    this.route.params.subscribe(params => {
      this.idTable = params['id'];
      console.log('ID recuperato dalla route:', this.idTable);

    });
  }

  getMenuItems() {
    this.irs.getItems().subscribe((data: MenuItemsResponse) => {
      console.log("menu items")
      console.log(data.tables)
      this.menuItems = data.tables;
    });
  }



  addToCart(itemId : string, itemName : string) {
    const existingItemIndex = this.cartItems.findIndex(cartItem => cartItem.itemId === itemId);

    if (existingItemIndex !== -1) {
      this.cartItems[existingItemIndex].count++;
    } else {
      const newItem: OrderItem = {
        itemId: itemId,
        itemName: itemName,
        count: 1
      };
      this.cartItems.push(newItem);
    }
  }

  getCartItems() {
    return this.cartItems;
  }

  clearCart() {
    this.cartItems = [];
  }


  avviaOrdine() {
    if (this.cartItems.length > 0) {
      const order = {
        items: this.cartItems
      };

      this.ors.createGroupOrder(this.idTable, order).subscribe((response) => {
        console.log('Ordine inviato con successo', response);
        this.socketService.emitFetchOrders(this.ups.getRestaurant())
      }, (error) => {
        console.error('Errore nell\'invio dell\'ordine', error);
      });
      console.log('Ordine avviato con successo!');
      this.cartItems = [];
    } else {
      console.log('Il carrello è vuoto. Aggiungi elementi al carrello prima di avviare l\'ordine.');
    }
  }

  svuotaCarrello() {
    this.cartItems = [];
  }

  rimuoviElemento(index: number) {
    this.cartItems.splice(index, 1);
  }

  aumentaQuantita(index: number) {
    this.cartItems[index].count++;
  }

  riduciQuantita(index: number) {
    if (this.cartItems[index].count > 1) {
      this.cartItems[index].count--;
    }
  }
}
