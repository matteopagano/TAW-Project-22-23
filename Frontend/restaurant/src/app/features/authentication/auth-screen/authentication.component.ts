import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent {
  constructor(private router: Router) {

  }

  navigateToLogin() {
    this.router.navigate(['/authentication/login']);
  }

  navigateToSignup() {
    this.router.navigate(['/authentication/signup']);
  }


}
