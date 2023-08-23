import { Component, OnInit } from '@angular/core';
import { AuthRequestService } from 'src/app/common/api/http-requests/requests/auth/auth-request.service';

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css']
})
export class LoginUserComponent{
  public errmessage = undefined;
  email: string = '';
  password: string = '';
  constructor(private ars : AuthRequestService ) {

  }

  login() {
    this.ars.login(this.email, this.password).subscribe({
      next: (d) => {
        console.log('Login granted: ' + JSON.stringify(d));

        this.errmessage = undefined;
      },
      error: (err) => {

        console.log('Login error: ' + JSON.stringify(err));
        this.errmessage = err.error.message;

      }
    });
  }


}

