import { Component } from '@angular/core';
import { SocketService } from 'src/app/socket.service';

import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { UsersRequestService } from 'src/app/common/api/http-requests/requests/users/users-request.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {
  newUserData: any;


  newUser: any = {
    username: '',
    email: '',
    role: 'cashier'
  };

  constructor(private ups : UserPropertyService,
    private socketService: SocketService,
    private urs : UsersRequestService,
  ){
    this.socketService.joinRestaurantRoom(this.ups.getRestaurant());
  }


  createUser(): void {
    console.log(this.newUser)
    this.urs.create_user(this.newUser).subscribe((response) => {
      this.newUserData = response;

      this.newUser = {
        username: '',
        email: '',
        role: 'cashier'
      };
    });
  }


}
