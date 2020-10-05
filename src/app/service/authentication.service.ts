import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../model/User';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { Mail } from '../model/Mail';
export class AuthUser {
  constructor(
    public username: string,
    public token: string
  ) { }

}

export class Credentiels {
  constructor(
    public username: string,
    public password: string
  ) {}
}


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private commandesUrl: string;

  constructor(private httpClient: HttpClient, private  router: Router) {
    this.commandesUrl = 'https://colis-groupes.fr:8443/';
    // this.commandesUrl = 'http://localhost:8080/';
  }

  contact(mail) {
    // console.log(username);
    // console.log(password);
    return this.httpClient.post<Mail>(this.commandesUrl + 'mail/contact', mail);

  }
  login(username, password) {
    // console.log(username);
    // console.log(password);
    return this.httpClient.post<AuthUser>(this.commandesUrl + 'auth/signin', new Credentiels(username, password))

  }

  registration(user: User) {
    console.log(user.identifiant);
    console.log(user.password);
    return this.httpClient.post<User>(this.commandesUrl + 'auth/registration', user);

  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem('username');
    let token = sessionStorage.getItem('token');
    return !(user === null) || !(token === null);
  }

  logOut(all: boolean = false, redirect: boolean = false) {
    //TODO: THat doesnt work as expected ! fix bug Bakcend Java Logout
    if( all ) {
      console.log('global logout')
      this.httpClient.get(this.commandesUrl + 'logout').subscribe(response => {
        console.log(response);
        console.log('deconnected...');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('token');
      },
      error => {
        console.log('error logging out');
        console.log(error);
      });
    } else {
      console.log('angular logout')
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('token');
    }
    if (redirect) {
      this.router.navigate(['/']);
    }
  }

  isUserAdmin(): boolean {
    if ( this.isUserLoggedIn() ) {
      const token = sessionStorage.getItem('token');
      const tokenPayload = jwt_decode(token);
      return tokenPayload.roles.some(role => role === 'ROLE_ADMIN');
    }
    return false;
  }

  whoAmI(): Observable<User> {
    return this.httpClient.get<User>(this.commandesUrl + 'auth/me');
    // if(this.isUserLoggedIn()) {
    //     this.httpClient.get<User>('/me').subscribe(
    //       succes => {
    //         console.log(succes);
    //         console.log('you are fycking this person');
    //         return succes;
    //       },
    //       error => {
    //         console.log('error getting who am i ')
    //         console.log(error);
    //         return null;
    //       }
    //     );
    // } else {
    //   return null;
    // }
  }
}
