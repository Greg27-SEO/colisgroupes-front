import { Component, OnInit, Input } from '@angular/core';
import { Commande, Colis, TYPE } from 'src/app/model/Commande';
import { faPlusCircle, faMinus, faTimes, faClone, faArrowCircleDown } from '@fortawesome/free-solid-svg-icons';
import Utils, { villeValidator } from 'src/app/Utils';
import { AuthenticationService } from '../../service/authentication.service';
import { User } from 'src/app/model/User';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Trajet } from 'src/app/model/Trajet';
import { Router } from '@angular/router';

// TODO: Limit add colis
// TODO: Replace login by its component Connexion


@Component({
  selector: 'app-commande',
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.css']
})
export class CommandeComponent implements OnInit {

  @Input() commande: Commande = new Commande(new Trajet(), new User());
  @Input() custom = false;

  villes = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux', 'Lille', 'Nice', 'Nantes', 'Strasbourg', 'Rennes'];
  removedVille = {
    start: '',
    end: ''
  };
  days = [];
  connected = false;
  plusIcon = faPlusCircle;
  minusIcon = faMinus;
  arrowIcon = faArrowCircleDown;
  timesIcon = faTimes;
  duplicateIcon = faClone;
  formsColis = [];
  formLoading: FormGroup;
  formShipping: FormGroup;
  formTrajet: FormGroup;


  constructor(private authService: AuthenticationService, public router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    if (this.authService.isUserLoggedIn()){
      this.connected = true;
    }


    this.formTrajet = this.formBuilder.group({
      villeDepart: new FormControl(this.commande.trajet.villeDepart, [Validators.required, villeValidator]),
      villeDestination: new FormControl(this.commande.trajet.villeDestination, [Validators.required, villeValidator]),
      days: new FormControl('')
    });

    this.commande.colis.forEach(colis => {
      this.formsColis.push(this.formBuilder.group({
        type: new FormControl('', [Validators.required, Validators.min(1)]),
        height: new FormControl('', [Validators.required, Validators.min(1)]),
        width: new FormControl(''),
        length: new FormControl(''),
        size: new FormControl('', [Validators.required, Validators.min(1)]),
      }));
    });

    this.formLoading = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      adress: new FormControl('', Validators.required),
      telephone: new FormControl('', Validators.required),
      mail: new FormControl('', [Validators.required, Validators.email])
    });
    
    this.formShipping = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      adress: new FormControl('', Validators.required),
      telephone: new FormControl('', Validators.required),
      mail: new FormControl('', [Validators.required, Validators.email])
    });

  }

  dayChose(item, date) {
    console.log(item);
  }

  selectEvent(item, which: string) {
    // console.log('selected....');
    // console.log(item);
    if (which === 'start') {
      this.removedVille.start = item;
      // this.formTrajet.get('villeDepart').setValue(item);
    } else {
      // this.formTrajet.get('villeDestination').setValue(item);
      this.removedVille.end = item;
    }
    // console.log(this.formTrajet);

    this.villes = this.villes.filter(ville => {
      return ville !== item;
    });

  }

  onFocused(event, wich: string) {
    if (wich === 'start') {
      this.formTrajet.get('villeDepart').markAsTouched();
    } else {
      this.formTrajet.get('villeDestination').markAsTouched();
    }
  }

  villeCleared(item, which: string) {
    // console.log('deselected...');
    // console.log(this.formTrajet);
    if (which === 'start') {
      // this.formTrajet.get('villeDepart').setValue('');
      this.villes = this.villes.concat(this.removedVille.start);
    } else {
      // this.formTrajet.get('villeDestination').setValue('');
      this.villes = this.villes.concat(this.removedVille.end);
    }

  }

  // commande fcts

  public ajouterColis() {
    const colis = new Colis(null, null, null, null, null);
    this.commande.addColis(colis);
    this.formsColis.push(this.formBuilder.group({
      type: new FormControl(''),
      length: new FormControl(''),
      width: new FormControl(''),
      height: new FormControl('', [Validators.required, Validators.min(1)]),
      size: new FormControl('', [Validators.required, Validators.min(1)]),
    }));
  }

  public deleteColis(index: number) {
    console.log(index);
    this.commande.deleteColis(index);
    this.formsColis.splice(index, 1);
  }

  public validate(block: string) {
    let valid = true;
    this.connected = this.authService.isUserLoggedIn();

    if (block === 'dimensions') {
      this.formsColis.forEach(form => {
        if (form.invalid) {
          valid = false;
        }
      });

      // Valider poids
      if(!this.isPoidsValid()) {
        valid = false;
      }
    }
    if (block === 'contact') {
      if (!this.commande.loadingContact.validate() || !this.commande.shippingContact.validate()) {
        valid = false;
      }
    }
    return valid;
  }

  public isPoidsValid() {
    let valid = true;

    let somme = 0; 
    this.commande.colis.forEach(colis => {
        somme += colis.size;
      });
    if (somme > this.commande.trajet.capacityPoids) {
        valid = false;
    }

    return valid;

  }

  // register() {
  //   //Valider User registration form
  //   console.log('==> Trying to register');
  //   this.loading = true;
  //   this.authService.registration(this.commande.user).subscribe( response => {
  //     console.log('<== Registration done');
  //     this.newUser = !this.newUser;
  //     this.loading = false;
  //     this.login();
  //   });
  // }

  logout() {
    console.log('==> Trying to deconnect');
    this.authService.logOut();
    this.connected = false;
    console.log('<== Deconnected');
  }

  connexionReturn(e) {
    if(e) {
      this.connected = true;
      console.log('==> Getting user connected');
      this.authService.whoAmI().subscribe(result => {
        this.commande.user = result;
        console.log('<== User identified !');
        this.connected = true;
      });
    }
  }

  // login() {
  //   this.loading = true;
  //   console.log('==> Trying to connect');
  //   this.authService.login(this.commande.user.identifiant, this.commande.user.password).subscribe(response => {
  //     sessionStorage.setItem('username', response.username);
  //     sessionStorage.setItem('token', response.token);
  //     console.log('<== Connected...');
  //     console.log('==> Getting new user');
  //     this.authService.whoAmI().subscribe(result =>
  //       {
  //         this.commande.user = result;
  //         console.log('<== User identified !');
  //         this.connected = true;
  //         this.loading = false;
  //       })
  //   });
  // }

  submit() {
    if (this.custom) {
      this.router.navigate(['/message', 'custom']);
    } else {
      this.commande.colis.forEach(palette => {
        const dimensions = palette.type.split('x', 2 );
        palette.width = +dimensions[0];
        palette.length = +dimensions[1];

      });
      this.commande.submited = true;
      Utils.scrollTo('commandeDescription');
    }
  }

  getPrixCommande() {
    return Utils.sumPrice(this.commande.colis, this.commande.trajet.tranches);
  }

}
