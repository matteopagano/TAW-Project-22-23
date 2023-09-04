import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BartenderComponent } from './bartender.component';
import { DisplayQueueComponent } from './display-queue/display-queue.component';
import { ManageAccountComponent } from '../manage-account/manage-account.component';

const routes: Routes = [{
  path : '',
  component: BartenderComponent,
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
export class BartenderRoutingModule { }
