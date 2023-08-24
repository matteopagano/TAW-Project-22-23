import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CookRoutingModule } from './cook-routing.module';
import { DisplayQueueComponent } from './display-queue/display-queue.component';


@NgModule({
  declarations: [
    DisplayQueueComponent
  ],
  imports: [
    CommonModule,
    CookRoutingModule
  ]
})
export class CookModule { }
