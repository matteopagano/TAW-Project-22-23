import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BartenderRoutingModule } from './bartender-routing.module';
import { DisplayQueueComponent } from './display-queue/display-queue.component';


@NgModule({
  declarations: [
    DisplayQueueComponent
  ],
  imports: [
    CommonModule,
    BartenderRoutingModule
  ]
})
export class BartenderModule { }
