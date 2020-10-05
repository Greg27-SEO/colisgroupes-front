import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';
import { AuthenticationService } from './authentication.service';
import * as jwt_decode from 'jwt-decode';

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(public auth: AuthenticationService, public router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
      // this will be passed from the route config
      // on the data property
      if (!this.auth.isUserLoggedIn()) {
        this.router.navigate(['/message', '404']);
        return false;
      }
      const expectedRole = route.data.expectedRole;
      const token = sessionStorage.getItem('token');
      console.log(token);
      // decode the token to get its payload
      const tokenPayload = jwt_decode(token);
      // console.log(tokenPayload);
      if (
        !(tokenPayload.roles.some(role => role === expectedRole))
      ) {
        this.router.navigate(['/message', '404']);
        return false;
      }
      return true;
    }
}
