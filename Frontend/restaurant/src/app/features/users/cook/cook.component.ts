import { Component,  OnInit, HostListener } from '@angular/core';
import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cook',
  templateUrl: './cook.component.html',
  styleUrls: ['./cook.component.css'],
})
export class CookComponent implements OnInit{
  constructor(private ups: UserPropertyService, private router: Router) {}

  logout() {
    this.ups.logout();
    this.router.navigate(['/authentication/login']);
  }

  isLargeScreen = true;

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    const screenWidth = window.innerWidth;

    this.isLargeScreen = screenWidth >= 992;
  }
}
