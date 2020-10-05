import { Component, OnInit, Input } from '@angular/core';
import {  faLongArrowAltRight, faPlusSquare, faMinusSquare, faCheck, faTimes, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Batch, Commande, Colis } from 'src/app/model/Commande';
import Utils, { Etats } from 'src/app/Utils';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import { CommandeService } from 'src/app/service/commande.service';
import { Trajet } from 'src/app/model/Trajet';
import { TrajetService } from 'src/app/service/trajet.service';


@Component({
  selector: 'app-admin-trajet',
  templateUrl: './admin-trajet.component.html',
  styleUrls: ['./admin-trajet.component.css']
})
export class AdminTrajetComponent implements OnInit {

  iconArrow = faLongArrowAltRight;
  iconPlus = faPlusSquare;
  iconMinus = faMinusSquare;
  iconCheck = faCheck;
  iconTimes = faTimes;
  loadMoreIcon = faChevronDown;


  @Input()
  trajet: Trajet = null;
  loadingEtat = false;

  batch: Batch = new Batch();
  commandes: Array<Commande> = [];


  constructor(private commandeService: CommandeService, private trajetService: TrajetService) { }

  ngOnInit() {
    // Paginatation
    console.log('ngOnInit admin trajet');
    this.nextBatch();
  }

  nextBatch() {
    console.log(this.trajet);
    this.batch.loading = true;
    if(this.batch.hasNext)
   {
     this.commandeService.getCommandesByTrajet(this.trajet, this.batch.batchPage - 1, this.batch.batchSize).subscribe(
      data => {
        console.log(data);
        this.batch.hasNext = !(data.last);
        this.commandes = this.commandes.concat(data.content);
        this.commandes.forEach(commande => {
          Utils.convertCommandeToTS(commande);
        })
        this.batch.loading = false;
      }
    )
    this.batch.batchPage++;
  }
  }

  showButton(btn: string, commande: Commande): boolean {
    switch (commande.etat) {
      case Etats.En_Attente:
        if (btn === 'accept') {
          return true;
        } else {
          return false;
        }
      case Etats.Annule:
        return false;
      case Etats.Refuse:
        return false;
      case Etats.Accepte:
        if (btn === 'cancel' || btn === 'start') {
          return true;
        } else {
          return false;
        }
      case Etats.En_Cours:
        if ( btn === 'finish') {
          return true;
        } else {
          return false;
        }
      case Etats.Livre:
        return false;
      case Etats.Clos:
        return false;
      default:
        console.log('something wrong with commande, etat inconnu' + commande.etat)
        return false;
    }
  }

  collapse(event: any, index: number) {
    console.log('==> Collapsing detail ' + index);
    const content = $('#content' + index);
    console.log(content);
    if (content.get(0).style.maxHeight) {
      content.get(0).style.maxHeight = null;
    } else {
      content.get(0).style.maxHeight = content.get(0).scrollHeight + 'px';
    }
    // //TODO: maybe change fa-icon
    // const element = event.target;
    // $(element).toggleClass('nonactive');
    // $(element).siblings('.nonactive').toggleClass('nonactive');
  }

  public getNbrColis(commande: Commande) {
    return Utils.getNbrColis(commande);
  }

  public getPrice(commande: Commande) {
    return Utils.sumPrice(commande.colis, commande.trajet.tranches);
  }

  public getPricePalette(tranches: any, palette: Colis) {
    let prix = 0;
    tranches.forEach(tranche => {
      if (tranche.typePalette.code === palette.type) {
        const limit = tranche.poids.split('-', 2 );
        if ( palette.size < +limit[1] && palette.size >= +limit[0] ) {
          prix = palette.quantity * tranche.prix;
        }
      }
    });
    return prix;
  }

  public getTranchesPoids(tranches: any, palette: Colis) {
    let tranchePoids = '';
    tranches.forEach( tranche => {
      if (tranche.typePalette.code === palette.type) {
        const limit = tranche.poids.split('-', 2 );
        if ( palette.size < +limit[1] && palette.size >= +limit[0] ) {
          tranchePoids = tranche.poids;
        }
      }
    });
    return tranchePoids;
  }

  public generatePDF(commande: Commande) {
    pdfMake.createPdf(Utils.buildPdf(commande)).download();
  }

  public workflow(etape: string, commande: Commande) {

    // [nbr, poids, volume, price]
    const poids = this.getPoids(commande);
    const volume = this.getVolume(commande);
    const price = this.getPrice(commande);
    let changed = false;
    if(commande.etat === Etats.En_Attente){
      if (etape === 'accept') {
        commande.etat = Etats.Accepte;
        this.trajet.extra.valide[0]++;
        this.trajet.extra.valide[1] += poids;
        this.trajet.extra.valide[2] += volume;
        this.trajet.extra.valide[3] += price;
        this.trajet.extra.enAttente[0]--;
        this.trajet.extra.enAttente[1] -= poids;
        this.trajet.extra.enAttente[2] -= volume;
        this.trajet.extra.enAttente[3] -= price;
        changed = true;
      }

      if (etape === 'refuse') {
        changed = true;
        this.trajet.extra.nonValide[0]++;
        this.trajet.extra.nonValide[1] += poids;
        this.trajet.extra.nonValide[2] += volume;
        this.trajet.extra.nonValide[3] += price;
        this.trajet.extra.enAttente[0]--;
        this.trajet.extra.enAttente[1] -= poids;
        this.trajet.extra.enAttente[2] -= volume;
        this.trajet.extra.enAttente[3] -= price;
        commande.etat = Etats.Refuse;
      }
    }

    if(commande.etat === Etats.Accepte) {
      if(etape === 'start') {
        commande.etat = Etats.En_Cours;
        changed = true;
      }

      if (etape === 'cancel') {
        commande.etat = Etats.Annule;
        changed = true;
        this.trajet.extra.valide[0]--;
        this.trajet.extra.valide[1] -= poids;
        this.trajet.extra.valide[2] -= volume;
        this.trajet.extra.valide[3] -= price;
      }

    }

    if(commande.etat === Etats.En_Cours) {
      if(etape === 'finish') {
        commande.etat = Etats.Livre;
        changed = true;
      }
    }

    if(changed) {
      this.loadingEtat = true;
      this.commandeService.upadateEtat(commande).subscribe( response => {
        console.log(response);
      })
    } else {
      console.error('something wrong ! action to nothing :(')
    }
  }

  switchEtat() {
    this.trajetService.addTrajets([this.trajet]).subscribe(result => {
      console.log('switched !');
    });
  }

  public getPoids(commande: Commande): number {
    let poids = 0;
    commande.colis.forEach( colis => {
      poids += colis.size * colis.quantity;
    });
    return poids;
  }

  public getVolume(commande: Commande): number {
    let volume = 0;
    commande.colis.forEach( colis => {
      const widht = colis.type.split('x',2)[0];
      const length = colis.type.split('x',2)[1];
      volume += +widht * +length * colis.height * colis.quantity;
    });
    return volume;
  }

  getEtatsLibelle(commande: Commande): string {
    return Utils.getLibelleFromEtat(commande.etat);
  }


  public getTotal(): number[] {
    let total = [0,0];
    this.commandes.forEach(commande => {
      total[0] += this.getPoids(commande);
      total[1] += this.getPrice(commande);
    });
    return total;
  }

  public calculateDates(trajet: Trajet) {
    const time = new Date().getTime() - trajet.date.getTime();
    // console.log(time);
    return Math.floor(time / (24 * 60 * 60 * 1000));
  }


}
