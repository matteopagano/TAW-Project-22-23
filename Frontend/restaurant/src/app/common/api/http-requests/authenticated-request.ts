
import { BaseRequest, RequestOptions} from "./base-request";
import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { JwtService } from "../jwt/jwt.service";


export abstract class AuthenticatedRequest extends BaseRequest{
  protected readonly jwtService: JwtService;

  protected constructor(httpClient: HttpClient, jwtService: JwtService) {
    super(httpClient);

    this.jwtService = jwtService;
}


protected override create_options(params?: HttpParamsOptions): RequestOptions {
  const reqOptions: RequestOptions = super.create_options(params);

  const accessToken: string = this.jwtService.getToken();
  const headersWithAuth: HttpHeaders = reqOptions.headers.set(
      'Authorization',`Bearer ${accessToken}`
  );

  return {
      headers: headersWithAuth,
      params: reqOptions.params,
  };
}
}
