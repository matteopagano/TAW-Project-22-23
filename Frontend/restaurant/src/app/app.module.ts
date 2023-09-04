import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OwnerComponent } from './features/users/owner/owner.component';
import { CashierComponent } from './features/users/cashier/cashier.component';
import { WaiterComponent } from './features/users/waiter/waiter.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SocketService } from './socket.service';
import { BartenderComponent } from './features/users/bartender/bartender.component';
import { CookComponent } from './features/users/cook/cook.component';
import { SignupUserComponent } from './features/authentication/signup-user/signup-user.component';
import { LoginUserComponent } from './features/authentication/login-user/login-user.component';
import { AuthenticationComponent } from './features/authentication/auth-screen/authentication.component';
import { OwnerModule } from './features/users/owner/owner.module';
import { AuthenticationModule } from './features/authentication/authentication.module';
import { NavbarComponent } from './features/navbar/navbar.component';
import { CashierModule } from './features/users/cashier/cashier.module';
import { CookModule } from './features/users/cook/cook.module';
import { BartenderModule } from './features/users/bartender/bartender.module';
import { WaiterModule } from './features/users/waiter/waiter.module';
import { PermissionDeniedComponent } from './features/permission-denied/permission-denied.component';
import { ManageAccountComponent } from './features/users/manage-account/manage-account.component';


const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    SignupUserComponent,
    OwnerComponent,
    CashierComponent,
    WaiterComponent,
    BartenderComponent,
    CookComponent,
    LoginUserComponent,
    AuthenticationComponent,
    NavbarComponent,
    PermissionDeniedComponent,
    ManageAccountComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SocketIoModule.forRoot(config),
    OwnerModule,
    AuthenticationModule,
    CashierModule,
    CookModule,
    BartenderModule,
    WaiterModule

  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
