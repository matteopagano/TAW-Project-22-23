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


@NgModule({
  declarations: [
    DisplayUsersComponent,
    CreateUserComponent,
    DisplayTablesComponent,
    CreateTableComponent,
    CreateItemComponent,
    DisplayItemsComponent,
    DisplayCustomersComponent,
  ],
  imports: [
    CommonModule,
    OwnerRoutingModule,
    NgClass,
    FormsModule

  ]
})
export class OwnerModule { }
