import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CashierComponent } from './cashier.component';
import { DisplayTablesComponent } from './display-tables/display-tables.component';
import { VisualizeTableDetailsComponent } from './visualize-table-details/visualize-table-details.component';

const routes: Routes = [{
  path : '',
  component: CashierComponent,
  children: [
    {
      path: 'tables' , component: DisplayTablesComponent
    },
    {
      path: 'tables/:id' , component: VisualizeTableDetailsComponent
    },

  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashierRoutingModule { }
