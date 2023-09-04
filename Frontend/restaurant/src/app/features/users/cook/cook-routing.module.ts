import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CookModule } from './cook.module';
import { DisplayQueueComponent } from './display-queue/display-queue.component';
import { CookComponent } from './cook.component';
import { ManageAccountComponent } from '../manage-account/manage-account.component';

const routes: Routes = [{
  path : '',
  component: CookComponent,
  children: [
    {
      path: 'queue' , component: DisplayQueueComponent
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
export class CookRoutingModule { }
