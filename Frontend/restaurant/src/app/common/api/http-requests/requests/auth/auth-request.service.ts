import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { JwtService } from '../../../jwt/jwt.service';
import { RequestOptions } from '../../base-request';
import { AuthRequest } from '../../auth-request';
import { Credentials } from '../../auth-request';
import { UserPropertyService } from '../../../user-property/user-property.service';

export interface ReceivedToken {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthRequestService extends AuthRequest {
  constructor(
    httpClient: HttpClient,
    private jwtService: JwtService,
    private ups: UserPropertyService
  ) {
    super(httpClient);
  }

  login(mail: string, password: string): Observable<any> {
    const url: string = `${this.baseUrl}/login`;

    const credentials: Credentials = { email: mail, password: password };
    const reqOptions: RequestOptions = super.create_options(credentials);

    return this.httpClient
      .get(this.baseUrl + '/login', { headers: reqOptions.headers })
      .pipe(
        tap((data) => {
          this.jwtService.storeToken((data as ReceivedToken).token);
        })
      )
      .pipe(tap((data) => {}));
  }
}
