import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Club } from '../models/club.model';

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  private url = environment.url + 'clubs/';
  
  constructor(private httpclient : HttpClient) { }

  getClubs(): Observable<Club[]> {
    return this.httpclient.get<Club[]>(this.url);
  }
  getClubById(id:number): Observable<Club> {
    return this.httpclient.get<Club>(this.url+id);
  }
  
  getClubByMatricule(matricule:string): Observable<Club[]> {
    let matriculeParam = "?matricule=";
    return this.httpclient.get<Club[]>(this.url+matriculeParam+matricule);
  }
  
  addClub(club : Club) : Observable<Club>{
    return this.httpclient.post<Club>(this.url, club);
  }
  updateClub(id:number, club:Club) : Observable<void>{
    return this.httpclient.post<void>(this.url+id, club);
  }
  deleteClub(id:number): Observable<void>{
    return this.httpclient.delete<void>(this.url+id);
  }

  checkClubExist(matricule : string) : boolean {
    let matriculeParam = "?matricule=";
    return !!this.httpclient.get<Club>(this.url+matriculeParam+matricule);
  }
  

}
