import { Component } from '@angular/core';
import { SignupRequestService } from 'src/app/common/api/http-requests/requests/auth/signup-request.service';


@Component({
  selector: 'app-signup-user',
  templateUrl: './signup-user.component.html',
  styleUrls: ['./signup-user.component.css']
})
export class SignupUserComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  restaurantName :string = '';
  errorMessage :string = ''


  constructor(private sures : SignupRequestService) {

  }

  signup() {
    this.sures.signup(this.username, this.email, this.password, this.restaurantName).subscribe({
      next: (d) => {
        console.log('Signup granted: ' + JSON.stringify(d));
      },
      error: (err) => {
        console.log('Signup error: ' + JSON.stringify(err));
      }
    });
  }


}
