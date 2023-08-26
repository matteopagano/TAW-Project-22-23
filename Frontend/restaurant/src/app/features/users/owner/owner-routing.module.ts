import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OwnerComponent } from './owner.component';
import { DisplayUsersComponent } from './display-users/display-users.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { DisplayItemsComponent } from './display-items/display-items.component';
import { CreateItemComponent } from './create-item/create-item.component';
import { DisplayTablesComponent } from './display-tables/display-tables.component';
import { CreateTableComponent } from './create-table/create-table.component';
import { DisplayCustomersComponent } from './display-customers/display-customers.component';
import { DisplayBartendersDataComponent } from './display-bartenders-data/display-bartenders-data.component';
import { DisplayWaitersDataComponent } from './display-waiters-data/display-waiters-data.component';
import { DisplayCooksDataComponent } from './display-cooks-data/display-cooks-data.component';
import { DisplayCashiersDataComponent } from './display-cashiers-data/display-cashiers-data.component';
import { VisualizeItemsDataComponent } from './visualize-items-data/visualize-items-data.component';
import { VisualizeCustomerDetailsComponent } from './visualize-customer-details/visualize-customer-details.component';
import { VisualizeCustomersDataComponent } from './visualize-customers-data/visualize-customers-data.component';

const routes: Routes = [{
  path : '',
  component: OwnerComponent,
  children: [
    {
      path: 'users' , children : [{path:'visualize', component: DisplayUsersComponent},{path: 'create', component: CreateUserComponent}]
    },
    {
      path: 'items' , children : [{path:'visualize', component: DisplayItemsComponent},{path: 'create', component: CreateItemComponent}]
    },
    {
      path: 'tables' , children : [{path:'visualize', component: DisplayTablesComponent},{path: 'create', component: CreateTableComponent}]
    },
    {
      path: 'groups' , children : [{path:'visualize', component: DisplayCustomersComponent}]
    },
    {
      path: 'groups/:id' ,component: VisualizeCustomerDetailsComponent
    },

    {
      path: 'data-analytics' , children : [
        {path:'bartenders', component: DisplayBartendersDataComponent},
        {path:'waiters', component: DisplayWaitersDataComponent},
        {path:'cooks', component: DisplayCooksDataComponent},
        {path:'cashiers', component: DisplayCashiersDataComponent},
        {path:'items', component: VisualizeItemsDataComponent},
        {path:'customers', component: VisualizeCustomersDataComponent}
      ]
    },
    ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OwnerRoutingModule { }
