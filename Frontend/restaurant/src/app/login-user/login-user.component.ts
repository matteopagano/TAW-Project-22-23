import { Component, OnInit } from '@angular/core';
import { UserHttpService } from '../user-http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css']
})
export class LoginUserComponent{
  public errmessage = undefined;
  constructor( private us: UserHttpService, private router : Router) {

  }

  login(mail: string, password: string, remember: boolean) {
    this.us.login(mail, password, remember).subscribe({
      next: (d) => {
        console.log('Login granted: ' + JSON.stringify(d));
        this.router.navigate(['mainpage']);
        this.errmessage = undefined;
      },
      error: (err) => {
        console.log('Login error: ' + JSON.stringify(err));
        this.errmessage = err.message;

      }
    });
  }


}

