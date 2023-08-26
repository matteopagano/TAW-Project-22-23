import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { authGuard } from './auth.guard';
import { UserPropertyService } from './common/api/user-property/user-property.service';
import { JwtService } from './common/api/jwt/jwt.service';
import { OwnerModule } from './features/users/owner/owner.module';
import { CashierModule } from './features/users/cashier/cashier.module';
import { WaiterModule } from './features/users/waiter/waiter.module';
import { BartenderModule } from './features/users/bartender/bartender.module';
import { CookModule } from './features/users/cook/cook.module';
import { AuthenticationModule } from './features/authentication/authentication.module';
import { roleChildGuard, roleGuard } from './role.guard';
import { PermissionDeniedComponent } from './features/permission-denied/permission-denied.component';



const routes: Routes = [
  { path : 'owner-dashboard', loadChildren : () => {return import('./features/users/owner/owner.module').then((m) => m.OwnerModule);}, canActivate: [authGuard, roleGuard, roleChildGuard],data: {rolePermitted: 'owner' } },
  { path : 'bartender-dashboard', loadChildren : () => {return import('./features/users/bartender/bartender.module').then((m) => m.BartenderModule);}, canActivate: [authGuard, roleGuard, roleChildGuard],data: {rolePermitted: 'bartender' } },
  { path : 'cooker-dashboard', loadChildren : () => {return import('./features/users/cook/cook.module').then((m) => m.CookModule);}, canActivate: [authGuard, roleGuard, roleChildGuard],data: {rolePermitted: 'cook' } },
  { path : 'waiter-dashboard', loadChildren : () => {return import('./features/users/waiter/waiter.module').then((m) => m.WaiterModule);}, canActivate: [authGuard, roleGuard, roleChildGuard],data: {rolePermitted: 'waiter' } },
  { path : 'cashier-dashboard', loadChildren : () => {return import('./features/users/cashier/cashier.module').then((m) => m.CashierModule);}, canActivate: [authGuard, roleGuard, roleChildGuard],data: {rolePermitted: 'cashier' } },
  { path : 'authentication', loadChildren : () => {return import('./features/authentication/authentication.module').then((m) => m.AuthenticationModule)}},
  { path : 'permission-denied', component : PermissionDeniedComponent},
  { path: '**', redirectTo: '/authentication', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

