import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WaiterComponent } from './waiter.component';
import { DisplayTablesComponent } from './display-tables/display-tables.component';
import { DisplayOrdersAwaitingComponent } from './display-orders-awaiting/display-orders-awaiting.component';
import { DisplayOrdersServedComponent } from './display-orders-served/display-orders-served.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { ManageAccountComponent } from '../manage-account/manage-account.component';

const routes: Routes = [{
  path : '',
  component: WaiterComponent,
  children: [
    {
      path: 'tables' , component: DisplayTablesComponent
    },
    {
      path: 'orders-awaiting' , component: DisplayOrdersAwaitingComponent
    },
    {
      path: 'orders-served' , component: DisplayOrdersServedComponent
    },
    {
      path: 'tables/:id' , component: CreateOrderComponent
    },
    {
      path: 'manage-account' , component: ManageAccountComponent
    },

  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WaiterRoutingModule { }
