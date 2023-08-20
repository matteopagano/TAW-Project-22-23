import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { RestaurantHttpService } from './restaurant-http.service';

type MyFunctionType = () => void;

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket, private rs: RestaurantHttpService,) {}

  // Metodo per connettersi a una stanza specifica (il nome del ristorante è l'ID della stanza)
  joinRestaurantRoom(restaurantId: string) {
    console.log("mi inserisco nella stanza ")
    console.log(restaurantId)

    this.socket.emit('join-room', restaurantId); // Sostituisci con il nome del tuo evento personalizzato
  }


  emitFetchTable(restaurantId : string) {
    this.socket.emit('fetchTable', restaurantId);
  }

  emitFetchItems(restaurantId : string) {
    this.socket.emit('fetchItems', restaurantId);
  }

  emitFetchGroups(restaurantId : string) {
    this.socket.emit('fetchGroups', restaurantId);
  }

  emitFetchRecipes(restaurantId : string) {
    this.socket.emit('fetchRecipes', restaurantId);
  }

  getSocket (){
    return this.socket;
  }


  // Altri metodi per gestire la comunicazione con la stanza, ad esempio per inviare messaggi
  // o ricevere aggiornamenti dalla stanza.
}
