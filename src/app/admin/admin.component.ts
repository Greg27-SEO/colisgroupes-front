import { Component, OnInit, AfterViewInit } from '@angular/core';
import { faPlus, faLongArrowAltRight, faChevronDown, faUserEdit, faUserTimes, faMinus, faBackward } from '@fortawesome/free-solid-svg-icons';
import { Trajet } from '../model/Trajet';
import { Batch } from '../model/Commande';
import { TrajetService } from '../service/trajet.service';
import Utils from '../Utils';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import * as $ from 'jquery';
import { AuthenticationService } from '../service/authentication.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, AfterViewInit {


  iconPlus = faPlus;
  iconMinus = faBackward;
  iconArrow = faLongArrowAltRight;
  iconEdit = faUserEdit;
  iconDelete = faUserTimes;
  loadMoreIcon = faChevronDown;
  today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

  batch: Batch = new Batch(20);
  dateFilter = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  sortEnAttente = false;
  trajets: Array<Trajet> = [];
  trajetChosen = null;
  addingMode = false;
  trajetToEdit: Trajet = new Trajet();



  constructor(private trajetService: TrajetService, private authService: AuthenticationService, private datePipe: DatePipe) { }

  ngOnInit() {
    // Paginatation
    this.nextBatch();
  }

  ngAfterViewInit(): void {
    $('#date').val(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
  }

  nextBatch() {
    if (this.batch.hasNext && !this.batch.loading) {
      this.batch.loading = true;
      let newTrajets: Array<Trajet> = [];
      let requests = [];
      this.trajetService.getTrajets(this.batch.batchPage - 1, this.batch.batchSize, this.dateFilter).subscribe(
        data => {
          // console.log(data);
          this.batch.hasNext = !(data.last);

          // fixing safari bug dates
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
          newTrajets = data.content;
          newTrajets.forEach(trajet => {
            Utils.convertToTS(trajet);
            console.log('Calling extra..');
            requests = requests.concat(this.trajetService.getExtraTrajet(trajet.id));
          });

          forkJoin(requests).subscribe(
            responses => {
              newTrajets.forEach((trajet, index) => {
                trajet.extra = responses[index];
              });
              if (this.sortEnAttente) {
                newTrajets = newTrajets.filter( trajet => {
                  return trajet.extra.enAttente[0] > 0;
                });
              }
              this.trajets = this.trajets.concat(newTrajets);
              this.batch.loading = false;
            },
            error => {
              console.error('error in forkJoin');
              console.error(error);
            }
          );
          }
          );
      this.batch.batchPage++;
    }
  }

  deleteTrajet( trajet: Trajet, index: number ) {
    let message = 'êtes vous sur de vouloir supprimer ce trajet ?\n';
    if ( trajet.extra.valide[0] > 0 ) {
      message = message.concat('<b>Attention : </b> Vous avez validé '
      + trajet.extra.valide[0]
      + ' commandes, supprimer ce trajet impliquera l\'annualation de toutes les commandes validées');
    }
    if (confirm(message)) {
      // Code à éxécuter si le l'utilisateur clique sur "OK"
      console.log('goood');
      this.trajetService.deleteTrajet(trajet.id).subscribe(
        response => {
          console.log('Trajet supprimé avec succés');
          this.trajets.splice( index, 1 );
        },
        error => {
            console.error(error);
        }
      );
    } else {
      // Code à éxécuter si l'utilisateur clique sur "Annuler"
      console.log('cancel');

    }
  }

  switch() {
    this.addingMode = !this.addingMode;
    if (!this.addingMode) {
      console.log(this.dateFilter);
      $('#date').val(this.datePipe.transform(this.dateFilter, 'yyyy-MM-dd'));
    }
  }
  editTrajet(trajet: Trajet, index: number) {
    this.switch();
    this.trajetToEdit = trajet;
  }

  addingReturn(event) {
    console.log('addingReturn declenhed');
    this.addingMode = false;
    this.trajetToEdit = new Trajet();
    this.batch = new Batch(20);
    this.trajets = [];
    console.log(this.dateFilter);
    $('#date').val(this.datePipe.transform(this.dateFilter, 'yyyy-MM-dd'));
    this.nextBatch();
    if(event) {
      console.log('adding success');
    } else {
      console.log('adding failed');
    }
  }

  sort() {
    if (this.sortEnAttente) {
      this.trajets = this.trajets.filter( trajet => {
        return trajet.extra.enAttente[0] > 0;
      });
    } else {
      this.batch = new Batch(20);
      this.trajets = [];
      this.nextBatch();
    }
  }

  logout() {
    this.authService.logOut(false, true);
  }


  filterByDate(){
    console.log('changed');
    console.log(this.dateFilter);
    this.batch = new Batch(20);
    this.trajets = [];
    this.nextBatch();
  }


}
