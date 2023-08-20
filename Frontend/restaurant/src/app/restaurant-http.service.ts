import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import jwt_decode from "jwt-decode";
import { UserHttpService } from './user-http.service';


interface Cashier {
  _id: string;
  recipesPrinted: string[];
  username: string;
  email: string;
  role: string;
  idRestaurant: string;
  salt: string;
  digest: string;
  __v: number;
}

interface CashiersResponse {
  error: boolean;
  errormessage: string;
  cashiers: Cashier[];
}

interface Waiter {
  _id: string;
  ordersAwaiting: string[];
  ordersServed: string[];
  username: string;
  email: string;
  role: string;
  idRestaurant: string;
  salt: string;
  digest: string;
  __v: number;
}

interface WaitersResponse {
  error: boolean;
  errormessage: string;
  waiters: Waiter[];
}

interface Cooker {
  _id: string;
  username: string;
  email: string;
  role: string;
  idRestaurant: string;
  // Altre proprietà specifiche dei cuochi
}

interface Bartender {
  _id: string;
  username: string;
  email: string;
  role: string;
  idRestaurant: string;
  // Altre proprietà specifiche dei barman
}


interface CookersResponse {
  error: boolean;
  errormessage: string;
  cooks: Cooker[];
}

interface BartendersResponse {
  error: boolean;
  errormessage: string;
  bartenders: Bartender[];
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  // Aggiungi altre proprietà se necessario
}

// Interfaccia per un singolo elemento del menu
interface MenuItem {
  _id: string;
  itemName: string;
  itemType: string;
  price: number;
  preparationTime: number;
  idRestaurant: string;
  __v: number;
}

// Interfaccia per la risposta contenente gli elementi del menu
interface MenuItemsResponse {
  error: boolean;
  errormessage: string;
  tables: MenuItem[];
}

// Interfaccia per un singolo ordine di un elemento del menu
interface OrderItem {
  itemId: string;
  count: number;
}

// Interfaccia per una lista di ordini
interface OrdersList {
  items: OrderItem[];
}

// Interfaccia per la risposta contenente una lista di ordini
interface OrdersResponse {
  items: OrderItem[];
}

interface Order {
  itemId: string;
  count: number;
}



@Injectable({
  providedIn: 'root'
})
export class RestaurantHttpService {

  private token: string = '';
  public url = 'http://localhost:3000';

  constructor( private http: HttpClient, private us: UserHttpService) {
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        'body was: ' + JSON.stringify(error.error));
    }

    return throwError(() => new Error('Something bad happened; please try again later.') );
  }

  private create_options( params = {} ) {
    return  {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + this.us.get_token(),
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
      }),
      params: new HttpParams( {fromObject: params} )
    };

  }

  get_cashiers(): Observable<CashiersResponse> {
    console.log(this.us.get_restaurant())
    console.log(this.us.url + '/restaurants/' + this.us.get_restaurant() +'/cashiers')
    const prova = this.http.get<CashiersResponse>( this.us.url + '/restaurants/' + this.us.get_restaurant() +'/cashiers', this.create_options())
    console.log(prova)
    return prova
  }

  get_waiters(): Observable<WaitersResponse> {
    console.log(this.us.get_restaurant())
    console.log(this.us.url + '/restaurants/' + this.us.get_restaurant() +'/waiters')
    const prova = this.http.get<WaitersResponse>( this.us.url + '/restaurants/' + this.us.get_restaurant() +'/waiters', this.create_options())
    console.log(prova)
    return prova
  }

  delete_cashier(cashierId: string): Observable<any> {
    return this.http.delete<any>(this.us.url + '/restaurants/' + this.us.get_restaurant() +'/cashiers/' + cashierId, this.create_options());
  }

  delete_waiter(waiterId: string): Observable<any> {
    return this.http.delete<any>(this.us.url + '/restaurants/' + this.us.get_restaurant() +'/waiters/' + waiterId, this.create_options());
  }

  get_cooks(): Observable<CookersResponse> {
    const url = `${this.url}/restaurants/${this.us.get_restaurant()}/cooks`;
    const options = this.create_options();
    return this.http.get<CookersResponse>(url, options);
  }

  get_bartenders(): Observable<BartendersResponse> {
    const url = `${this.url}/restaurants/${this.us.get_restaurant()}/bartenders`;
    const options = this.create_options();
    return this.http.get<BartendersResponse>(url, options);
  }

  delete_cook(cookerId: string): Observable<any> {
    const url = `${this.url}/restaurants/${this.us.get_restaurant()}/cooks/${cookerId}`;
    const options = this.create_options();
    return this.http.delete(url, options);
  }

  delete_bartender(bartenderId: string): Observable<any> {
    const url = `${this.url}/restaurants/${this.us.get_restaurant()}/bartenders/${bartenderId}`;
    const options = this.create_options();
    return this.http.delete(url, options);
  }

  create_user(user: User): Observable<any> {
    let endpoint: string;

    if (user.role === 'cashier') {
      endpoint = `${this.url}/restaurants/${this.us.get_restaurant()}/cashiers`;
    } else if (user.role === 'waiter') {
      endpoint = `${this.url}/restaurants/${this.us.get_restaurant()}/waiters`;
    } else if (user.role === 'cooker') {
      endpoint = `${this.url}/restaurants/${this.us.get_restaurant()}/cooks`;
    } else {
      endpoint = `${this.url}/restaurants/${this.us.get_restaurant()}/bartenders`;
    }


    const options = this.create_options();

    return this.http.post<any>(endpoint, user, options);
  }

  addNewItem(newItem: any): Observable<any> {
    const url = `${this.url}/restaurants/${this.us.get_restaurant()}/items`;
    console.log("newItem")
    console.log(newItem)
    const options = this.create_options();
    return this.http.post<any>(url, newItem, options);
  }

  getAllItems(): Observable<any> {
    const url = `${this.url}/restaurants/${this.us.get_restaurant()}/items`;
    const options = this.create_options();
    return this.http.get<any>(url, options);
  }

  deleteItem(itemId: string): Observable<any> {
    const url = `${this.url}/restaurants/${this.us.get_restaurant()}/items/${itemId}`;
    const options = this.create_options();

    return this.http.delete<any>(url, options);
  }

  getTables(): Observable<any>{
    const url = `${this.url}/restaurants/${this.us.get_restaurant()}/tables`;
    const options = this.create_options();

    return this.http.get<any>(url, options);
  }

  deleteTable(tableId : string): Observable<any>{
    const url = `${this.url}/restaurants/${this.us.get_restaurant()}/tables/${tableId}`;
    const options = this.create_options();

    return this.http.delete<any>(url, options);
  }

  addTable(tableData: { tableNumber: string; maxSeats: number }): Observable<any> {
    const url = `${this.url}/restaurants/${this.us.get_restaurant()}/tables`;
    const options = this.create_options();

    return this.http.post<any>(url, tableData, options);
  }

  addGroupToTable(tableId: string, newCustomerGroup: any): Observable<any> {
    const url = `${this.url}/restaurants/${this.us.get_restaurant()}/tables/${tableId}/group`;

    console.log("numberofperson")
    console.log(newCustomerGroup)
    const options = this.create_options();

    return this.http.post<any>(url, newCustomerGroup, options);
  }

  getMenuItems(): Observable<MenuItemsResponse> {
    const url = `${this.url}/restaurants/${this.us.get_restaurant()}/items`;
    const options = this.create_options();



    return this.http.get<MenuItemsResponse>(url, options);
  }

  // Metodo per aggiungere un ordine a un tavolo


  getTableGroupDetails(tableId: string): Observable<any> {
    const url = `${this.url}/restaurants/${this.us.get_restaurant()}/tables/${tableId}/group`; // Costruisci l'URL completo
    const options = this.create_options();
    console.log(url)
    return this.http.get<any>(url, options);
  }

  removeCustomerFromTable(tableId: string): Observable<any> {
    // Crea l'URL completo per la richiesta
    const url = `${this.url}/restaurants/${this.us.get_restaurant()}/tables/${tableId}/group/`;
    const options = this.create_options();
    // Esegue la richiesta HTTP DELETE
    console.log(options)
    return this.http.delete(url, options);
  }

  createGroupOrder(tableId: string, order : any): Observable<any> {
    const url = `${this.url}/restaurants/${this.us.get_restaurant()}/tables/${tableId}/group/orders`;
    const options = this.create_options();



    return this.http.post<any>(url, order, options);
  }

  getOrdersByGroup(tableId: string): Observable<any> {
    console.log(tableId)
    const url = `${this.url}/restaurants/${this.us.get_restaurant()}/tables/${tableId}/group/orders`;
    const options = this.create_options();

    return this.http.get<any>(url, options);
  }

  getRestaurantId(){
    return this.us.get_restaurant()
  }


  getGroups(): Observable<any> {
    const url = `${this.url}/restaurants/${this.us.get_restaurant()}/groups`;
    const options = this.create_options();

    return this.http.get<any>(url, options);
  }


  calculateRecipe(tableId: string): Observable<any> {
    const url = `${this.url}/restaurants/${this.us.get_restaurant()}/tables/${tableId}/group/recipe`;
    const options = this.create_options();
    return this.http.post<any>(url,{},options);
  }

  getRecipes(): Observable<any> {
    const url = `${this.url}/restaurants/${this.us.get_restaurant()}/recipes`;
    const options = this.create_options();

    return this.http.get<any>(url,options);
  }
}


