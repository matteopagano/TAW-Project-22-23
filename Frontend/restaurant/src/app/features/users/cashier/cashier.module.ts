import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CashierRoutingModule } from './cashier-routing.module';
import { DisplayTablesComponent } from './display-tables/display-tables.component';
import { VisualizeTableDetailsComponent } from './visualize-table-details/visualize-table-details.component';


@NgModule({
  declarations: [
    DisplayTablesComponent,
    VisualizeTableDetailsComponent
  ],
  imports: [
    CommonModule,
    CashierRoutingModule
  ]
})
export class CashierModule { }
