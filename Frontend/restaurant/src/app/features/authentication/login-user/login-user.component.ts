import { Component, OnInit } from '@angular/core';
import { AuthRequestService } from 'src/app/common/api/http-requests/requests/auth/auth-request.service';
import { Router } from '@angular/router';
import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css']
})
export class LoginUserComponent{
  public errmessage = undefined;
  email: string = '';
  password: string = '';
  constructor(private ars : AuthRequestService , private router : Router, private ups : UserPropertyService) {

  }

  login() {
    this.ars.login(this.email, this.password).subscribe({
      next: (d) => {
        console.log('Login granted: ' + JSON.stringify(d));
        switch(this.ups.getRule()){
          case "owner":
            this.router.navigate(['/owner-dashboard/users/visualize'])
            break;
          case "cashier":
            this.router.navigate(['/cashier-dashboard/tables'])
            break;
          case "bartender":
            this.router.navigate(['/bartender-dashboard/queue'])
            break;
          case "cook":
            this.router.navigate(['/cooker-dashboard/queue'])
            break;

          case "waiter":
            this.router.navigate(['/waiter-dashboard/tables'])
            break;
          default:
        }
        this.errmessage = undefined;
      },
      error: (err) => {

        console.log('Login error: ' + JSON.stringify(err));
        this.errmessage = err.error.message;

      }
    });
  }


}

