import { Component } from '@angular/core';
import { UserHttpService } from './user-http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'restaurant';


  constructor(private us: UserHttpService){
  }

  isLoggedIn(){
    return this.us.is_logged()
  }
  getRule(){
    return this.us.get_rule()
  }

  logout(){
    return this.us.logout()
  }
}
