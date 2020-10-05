import { Component, OnInit } from '@angular/core';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faMapSigns } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from '../service/authentication.service';
import { Router } from '@angular/router';
import { Mail } from '../model/Mail';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  iconFacebook = faFacebook;
  iconTwitter = faTwitter;
  iconInsta = faInstagram;
  iconMap = faMapSigns;
  mail = new Mail();
  message = '';
  loading = false;

  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    this.message = '';
    this.loading = false;
    if (this.authService.isUserAdmin()) {
      this.router.navigate(['/admin']);
    }
  }

  sendContactMail() {
    this.loading = true;
    console.log(this.mail);
    const mailToSend = new Mail(this.mail.from.concat(' - ', this.mail.email), null, null, this.mail.subject, this.mail.content);
    this.authService.contact(mailToSend).subscribe((succes) => {
      this.mail = new Mail();
      this.message = 'Votre message a bien été envoyé !';
      this.loading = false;
    });
  }

}
