import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse, HttpParamsOptions } from '@angular/common/http';
import { environment } from 'src/env/enviroment';
import { JwtService } from '../jwt/jwt.service';
import { credential } from 'firebase-admin';


export interface RequestOptions {
  headers: HttpHeaders;
  params: HttpParams;
}

export interface Credentials {
  email : string,
  password : string
}

export abstract class AuthRequest{
  protected readonly baseUrl: string;
  protected readonly httpClient: HttpClient;


  protected constructor(httpClient: HttpClient, baseUrl: string = environment.backendUrl) {
    this.baseUrl = baseUrl;
    this.httpClient = httpClient;
  }
  protected create_options(credentials : Credentials, params?: HttpParamsOptions) : RequestOptions {

    const header : HttpHeaders = new HttpHeaders({
      'authorization' : 'Basic ' + btoa( credentials.email + ':' + credentials.password),
      'cache-control': 'no-cache',
      'Content-Type':  'application/json',
    })

    return  {
      headers: header,
      params: new HttpParams(params)
    };

  }
}
