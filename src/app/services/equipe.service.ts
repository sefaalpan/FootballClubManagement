import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Equipe } from '../models/equipe.model';

@Injectable({
  providedIn: 'root'
})
export class EquipeService {


  private url = environment.url + 'equipes/';
  private reqClub_id = this.url +"?club_id="
  private reqCategorie = this.url + "?categorie="

  constructor(private httpclient: HttpClient) { }

  getEquipesConfondues(): Observable<Equipe[]> {
    return this.httpclient.get<Equipe[]>(this.url);
  }

  getEquipesClub(club_id: number): Observable<Equipe[]> {
    return this.httpclient.get<Equipe[]>(this.reqClub_id+club_id);
  }

  addEquipe(equipe : Equipe) : Observable<Equipe> {
    return this.httpclient.post<Equipe>(this.url, equipe);
  }

  deleteEquipe(id: number) : Observable<void>{
    return this.httpclient.delete<void>(this.url+ id);
  }

  deleteEquipeByCategorie(categorie:string) : Observable<void>{
    return this.httpclient.delete<void>(this.reqCategorie+ categorie);
  }

  updateEquipe(id: number, equipe:Equipe) : Observable<Equipe>{
    return this.httpclient.put<Equipe>(this.url+ id, equipe);
  }


}
