import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Assicurati di aver importato FormsModule
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginUserComponent } from './login-user/login-user.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { OwnerComponent } from './owner/owner.component';
import { CashierComponent } from './cashier/cashier.component';
import { WaiterComponent } from './waiter/waiter.component';
import { TableDetailsComponent } from './table-details/table-details.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SocketService } from './socket.service';
import { BartenderComponent } from './bartender/bartender.component';
import { CookComponent } from './cook/cook.component'; // Importa il tuo servizio SocketService



const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    LoginUserComponent,
    MainpageComponent,
    OwnerComponent,
    CashierComponent,
    WaiterComponent,
    TableDetailsComponent,
    BartenderComponent,
    CookComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SocketIoModule.forRoot(config)

  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
