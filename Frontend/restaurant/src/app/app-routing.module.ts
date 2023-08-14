import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginUserComponent} from '../app/login-user/login-user.component'
import { MainpageComponent } from './mainpage/mainpage.component';

const routes: Routes = [
  { path: 'login', component: LoginUserComponent },
  { path: 'mainpage', component: MainpageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
