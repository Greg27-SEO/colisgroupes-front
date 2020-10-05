import { Component, OnInit } from '@angular/core';
import { faTruckMoving, faClock, faArrowAltCircleLeft, faChevronDown, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { Trajet } from '../model/Trajet';
import { User } from '../model/User';
import { Commande, Batch } from '../model/Commande';
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import Utils from '../Utils';
import { TrajetService } from '../service/trajet.service';
import { CommandeService } from '../service/commande.service';
import { AuthenticationService } from '../service/authentication.service';

import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-trajet-commande',
  templateUrl: './trajet-commande.component.html',
  styleUrls: ['./trajet-commande.component.css'],
  animations: [
    trigger(
      'triggerShown', [
       state('show', style({
          opacity: 1,
       })),
       state('hidden', style({
        opacity: 0
       })),
       transition('show => hidden', animate('.6s 700ms ease-in-out')),
       transition('hidden => show', animate('.6s 1200ms ease-in-out'))
    ],
    ),
    trigger('enterAnimation', [
      transition(':enter', [
        style({transform: 'translateX(50%)', opacity: 0}),
        animate('400ms ease-in-out', style({'max-height': '165px'})),
        animate('300ms ease-in-out', style({transform: 'translateX(0)', opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translateX(0)', opacity: 1}),
        animate('400ms ease-in-out', style({transform: 'translateX(50%)', opacity: 0})),
        animate('200ms ease-in-out', style({'max-height': '0px'}))
      ])
    ]),
    trigger('trajet', [
      transition(':leave', [
        // style({ transform: 'translateX(-50%)', opacity: 1 }),
        animate('600ms 600ms ease-in-out', style({ transform: 'translateX(-50%)', opacity: 0 }))
        // animate('200ms ease-in-out', style({ 'max-height': '0px' }))
      ]),
      transition(':enter', [
        style({ transform: 'translateX(-50%)', opacity: 0 }),
        animate('600ms 600ms ease-in-out', style({ transform: 'translateX(0)', opacity: 1 }))
        // animate('200ms ease-in-out', style({ 'max-height': '0px' }))
      ])
    ])
 ]
})

export class TrajetCommandeComponent implements OnInit {

  truckIcon = faTruckMoving;
  timeIcon = faClock;
  returnIcon = faArrowAltCircleLeft;
  loadMoreIcon = faChevronDown;


  monthNames = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin',
  'juil', 'aoû', 'sep', 'oct', 'nov', 'déc'
  ];

  dateFilter = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  sortNotFull = false;
  custom = false;


  batch: Batch = new Batch();
  trajets: Array<Trajet> = [];
  allTrajets: Array<Trajet> = [];
  mockTrajets: Array<Trajet> = [];
  trajetChosen: Trajet = null;
  commande: Commande = null;
  loading = false;


  constructor(private trajetService: TrajetService, private commandeService: CommandeService,
    private authService: AuthenticationService, private datePipe: DatePipe, private router: Router) {
  }

  ngOnInit() {
    if (this.authService.isUserAdmin()) {
      this.router.navigate(['/admin']);
    }
    this.nextBatch();
  }

  nextBatch() {
    if(this.batch.hasNext && !this.batch.loading) {
      this.batch.loading = true;
      this.trajetService.getTrajets(this.batch.batchPage - 1, this.batch.batchSize, this.dateFilter).subscribe(
        data => {
          console.log(data.last);
          this.batch.hasNext = !(data.last);
          //fixing dates for safari
          const ua = navigator.userAgent.toLowerCase();
          if (ua.indexOf('safari') != -1) {
            if (ua.indexOf('chrome') > -1) {
            } else {
              data.content.forEach(element => {
                // console.log(element.date.replace(/-/g, '/'));
                element.date = element.date.replace(/-/g, '/');
                // element.date = element.date.split('T')[0];
              });
            }
          }

          this.trajets = this.trajets.concat(data.content);
          this.trajets.forEach(trajet => {
            Utils.convertToTS(trajet);
          });
          this.batch.loading = false;
        }
      );
      this.batch.batchPage++;
    }
  }

  filterByDate() {
    console.log('changed');
    console.log(this.dateFilter);
    this.batch = new Batch();
    this.trajets = [];
    this.nextBatch();
  }

  sort() {
    if (this.sortNotFull) {
      this.trajets = this.trajets.filter(trajet => {
        return !trajet.isFull;
      });
    } else {
      this.batch = new Batch();
      this.trajets = [];
      this.nextBatch();
    }
  }

  public trajetClick( trajet: Trajet) {
    if (this.trajetChosen == null && !trajet.isFull) {
      this.trajetChosen = trajet;
      Utils.scrollTo('commandeDescription');
      this.commande = new Commande(trajet, new User('', '', '', '', '', ''))
      if (this.authService.isUserLoggedIn()) {
        this.authService.whoAmI().subscribe( me => {
          this.commande = new Commande(trajet, me);
          console.log('we know who u are hahaha');
          console.log(this.commande);

        },
        error => {
          console.log('error getting me :(')
          if(error.status === 204) {
            console.log('acces denied ==> not connected in bakcend');
          }
          this.authService.logOut(false);

        });
      }
      console.log('commande init...')
    }

  }

  public returnToList() {
    this.trajetChosen = null;
    Utils.scrollTo('trajetDescription');
  }

  public modifierCommande(idScroll: string) {
    this.commande.submited = false;
    // TODO: Scrol to partie concerne
    Utils.scrollTo('commandeDescription');
  }

  public valider() {
    console.log('==> Adding commande' + this.commande);
    this.loading = true;
    this.commandeService.addCommande(this.commande).subscribe(
      result => {
        this.loading = false;
        this.router.navigate(['/message', 'success']);
        console.log('<== Commande added !');
      }
    );
  }

  public getPrice() {
    return Utils.sumPrice(this.commande.colis, this.trajetChosen.tranches);
  }

  public generatePDf() {
    pdfMake.createPdf(Utils.buildPdf(this.commande)).download();
  }

  public onScroll() {
    this.nextBatch();
  }


}
