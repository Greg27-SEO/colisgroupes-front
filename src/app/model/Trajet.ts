import { Time } from '@angular/common';

const villesRaccordes = ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg',
 'Montpellier', 'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Le Havre', 'Saint-Étienne', 'Toulon', 'Grenoble',
 'Angers', 'Dijon', 'Brest', 'Le Mans', 'Nîmes', 'Aix-en-Provence', 'Clermont-Ferrand', 'Tours', 'Amiens', 
 'Limoges', 'Villeurbanne', 'Metz', 'Besançon', 'Perpignan', 'Orléans', 'Caen', 'Mulhouse', 'Rouen', 'Nancy',
 'Roubaix', 'Avignon', 'Tourcoing', 'Poitiers', 'Pau', 'La Rochelle', 'Antibes', 'Calais', 'Béziers', 
 'Bourges', 'Cannes', 'Saint-Nazaire', 'Dunkerque', 'Quimper', 'Valence', 'Colmar', 'Mérignac', 'Ajaccio', 
 'Troyes', 'Villeneuve-d\'Ascq', 'Niort', 'Lorient', 'Chambéry', 'Saint-Quentin', 'Pessac', 'Vénissieux', 
 'La Seyne-sur-Mer', 'Beauvais', 'Cholet', 'Hyères', 'Montauban', 'Vannes', 'La Roche-sur-Yon', 
 'Charleville-Mézières', 'Laval', 'Auxerre'];
export { villesRaccordes };


export enum TYPE {
  SMALL = '1200x800',
  MEDIUM = '1200x1000',
  LARGE = '1200x1200',
}

export class Tranche {
  constructor(
    public typePalette: {code: string},
    public poids: string = '-',
    public prix: number = 0,
    public id: number = null,
  ) { }

  // public validate() {
  //   return this.adress !== '' && ( this.telephone !== '' );
  // }
}


// model trajet

export class Trajet {
  constructor(
    public id?: number,
    public villeDepart?: string,
    public villeDestination?: string,
    public date?: Date,
    public duration?: string,
    public capacityPoids?: number,
    public capacityVolume?: number,
    public tranches?: Tranche[],
    // public prix?: number,
    public isFull?: boolean,
    public extra?: any,
    public durationObject: Time = {hours: 0, minutes: 0}
  ) { }

}

// type Time = {
//   hours: number;
//   minutes: number;
// };
