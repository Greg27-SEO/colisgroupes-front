import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trajet } from '../model/Trajet';
import { DatePipe } from '@angular/common';


@Injectable({
  providedIn: 'root'
})

/*
* Need Java Trajet Model (Use Utils.convertToJava)
*/

export class TrajetService {

  private trajetsUrl: string;

  constructor(private http: HttpClient, private datePipe: DatePipe) {
    this.trajetsUrl = 'https://colis-groupes.fr:8443/';
    // this.trajetsUrl = 'http://localhost:8080/';
  }

  public findAll(): Observable<Trajet[]> {
    return this.http.get<Trajet[]>(this.trajetsUrl + 'getTrajets');
  }


  public getTrajets(page: number, nbElements: number, filtre: string = this.datePipe.transform(new Date(), 'yyyy-MM-dd')): Observable<any> {
    return this.http.get(this.trajetsUrl + 'getTrajets?page=' + page + '&nbElements='
    + nbElements + '&filter=' + filtre);
  }

  public getExtraTrajet(id: number): Observable<any> {
    return this.http.get(this.trajetsUrl + 'getExtrasByTrajet?id=' + id);
  }

  // public save(trajet: Trajet) {
  //   return this.http.post<Trajet>(this.trajetsUrl, trajet);
  // }

  public addTrajets(trajets: Trajet[] ) {
    console.log('Adding trajets');
    console.log(trajets);
    return this.http.post<Trajet[]>(this.trajetsUrl + 'addTrajets' , trajets);
  }

  public deleteTrajet(trajetId: number) {
    return this.http.delete(this.trajetsUrl + 'deleteTrajet?id=' + trajetId);
  }
}
