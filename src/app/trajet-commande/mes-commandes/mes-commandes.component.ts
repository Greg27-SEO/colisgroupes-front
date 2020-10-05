import { Component, OnInit } from '@angular/core';
import { faPlusSquare, faMinusSquare, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Commande, Batch, Colis } from '../../model/Commande';
import * as $ from 'jquery';
import { CommandeService } from 'src/app/service/commande.service';
import Utils from 'src/app/Utils';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';


@Component({
  selector: 'app-mes-commandes',
  templateUrl: './mes-commandes.component.html',
  styleUrls: ['./mes-commandes.component.css']
})
export class MesCommandesComponent implements OnInit {

  iconPlus = faPlusSquare;
  iconMinus = faMinusSquare;
  loadMoreIcon = faChevronDown;
  batch: Batch = new Batch();
  commandes: Array<Commande> = [];


  constructor(private commandeService: CommandeService) { }

  ngOnInit() {
    // Paginatation
    this.nextBatch();

  }



  nextBatch() {
    this.batch.loading = true;
    this.commandeService.getCommandes(this.batch.batchPage - 1, this.batch.batchSize).subscribe(
      data => {
        console.log(data);
        this.batch.hasNext = !(data.last);
        this.commandes = this.commandes.concat(data.content);
        this.commandes.forEach( commande => {
          Utils.convertCommandeToTS(commande);
        })
        this.batch.loading = false;
      }
      )
    // Reset system collapse
    this.batch.batchPage++;
  }

  getEtatsLibelle(commande: Commande): string {
    return Utils.getLibelleFromEtat(commande.etat);
  }

  // collapse() {
  //   const coll = document.getElementsByClassName('collapsible');
  //   let i = 0;

  //   for (i = 0; i < coll.length; i++) {
  //     coll[i].removeEventListener('click', function() {
  //       const content = this.nextElementSibling;
  //       if (content.style.maxHeight) {
  //         content.style.maxHeight = null;
  //       } else {
  //         content.style.maxHeight = content.scrollHeight + 'px';
  //       }
  //     });
  //     coll[i].addEventListener('click', function() {

  //     });
  //   }
  // }

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

}
