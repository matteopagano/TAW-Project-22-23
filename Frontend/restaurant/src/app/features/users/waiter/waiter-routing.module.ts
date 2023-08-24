import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WaiterComponent } from './waiter.component';
import { DisplayTablesComponent } from './display-tables/display-tables.component';
import { DisplayOrdersAwaitingComponent } from './display-orders-awaiting/display-orders-awaiting.component';
import { DisplayOrdersServedComponent } from './display-orders-served/display-orders-served.component';

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

  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WaiterRoutingModule { }
