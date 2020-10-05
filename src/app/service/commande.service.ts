import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Commande } from '../model/Commande';
import Utils from '../Utils';
import { Observable } from 'rxjs';
import { Trajet } from '../model/Trajet';


@Injectable({
  providedIn: 'root'
})
export class CommandeService {

  private commandesUrl: string;

  constructor(private http: HttpClient) {
    this.commandesUrl = 'https://colis-groupes.fr:8443/';
    // this.commandesUrl = 'http://localhost:8080/';
  }

  public addCommande(commande: Commande) {
    Utils.convertCommandeToJava(commande);
    console.log(commande);
    return this.http.post<Commande>(this.commandesUrl + 'addCommande' , commande);
  };

  public getCommandes(page: number, nbElements: number): Observable<any> {
    return this.http.get(this.commandesUrl + 'getCommandes?page=' + page + '&nbElements=' + nbElements);
  }

  public getCommandesByTrajet(trajet: Trajet, page: number, nbElements: number): Observable<any> {
    return this.http.get(this.commandesUrl + 'getCommandesByTrajet?id=' + trajet.id + '&page=' + page + '&nbElements=' + nbElements);
  }

  public upadateEtat(commande: Commande) {
    return this.http.get(this.commandesUrl + 'updateCommande?id=' + commande.id + '&etat=' + commande.etat);
  }
}
