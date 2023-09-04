import { Component, Input } from '@angular/core';
import { SelfUserRequestService } from 'src/app/common/api/http-requests/requests/self-user/self-user-request.service';
import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.css']
})
export class ManageAccountComponent {
  username: string | null = null;
  email: string | null = null;
  currentPassword: string | null = null;
  newPassword: string | null = null;
  newPasswordConfirmed: string | null = null;
  message: string | null = null;
  messageError: string | null = null;
  editing = false;

  constructor(private ups: UserPropertyService, private surs: SelfUserRequestService) {
    this.username = this.ups.getUsername() || null;
    this.email = this.ups.getEmail() || null;
  }

  editAccount() {
    this.editing = true;
  }

  cancelEdit() {
    this.editing = false;
    this.currentPassword = null;
    this.newPassword = null;
    this.newPasswordConfirmed = null
    this.messageError = null;
    this.message = null;
  }

  saveChanges() {
    this.messageError = null;

    if (this.newPassword === this.newPasswordConfirmed) {
      this.surs.modifyPassword(this.currentPassword || '', this.newPassword || '').subscribe(
        (data) => {
          console.log(data);
          this.message = "Password setted"
        },
        (error) => {
          console.error('An error occurred:', error);
          this.messageError = "An error occurred while changing the password.";
        }
      );
    } else {
      this.messageError = "Passwords do not match";
    }
  }

  areFieldsFilled(): boolean {
    return !!this.currentPassword && !!this.newPassword && !!this.newPasswordConfirmed;
  }



}
