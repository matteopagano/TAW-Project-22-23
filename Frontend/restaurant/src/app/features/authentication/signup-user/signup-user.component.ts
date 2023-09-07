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
  message:string=''


  constructor(private sures : SignupRequestService) {

  }

  signup() {
    this.message = ''
    this.errorMessage = ''
    this.sures.signup(this.username, this.email, this.password, this.restaurantName).subscribe({
      next: (d) => {
        this.message = 'Signup granted'
      },
      error: (err) => {
        this.errorMessage = 'Signup error'
      }
    });
  }


}
