import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Coach, Joueur, President } from '../models/iuser.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private presidentsEndUrl : string = environment.url+'presidents/';
  private coachEndUrl : string = environment.url+'coachs/';
  private joueursEndUrl : string = environment.url+'joueurs/';

  constructor(private httpclient : HttpClient) { }

  getPresidents() : Observable<President[]> {
    return this.httpclient.get<President[]>(this.presidentsEndUrl);
  }
  getPresidentById(id:number) : Observable<President>{
    return this.httpclient.get<President>(this.presidentsEndUrl+id);
  }
  addPresident(president : President) : Observable<void> {
    return this.httpclient.post<void>(this.presidentsEndUrl, president);
  }
  updatePresident(id:number,president : President) : Observable<void>{
    return this.httpclient.put<void>(this.presidentsEndUrl+id, president);
  }
  deletePresident(id:number) : Observable<void>{
    return this.httpclient.delete<void>(this.presidentsEndUrl+id);
  } 

  getCoachs() : Observable<Coach[]> {
    return this.httpclient.get<Coach[]>(this.coachEndUrl);
  }
  getCoachById(id:number) : Observable<Coach>{
    return this.httpclient.get<Coach>(this.coachEndUrl+id);
  }
  addCoach(coach : Coach) : Observable<void> {
    return this.httpclient.post<void>(this.coachEndUrl, coach);
  }
  updateCoach (id:number,coach: Coach) : Observable<void>{
    return this.httpclient.put<void>(this.coachEndUrl+id, coach);
  }
  deleteCoach(id:number) : Observable<void>{
    return this.httpclient.delete<void>(this.coachEndUrl+id);
  } 

  getJoueurs() : Observable<Joueur[]> {
    return this.httpclient.get<Joueur[]>(this.joueursEndUrl);
  }
  getJoueurById(id:number) : Observable<Joueur>{
    return this.httpclient.get<Joueur>(this.joueursEndUrl+id);
  }
  addJoueur(joueur : Joueur) : Observable<void> {
    return this.httpclient.post<void>(this.joueursEndUrl, joueur);
  }
  updateJoueur (id:number,joueur: Joueur) : Observable<void>{
    return this.httpclient.put<void>(this.joueursEndUrl+id, joueur);
  }
  deleteJoueur(id:number) : Observable<void>{
    return this.httpclient.delete<void>(this.joueursEndUrl+id);
  } 



}
