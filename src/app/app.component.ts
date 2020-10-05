import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
// import * as noti from 'notiflix/dist/notiflix-1.7.2.min.js';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { AuthenticationService } from './service/authentication.service';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  iconFacebook = faFacebook;
  iconTwitter = faTwitter;
  iconInsta = faInstagram;
  iconLogout = faSignOutAlt;
  connected= false;

  title = 'colis-groupe';

  constructor(private authService: AuthenticationService) {
  }

  ngOnInit(): void {
    // noti.Notiflix.init({});
    // noti.Notiflix.Notify.Success('Success message text');
  }

  isConnected() {
    return  this.authService.isUserLoggedIn();
  }

  isAdmin() {
    return this.authService.isUserAdmin();
  }

  logout() {
    //To change to true later Global Disconnect
    this.authService.logOut(false, true);
  }

  menuHover(event: any){
    const element = event.target;
    $('.active').removeClass('active');
    $(element).addClass('active');
  }

  menuLeave(event: any){
    $('.active').removeClass('active');
    $('#menu  > #connexion').addClass('active');
  }
}
