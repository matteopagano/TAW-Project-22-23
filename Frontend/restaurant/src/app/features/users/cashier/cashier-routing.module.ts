import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CashierComponent } from './cashier.component';
import { DisplayTablesComponent } from './display-tables/display-tables.component';

const routes: Routes = [{
  path : '',
  component: CashierComponent,
  children: [
    {
      path: 'tables' , component: DisplayTablesComponent
    },

  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashierRoutingModule { }
