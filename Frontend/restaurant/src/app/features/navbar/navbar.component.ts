import { Component } from '@angular/core';
import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private ups : UserPropertyService,private router : Router){

  }
  logout(){

    this.ups.logout()
    this.router.navigate(['/authentication/login'])
  }
  isLogged(){
    return this.ups.isLogged()

  }



}
