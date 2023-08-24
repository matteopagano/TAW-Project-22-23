import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CashierRoutingModule } from './cashier-routing.module';
import { DisplayTablesComponent } from './display-tables/display-tables.component';


@NgModule({
  declarations: [
    DisplayTablesComponent
  ],
  imports: [
    CommonModule,
    CashierRoutingModule
  ]
})
export class CashierModule { }
