import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

type MyFunctionType = () => void;

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) {}

  joinRestaurantRoom(restaurantId: string) {
    console.log("mi inserisco nella stanza ")
    console.log(restaurantId)
    this.socket.emit('join-room', restaurantId);
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

  emitFetchOrders(restaurantId : string) {
    this.socket.emit('fetchOrders', restaurantId);
  }

  emitNewOrderDrink(restaurantId : string, order : any, idTable : string) {
    this.socket.emit('newOrderDrink', restaurantId, order, idTable);
  }
  emitNewOrderDish(restaurantId : string, order : any, idTable : string) {
    this.socket.emit('newOrderDish', restaurantId, order, idTable);
  }

  emitItemOfOrderDishStatus(restaurantId : string, order : any) {
    this.socket.emit('setItemOfOrderDishStatus', restaurantId, order);
  }

  emitItemOfOrderDrinkStatus(restaurantId : string, order : any) {
    this.socket.emit('setItemOfOrderDrinkStatus', restaurantId, order);
  }

  emitOrderDrinkCompleted(restaurantId : string, order : any) {
    this.socket.emit('setOrderDrinkStatus', restaurantId, order);
  }

  emitOrderDishCompleted(restaurantId : string, order : any) {
    this.socket.emit('setOrderDishStatus', restaurantId, order);
  }

  emitFetchRecipes(restaurantId : string) {
    this.socket.emit('fetchRecipes', restaurantId);
  }

  getSocket (){
    return this.socket;
  }
}
