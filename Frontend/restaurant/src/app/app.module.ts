import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Assicurati di aver importato FormsModule


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginUserComponent } from './login-user/login-user.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { OwnerComponent } from './owner/owner.component';
import { CashierComponent } from './cashier/cashier.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginUserComponent,
    MainpageComponent,
    OwnerComponent,
    CashierComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
