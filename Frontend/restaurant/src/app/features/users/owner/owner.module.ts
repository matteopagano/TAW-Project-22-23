import { NgModule } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';

import { OwnerRoutingModule } from './owner-routing.module';
import { DisplayUsersComponent } from './display-users/display-users.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { FormsModule} from '@angular/forms';
import { DisplayTablesComponent } from './display-tables/display-tables.component';
import { CreateTableComponent } from './create-table/create-table.component';
import { CreateItemComponent } from './create-item/create-item.component';
import { DisplayItemsComponent } from './display-items/display-items.component';
import { DisplayCustomersComponent } from './display-customers/display-customers.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserModule } from '@angular/platform-browser';
import { NgChartsModule } from 'ng2-charts';
import { DisplayBartendersDataComponent } from './display-bartenders-data/display-bartenders-data.component';
import { DisplayCooksDataComponent } from './display-cooks-data/display-cooks-data.component';
import { DisplayCashiersDataComponent } from './display-cashiers-data/display-cashiers-data.component';
import { DisplayWaitersDataComponent } from './display-waiters-data/display-waiters-data.component';
import { VisualizeItemsDataComponent } from './visualize-items-data/visualize-items-data.component';
import { VisualizeCustomerDetailsComponent } from './visualize-customer-details/visualize-customer-details.component';
import { VisualizeCustomersDataComponent } from './visualize-customers-data/visualize-customers-data.component';


@NgModule({
  declarations: [
    DisplayUsersComponent,
    CreateUserComponent,
    DisplayTablesComponent,
    CreateTableComponent,
    CreateItemComponent,
    DisplayItemsComponent,
    DisplayCustomersComponent,
    DisplayBartendersDataComponent,
    DisplayCooksDataComponent,
    DisplayCashiersDataComponent,
    DisplayWaitersDataComponent,
    VisualizeItemsDataComponent,
    VisualizeCustomerDetailsComponent,
    VisualizeCustomersDataComponent,
  ],
  imports: [
    CommonModule,
    OwnerRoutingModule,
    NgClass,
    FormsModule,

  ]
})
export class OwnerModule { }
