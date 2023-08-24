import { Component } from '@angular/core';
import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cook',
  templateUrl: './cook.component.html',
  styleUrls: ['./cook.component.css'],
})
export class CookComponent {
  constructor(private ups: UserPropertyService, private router: Router) {}

  logout() {
    this.ups.logout();
    this.router.navigate(['/authentication/login']);
  }
}
