import { Component } from '@angular/core';
import { UserPropertyService } from './common/api/user-property/user-property.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'restaurant';


  constructor(
    private ups : UserPropertyService
  ){
  }

  isLogged(){
    return this.ups.isLogged()
  }

  getRule(){
    return this.ups.getRule()
  }

  logout(){
    return this.ups.logout()
  }

  getRestaurant(){
    return this.ups.getRestaurant()
  }
}
