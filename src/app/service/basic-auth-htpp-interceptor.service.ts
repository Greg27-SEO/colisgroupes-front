import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class BasicAuthHtppInterceptorService implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    if (this.authenticationService.isUserLoggedIn()) {
      // console.log('adding header token ');
      // console.log(req.headers);
      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        }
      });
      // console.log(req.headers);

    }
    // req.headers.append('Content-Type' , 'text/plain');
    // console.log('requete:');
    // console.log(req);
    return next.handle(req);
  }
}
