import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginUserComponent} from '../app/login-user/login-user.component'
import { MainpageComponent } from './mainpage/mainpage.component';
import { TableDetailsComponent } from './table-details/table-details.component';



const routes: Routes = [
  { path: 'login', component: LoginUserComponent },
  { path: 'mainpage', component: MainpageComponent },
  { path: 'table/:id', component: TableDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
