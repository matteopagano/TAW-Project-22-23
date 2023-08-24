import { NgModule } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';

import { WaiterRoutingModule } from './waiter-routing.module';
import { DisplayTablesComponent } from './display-tables/display-tables.component';
import { FormsModule } from '@angular/forms';
import { DisplayOrdersAwaitingComponent } from './display-orders-awaiting/display-orders-awaiting.component';
import { DisplayOrdersServedComponent } from './display-orders-served/display-orders-served.component';


@NgModule({
  declarations: [
    DisplayTablesComponent,
    DisplayOrdersAwaitingComponent,
    DisplayOrdersServedComponent
  ],
  imports: [
    CommonModule,
    WaiterRoutingModule,
    NgClass,
    FormsModule
  ]
})
export class WaiterModule { }
