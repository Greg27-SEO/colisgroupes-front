import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor(private authServe: AuthenticationService, private router: Router ) { }

  ngOnInit() {
    if (this.authServe.isUserAdmin()) {
      this.router.navigate(['/admin']);
    }
  }

}
