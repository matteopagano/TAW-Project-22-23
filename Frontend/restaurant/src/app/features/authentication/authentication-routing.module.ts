import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginUserComponent } from './login-user/login-user.component';
import { SignupUserComponent } from './signup-user/signup-user.component';
import { AuthenticationComponent } from './auth-screen/authentication.component';

const routes: Routes = [
  {
    path : '',
    component: AuthenticationComponent,
    children: [
    { path: 'signup', component: SignupUserComponent },
    { path: 'login', component: LoginUserComponent }
  ]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
