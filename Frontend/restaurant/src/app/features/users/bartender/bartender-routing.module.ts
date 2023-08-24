import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BartenderComponent } from './bartender.component';
import { DisplayQueueComponent } from './display-queue/display-queue.component';

const routes: Routes = [{
  path : '',
  component: BartenderComponent,
  children: [
    {
      path: 'queue' , component: DisplayQueueComponent
    },


  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BartenderRoutingModule { }
