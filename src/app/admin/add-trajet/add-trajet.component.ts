import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { Trajet, Tranche, TYPE, villesRaccordes } from 'src/app/model/Trajet';
import * as $ from 'jquery';
import { Time } from '@angular/common';
import { TrajetService } from '../../service/trajet.service';
import Utils from 'src/app/Utils';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { villeValidator, numeric } from '../../Utils';
import { faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-add-trajet',
  templateUrl: './add-trajet.component.html',
  styleUrls: ['./add-trajet.component.css']
})
export class AddTrajetComponent implements OnInit, AfterViewInit {

  villes = villesRaccordes;
  removedVille = {
    start: '',
    end: ''
  };
  touchedDepart = false;
  touchedDestination = false;
  days = [];
  myDuration;
  previewFormat = '{{h}} heures, {{m}} minutes, {{s}} seconds';
  loading = false;
  @Input() trajet: Trajet = new Trajet();
  @Output() done = new EventEmitter<boolean>();
  formTrajet: FormGroup;
  submitted = false;
  newTrajet = true;
  iconPlus = faPlusCircle;
  minusPlus = faMinusCircle;
  capacitytmp = "0";
  errorsTranches = ['', '', '', ''];

  constructor(private trajetService: TrajetService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log(this.trajet);
    if (this.trajet.date != null) {
      console.log('fill the variable days');
      this.days.push(this.trajet.date);
      this.newTrajet = false;
    }

    // if (this.trajet.tranches == null) {
    //   this.trajet.tranches = [];
    //   const tranche1: Tranche = new Tranche({code: TYPE.SMALL }, '-');
    //   const tranche2: Tranche = new Tranche({code: TYPE.MEDIUM }, '-');
    //   const tranche3: Tranche = new Tranche({code: TYPE.LARGE }, '-');

    //   this.trajet.tranches.push(tranche1);
    //   this.trajet.tranches.push(tranche2);
    //   this.trajet.tranches.push(tranche3);
    // }

    if (this.trajet.duration != null) {
      this.myDuration = 'PT' + this.trajet.durationObject.hours + 'H' + this.trajet.durationObject.minutes + 'M0S';
    }
    this.formTrajet = this.formBuilder.group({
      villeDepart: new FormControl(this.trajet.villeDepart, [Validators.required, villeValidator] ),
      villeDestination: new FormControl(this.trajet.villeDestination, [Validators.required, villeValidator]),
      capacityPoids: new FormControl(this.trajet.capacityPoids, [Validators.required, numeric]),
      capacityVolume: new FormControl(this.trajet.capacityVolume, [Validators.required, numeric]),
      //prix: new FormControl(this.trajet.prix, [Validators.required, numeric]),
      days: new FormControl('')
    });
  }

  ngAfterViewInit(): void {
    // console.log('trying');

    $('.input-container > input').css({
      width : '100%',
      border: '2px solid darkgrey',
    });

    $('.autocomplete-container').css({
      'margin-top' : '10px',
    });

    $('.bs-chevron').css({
      left: '11px',
      color: '#4084a0'
    });

    $('table').css({
      margin: 'auto',
    });

  }

  selectEvent(item, which: string) {
    // console.log('selected....');
    // console.log(item);
    if (which === 'start') {
      this.removedVille.start = item;
      this.touchedDepart = true;
      // this.formTrajet.get('villeDepart').setValue(item);
    } else {
      // this.formTrajet.get('villeDestination').setValue(item);
      this.removedVille.end = item;
      this.touchedDestination = true;
    }
    // console.log(this.formTrajet);

    this.villes = this.villes.filter(ville => {
      return ville !== item;
    });

    // let historyList;
    // historyList = localStorage.getItem('villesList');
    // console.log(historyList);
    // if(historyList.length > 0) {
    //   historyList = (historyList as Array<string>).filter( historyVille => {
    //         return historyVille !== item;
    //       });
    //   localStorage.setItem('villesList', historyList);
    // }
  }

  initTranches(event) {
    console.log(event);
    if (this.trajet.tranches == null) {
      this.trajet.tranches = [];
      const tranche1: Tranche = new Tranche({code: TYPE.SMALL }, '-' + this.trajet.capacityPoids,0);
      const tranche2: Tranche = new Tranche({code: TYPE.MEDIUM }, '-' + this.trajet.capacityPoids,0);
      const tranche3: Tranche = new Tranche({code: TYPE.LARGE }, '-' + this.trajet.capacityPoids,0);
      
      this.trajet.tranches.push(tranche1);
      this.trajet.tranches.push(tranche2);
      this.trajet.tranches.push(tranche3);
    } else {
      this.trajet.tranches.forEach(tranche => {
        if(this.getPoids(tranche, 'max') === this.capacitytmp) {
          this.setPoids(tranche, 'max', null);
        }
      });
    }
    this.capacitytmp = event.target.value;
  }

  onFocused(event, wich: string) {
    if (wich === 'start') {
      this.formTrajet.get('villeDepart').markAsTouched();
    } else {
      this.formTrajet.get('villeDestination').markAsTouched();
    }
  }

  setPoids(tranche: Tranche, type: string, event) {
    const limit = tranche.poids.split('-', 2);

    if (type === 'min') {
      tranche.poids = event.target.value + '-' + limit[1];
    } else {
      if ( event === null) {
        tranche.poids = limit[0] + '-' + this.trajet.capacityPoids;
      } else {
        tranche.poids = limit[0] + '-' + event.target.value;
      }
    }
  }
  getPoids(tranche: Tranche, type: string) {
    const limit = tranche.poids.split('-', 2);
    console.log(this.trajet)
    if (type === 'max') {
      return limit[1]
    } else {
      return limit[0];
    }
  }

  setPrix(tranche: Tranche, event) {
    tranche.prix = event.target.value;
  }

  getPoidsPrecedent(tranche: Tranche, index: number, type: string) {
    let lastMax = 0;

    if ( index > 0) {
      const list = this.trajet.tranches.filter( (item: Tranche) => item.typePalette.code === type );
      lastMax = +list[index - 1].poids.split('-', 2 )[1];
    }

    const limit = tranche.poids.split('-', 2);
    tranche.poids = (lastMax + 1) + '-' + limit[1];
    return lastMax + 1;
  }

  ajouterTranche(type: string) {
    console.log(type);
    let index = 0;
    if (type === '1200x1000') {
      index = 1;
    }
    if (type === '1200x1200') {
      index = 2;
    }
    // Validate
    const list = this.trajet.tranches.filter( (item: Tranche) => item.typePalette.code === type );
    const lastTranche = list.pop();
    const limit = lastTranche.poids.split('-', 2);
    if (lastTranche.prix === 0 || limit[0] === '' || limit[1] === '') {
      this.errorsTranches[index] = 'Veuillez compléter la saisie de la tanche..';
    } else {
      this.errorsTranches[index] = '';
      this.trajet.tranches.push(new Tranche({code: type}, '-' + this.trajet.capacityPoids, 0));
    }
    console.log(this.trajet);
  }

  supprimerTranche(type: string) {
    const list = this.trajet.tranches.filter( (item: Tranche) => item.typePalette.code === type );
    const tranche = list.pop();
    const index = this.trajet.tranches.indexOf(tranche);
    this.trajet.tranches.splice(index, 1);
    console.log(this.trajet);
  }

  sizeTranches(type: string) {
    return this.trajet.tranches.filter(item => item.typePalette.code === type).length > 1;
  }

  villeCleared(item, which: string) {
    // console.log('deselected...');
    // console.log(this.formTrajet);
    if (which === 'start') {
      // this.formTrajet.get('villeDepart').setValue('');
      this.villes = this.villes.concat(this.removedVille.start);
      this.touchedDepart = false;
    } else {
      // this.formTrajet.get('villeDestination').setValue('');
      this.villes = this.villes.concat(this.removedVille.end);
      this.touchedDestination = false;
    }

  }

  convertDurationToString() {
    let hours = 0;
    let minutes = 0;
    if(this.myDuration != null) {
      hours = this.myDuration.substring(
        this.myDuration.lastIndexOf('T') + 1,
        this.myDuration.lastIndexOf('H')
      );
      if(!this.myDuration.endsWith('H')) {
        minutes = this.myDuration.substring(
          this.myDuration.lastIndexOf('H') + 1,
          this.myDuration.lastIndexOf('M')
        );
      }
    }

    this.trajet.durationObject.hours = hours;
    this.trajet.durationObject.minutes = minutes;
  }

  addTrajet() {
    //Validation...
    this.submitted = true;
    if (this.days.length === 0) {
      Utils.scrollTo('dates');
      console.log('days empty');
      return;
    }

    if (this.formTrajet.invalid || !this.tranchesValide()) {
      console.log('Validation failed..');
      // console.log(this.formTrajet);
      return;
    }


    // console.log(this.days);
    this.loading = true;
    this.convertDurationToString();
    Utils.convertToJava(this.trajet);
    let trajets: Trajet[] =  [];
    if(this.newTrajet) {
      this.days.forEach(day => {
        trajets = trajets.concat(new Trajet(null, this.formTrajet.get('villeDepart').value,
          this.formTrajet.get('villeDestination').value, day, this.trajet.duration,
          this.trajet.capacityPoids, this.trajet.capacityVolume, this.trajet.tranches, this.trajet.isFull));
      });
    } else {
      this.trajet.villeDepart = this.formTrajet.get('villeDepart').value;
      this.trajet.villeDestination = this.formTrajet.get('villeDestination').value;
      this.trajet.date = this.days[0];
      trajets.push(this.trajet);
    }
    //Adding
    // console.log(trajets);
    this.trajetService.addTrajets(trajets).subscribe( response => {
      this.loading = false;
      this.done.emit(true);
    },
    error => {
      this.loading = false;
      console.log(error);
      this.done.emit(false);
      this.submitted = false;
    });
  }

  tranchesValide(): boolean {
    let valid = true;
    let list = this.trajet.tranches.filter( (item: Tranche) => item.typePalette.code === TYPE.SMALL );
    let lastTranche = list.pop();
    let limit = lastTranche.poids.split('-', 2);
    if(limit[0] === '' || limit[1] === '' || lastTranche.prix == 0 ) { valid = false; }
    list = this.trajet.tranches.filter( (item: Tranche) => item.typePalette.code === TYPE.MEDIUM );
    lastTranche = list.pop();
    limit = lastTranche.poids.split('-', 2);
    if(limit[0] === '' || limit[1] === '' || lastTranche.prix == 0 ) { valid = false; }
    list = this.trajet.tranches.filter( (item: Tranche) => item.typePalette.code === TYPE.LARGE );
    lastTranche = list.pop();
    limit = lastTranche.poids.split('-', 2);
    if(limit[0] === '' || limit[1] === '' || lastTranche.prix == 0 ) { valid = false; }
    if(!valid) {
      this.errorsTranches[3] = 'Veuillez compléter la saisie des informations sur les tranches avant de soumettre...';
    } else {
      this.errorsTranches[3] = '';
    }
    return valid;
  }

}
