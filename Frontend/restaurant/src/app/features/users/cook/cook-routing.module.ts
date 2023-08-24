import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CookModule } from './cook.module';
import { DisplayQueueComponent } from './display-queue/display-queue.component';
import { CookComponent } from './cook.component';

const routes: Routes = [{
  path : '',
  component: CookComponent,
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
export class CookRoutingModule { }
