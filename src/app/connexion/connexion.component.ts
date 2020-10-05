import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { User } from '../model/User';
import { AuthenticationService } from '../service/authentication.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {MustMatch} from '../Utils';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent implements OnInit {

  newUser = false;
  loading = false;
  @Output() done = new EventEmitter<boolean>();
  @Input() redirect = true;
  user: User = new User();
  registerForm: FormGroup;
  loginForm: FormGroup;
  submitted = false;
  badCreden = false;
  usernameTaken = false;

  constructor(private authService: AuthenticationService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    if (this.authService.isUserAdmin()) {
      this.router.navigate(['/admin']);
    }
    this.initLoginForm();
    this.initRegisterForm();
  }

  initLoginForm() {
    this.loginForm = this.formBuilder.group({
      identifiant: new FormControl(this.user.identifiant, Validators.required),
      password: new FormControl(this.user.password, Validators.required),
    });
  }

  initRegisterForm() {
    this.registerForm = this.formBuilder.group({
      identifiant: new FormControl(this.user.identifiant, Validators.required),
      siren: new FormControl(this.user.siren, Validators.required),
      name: new FormControl(this.user.name, Validators.required),
      mail: new FormControl(this.user.mail, Validators.required),
      adresse: new FormControl(this.user.adresse, Validators.required),
      password: new FormControl(this.user.password, [Validators.required, Validators.minLength(6)]),
      confirmePassword: ['', Validators.required],
      // acceptTerms: [false, Validators.requiredTrue]
    },
      {
        validator: MustMatch('password', 'confirmePassword')
      }
    );
  }

  // convenience getter for easy access to form fields
  get flogin() { return this.loginForm.controls; }
  get fregister() { return this.registerForm.controls; }

  register() {
    //Valider User registration form
    this.submitted = true;
    if (this.registerForm.invalid) {
      console.log(this.registerForm);
      return;
    }
    console.log('==> Trying to register');
    this.user = this.registerForm.value;
    this.loading = true;
    this.usernameTaken = false;
    this.authService.registration(this.user).subscribe(response => {
      console.log('<== Registration done');
      this.initLoginForm();
      this.newUser = !this.newUser;
      this.loading = false;
      this.login();
    },
    error => {
      console.log('<== Registration failed');
      this.loading = false;
      if (error.status === 406) {
        this.usernameTaken = true;
      } else {
        console.error('Prolem API registration..');
        console.log(error);
      }
    });
  }

  login(fromRegister: boolean = false) {
  if(!fromRegister) {
    this.submitted = true;
    if (this.loginForm.invalid) {
      console.log(this.loginForm);
      return;
    }
    this.user = this.loginForm.value;
  }
  this.loading = true;
  this.badCreden = false;
  console.log('==> Trying to connect');
  this.authService.login(this.user.identifiant, this.user.password).subscribe(response => {
    sessionStorage.setItem('username', response.username);
    sessionStorage.setItem('token', response.token);
    console.log('<== Connected...');
    this.done.emit(true);
    // this.loading = false;
    // console.log('==> Getting new user');
    // this.authService.whoAmI().subscribe(result => {
    //   this.user = result;
    //   console.log('<== User identified !');
    //   this.loading = false;
    // })
    // console.log(this.authService.isUserAdmin());
    if(this.redirect) {
      if ( this.authService.isUserAdmin() ) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/']);
      }
    }
  },
  error => {
    console.log('<== Failed to Connect...');
    this.loading = false;
    if( error.status === 406 ) {
      this.badCreden = true;
    } else {
      console.error('Prolem API authentication..');
      console.log(error);
    }
  });
  }
}

