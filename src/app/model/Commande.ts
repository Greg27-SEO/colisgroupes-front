import { Trajet } from './Trajet';
import { User } from './User';

export enum TYPE {
  SMALL = '1200x800',
  MEDIUM = '1200x1000',
  LARGE = '1200x1200',
}

export class Colis {
  constructor(
    public height: number,
    public type: string,
    public length: number,
    public width: number,
    public size: number,
    public quantity: number = 1,
    public prix: number = 0
  ) { }

  public validate() {
    return this.height > 0 && this.size > 0 && this.quantity > 0;
  }
}

export class Batch {
  constructor(
    public batchSize: number = 5,
    public batchPage: number = 1,
    public hasNext: boolean = true,
    public loading: boolean = false
  ) { }
}

class Contact {
  constructor(
      public name: string = '',
      public adress: string = '',
      public telephone: string = '',
      public mail: string = ''
  ) { }

  public validate() {
    return this.adress !== '' && ( this.telephone !== '' );
  }
}

// model commande

export class Commande {

  constructor(
    public trajet: Trajet,
    public user: User,
    public id?: number,
    // public nbrColis: number,
    public loadingContact?: Contact,
    public shippingContact?: Contact,
    public adresses?: Contact[],
    public colis?: Colis[],
    public etat?: number,
    public submited: boolean = false
  ) {

    this.loadingContact = new Contact();
    this.shippingContact = new Contact();

    this.trajet = trajet;
    // this.nbrColis = nbrColis;
    this.colis = [];
    this.addColis(new Colis(null, null, null, null, null) );
    // this.colis = this.colis.concat([new Colis(0, 0, 0, 0)]);
  }

  public addColis(colis: Colis, index?: number) {
    if ( index ) {
      this.colis.splice(index, 0, colis);
    } else {
      this.colis = this.colis.concat([colis]);
    }
  }

  public deleteColis(index: number) {
    this.colis.splice(index, 1);
  }

  public getNbrColis() {
    let nombre = 0;
    for (const colis of this.colis) {
      nombre += colis.quantity;
    }
    return nombre;
  }

  public getPrix() {
    let prix = 0;

    for (const colis of this.colis) {
      colis.prix = colis.quantity * this.getPriceByTranche(this.trajet, colis.type, colis.size);
      prix += colis.prix;
    }
    return prix;
  }

  public getPriceByTranche(trajet: Trajet, typePalette: string, poids: number): number {
    let prixTranche = 0;
    if( poids !== null ) {
      trajet.tranches.forEach(tranche => {
        if (tranche.typePalette.code === typePalette && this.checkPoidsInTranche(poids, tranche.poids)) {
          prixTranche = tranche.prix;
        }
      });
    }
    // IF 0 returned error... not founds ??
    return prixTranche;
  }

  public  checkPoidsInTranche(poids: number, tranchePoids: string): boolean {
    const limit = tranchePoids.split('-', 2 );
    if ( poids < +limit[1] && poids >= +limit[0] ) {
      return true;
    }
    return false;
  }


  public getVolume() {
    let volume = 0;
    for (const colis of this.colis) {
      // All demensions with mm
      const dimensions = colis.type.split('x', 2 );
      volume += +dimensions[0] * +dimensions[1] * colis.height;
    }
    return volume;
  }

}

// type Time = {
//   hours: number;
//   minutes: number;
// };
