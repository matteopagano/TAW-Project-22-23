import { Component } from '@angular/core';
import { SocketService } from 'src/app/socket.service';
import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { TablesRequestService } from 'src/app/common/api/http-requests/requests/tables/tables-request.service';
import { OrdersRequestService } from 'src/app/common/api/http-requests/requests/orders/orders-request.service';
import { ItemsRequestService } from 'src/app/common/api/http-requests/requests/items/items-request.service';
import { GroupsRequestService } from 'src/app/common/api/http-requests/requests/groups/groups-request.service';
import { RecipesRequestService } from 'src/app/common/api/http-requests/requests/recipes/recipes-request.service';
import { ActivatedRoute } from '@angular/router';
import { PdfGeneratorService } from 'src/app/pdf-generator.service';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface Order {
  _id: string;
  idGroup: string;
  idWaiter: string;
  items: OrderItem[];
  state: string;
  timeCompleted: string | null;
  timeStarted: string;
  __v: number;
}
interface OrderItem {
  timeFinished: string | null;
  idItem: string;
  state: string;
  completedBy: string | null;
  count: number;
  _id: string;
}

interface MenuItem {
  _id: string;
  itemName: string;
  itemType: string;
  price: number;
  preparationTime: number;
  idRestaurant: string;
  __v: number;
}

interface MenuItemsResponse {
  error: boolean;
  errormessage: string;
  tables: MenuItem[];
}

export interface ItemForTable {
  name: string;
  price: number;
  quantity: number;
  _id: string;
  type: string;
}

@Component({
  selector: 'app-visualize-table-details',
  templateUrl: './visualize-table-details.component.html',
  styleUrls: ['./visualize-table-details.component.css'],
})
export class VisualizeTableDetailsComponent {
  idTable: string = '';
  itemsForTable: ItemForTable[] = [];
  menuItems: MenuItem[] = [];
  messageError = '';

  constructor(
    private ups: UserPropertyService,
    private socketService: SocketService,
    private ors: OrdersRequestService,
    private route: ActivatedRoute,
    private irs: ItemsRequestService,
    private rrs: RecipesRequestService,
    private pdfService: PdfGeneratorService,
    private grs: GroupsRequestService,
    private router: Router
  ) {
    this.route.params.subscribe((params) => {
      this.idTable = params['id'];
      console.log('ID recuperato dalla route:', this.idTable);
      this.socketService.joinRestaurantRoom(this.ups.getRestaurant());
      const socket = socketService.getSocket();
      socket.fromEvent('fetchOrdersNeeded').subscribe((data) => {
        console.log('fetchOrdersNeeded');
        this.getOrdersByTable();
      });
    });
    this.getOrdersByTable();
    this.getMenuItems();
  }
  getOrdersByTable() {
    this.ors.getOrdersByTable(this.idTable).subscribe((response) => {
      if (!response.error) {
        console.log(response.orders);
        this.itemsForTable = this.convertOrdersToItems(response.orders);
      }
    });
  }

  getMenuItems() {
    this.irs.getItems().subscribe((data: MenuItemsResponse) => {
      console.log('menu items');
      console.log(data.tables);
      this.menuItems = data.tables;
    });
  }

  findItemName(target: string): string {
    const menuItem = this.menuItems.find((item) => item._id === target);
    return menuItem ? menuItem.itemName : '';
  }
  findItemPrice(target: string): number {
    const menuItem = this.menuItems.find((item) => item._id === target);
    return menuItem ? menuItem.price : 0;
  }

  findItemType(target: string): string {
    const menuItem = this.menuItems.find((item) => item._id === target);
    return menuItem ? menuItem.itemType : '';
  }

  multiply(a: number, b: number | undefined): number {
    if (b === undefined) {
      return 0;
    }
    return a * b;
  }

  convertOrdersToItems(orders: Order[]): ItemForTable[] {
    const itemsMap: Map<string, ItemForTable> = new Map();
    for (const order of orders) {
      for (const item of order.items) {
        const idItem = item.idItem;
        const quantity = item.count;

        const existingItem = itemsMap.get(idItem);

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          const newItem: ItemForTable = {
            _id: idItem,
            name: this.findItemName(idItem),
            price: this.findItemPrice(idItem),
            quantity,
            type: this.findItemType(idItem),
          };
          itemsMap.set(idItem, newItem);
        }
      }
    }
    const itemsForTable: ItemForTable[] = Array.from(itemsMap.values());

    return itemsForTable;
  }

  calculateTotal(): number {
    let total = 0;
    for (const item of this.itemsForTable) {
      if (item._id !== undefined) {
        total += this.multiply(item.quantity, this.findItemPrice(item._id));
      }
    }
    return total;
  }

  calculateRecipe() {
    this.rrs.calculateRecipe(this.idTable).subscribe(
      (response) => {
          this.socketService.emitFetchRecipes(this.ups.getRestaurant());
          this.socketService.emitFetchGroups(this.ups.getRestaurant());
          this.pdfService.generateReceipt(this.calculateTotal(), this.itemsForTable);
          this.removeCustomer();
      },
      (error) => {
        console.error('Errore durante la chiamata:', error.error.errormessage);
        this.messageError = error.error.errormessage;
      }
    );
  }

  removeCustomer() {
    this.grs.removeGroupFromTable(this.idTable).subscribe((data) => {
      this.socketService.emitFetchTable(this.ups.getRestaurant());
      this.socketService.emitFetchGroups(this.ups.getRestaurant());
      this.router.navigate(['/cashier-dashboard/tables']);
    });
  }
}
