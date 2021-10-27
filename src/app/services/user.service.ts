import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import md5 from 'md5-ts';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Coach, Joueur, President, User } from '../models/iuser.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUser !: User;
  private users: User[] = [];

  private presidentsEndUrl: string = environment.url + 'presidents/';
  private coachEndUrl: string = environment.url + 'coachs/';
  private joueursEndUrl: string = environment.url + 'joueurs/';

  myUserSubject: Subject<User> = new Subject<User>();


  constructor(private httpclient: HttpClient) {

    this.getPresidents().subscribe((datas) => {
      datas.forEach(d => this.users.push(d));
    });
    this.getCoachs().subscribe((datas) => {
      datas.forEach(d => this.users.push(d));
    });

    console.log(this.users);

  }

  getPresidents(): Observable<President[]> {
    return this.httpclient.get<President[]>(this.presidentsEndUrl);
  }
  getPresidentById(id: number): Observable<President> {
    return this.httpclient.get<President>(this.presidentsEndUrl + id);
  }
  getPresidentByEmail(email: string): Observable<President[]> {
    let emailUrl = "?email="
    return this.httpclient.get<President[]>(this.presidentsEndUrl + emailUrl + email);
  }
  addPresident(president: President): Observable<President> {
    this.users.push(president);
    return this.httpclient.post<President>(this.presidentsEndUrl, president);
  }
  updatePresident(id: number, president: President): Observable<President> {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].email === president.email) {
        this.users[i] = president;
      }
    }
    return this.httpclient.put<President>(this.presidentsEndUrl + id, president);
  }
  deletePresident(id: number): Observable<void> {
    this.users.splice(id, 1);
    return this.httpclient.delete<void>(this.presidentsEndUrl + id);
  }
  getClubPresident(club_id: number): Observable<President[]> {
    let request = "?club_id="
    return this.httpclient.get<President[]>(this.presidentsEndUrl + request + club_id);
  }

  getCoachs(): Observable<Coach[]> {
    return this.httpclient.get<Coach[]>(this.coachEndUrl);
  }
  getCoachById(id: number): Observable<Coach> {
    return this.httpclient.get<Coach>(this.coachEndUrl + id);
  }
  getCoachByEmail(email: string): Observable<Coach> {
    let emailUrl = "?email="
    return this.httpclient.get<Coach>(this.coachEndUrl + emailUrl + email);
  }
  getCoachByClub(club_id: number): Observable<Coach[]> {
    let request = "?club_id="
    return this.httpclient.get<Coach[]>(this.coachEndUrl+ request + club_id);
  }
  addCoach(coach: Coach): Observable<void> {
    this.users.push(coach);
    return this.httpclient.post<void>(this.coachEndUrl, coach);
  }
  updateCoach(id: number, coach: Coach): Observable<Coach> {

    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].email === coach.email) {
        this.users[i] = coach;
      }
    }
    return this.httpclient.put<Coach>(this.coachEndUrl + id, coach);
  }
  deleteCoach(id: number): Observable<void> {
    this.users.splice(id, 1);
    return this.httpclient.delete<void>(this.coachEndUrl + id);
  }

  getJoueurs(): Observable<Joueur[]> {
    return this.httpclient.get<Joueur[]>(this.joueursEndUrl);
  }
  getJoueurById(id: number): Observable<Joueur> {
    return this.httpclient.get<Joueur>(this.joueursEndUrl + id);
  }
  getJoueursFromEquipe(equipe_id: number): Observable<Joueur[]> {
    let reqEquip = '?equipe_id='
    return this.httpclient.get<Joueur[]>(this.joueursEndUrl + reqEquip + equipe_id);
  }
  getJoueursFromClub(club_id: number): Observable<Joueur[]> {
    let reqClub = '?club_id='
    return this.httpclient.get<Joueur[]>(this.joueursEndUrl + reqClub + club_id);
  }

  addJoueur(joueur: Joueur): Observable<void> {
    // this.users.push(joueur);
    return this.httpclient.post<void>(this.joueursEndUrl, joueur);
  }
  updateJoueur(id: number, joueur: Joueur): Observable<void> {
    return this.httpclient.put<void>(this.joueursEndUrl + id, joueur);
  }
  deleteJoueur(id: number): Observable<void> {
    return this.httpclient.delete<void>(this.joueursEndUrl + id);
  }


  login(email: string, mdp: string): User {

    let user!: User;

    for (let i = 0; i < this.users.length; i++) {
      let u = this.users[i];
      if (u.email === email && u.password === mdp) {
        user = u;
        console.log(u);
        console.log(user);
        i = this.users.length;
      }
    }

    if (user != undefined) {
      console.log(user);

      this.currentUser = user;
      console.log(this.currentUser.role);

      console.log("Hello from service " + this.currentUser.prenom + " "
        + this.currentUser.nom);

      // let hash = this.generateToken(this.currentUser);
      // localStorage.setItem('token', hash);
      sessionStorage.setItem('token', JSON.stringify(this.currentUser));
      console.log(sessionStorage.getItem('token'));
      this.emitUser();
      return this.currentUser;
    }
    else return user;
  }

  getCurrentUser(): User {
    return this.currentUser;
  }

  emitUser() {
    this.myUserSubject.next(this.currentUser);
  }

  loggedIn() {
    // return !!this.currentUser;
    return !!sessionStorage.getItem('token')
  }

  generateToken(user: User) {
    return md5(user.email as string + user.password + user.role + user.nom + user.prenom);
  }
  getDiscrimatorValue(): string {
    console.log(this.currentUser.role);

    return this.currentUser.role as string;
  }

  deconnecter() {
    sessionStorage.removeItem('token');
  }

  initpostes() {

    let postes: string[] = [];

    postes.push("1 - Gardien de but");
    postes.push("2 - Latéral droit");
    postes.push("3 - Laréral gauche");
    postes.push("4 - Défenseur central droit");
    postes.push("5 - Défenseur central gauche");
    postes.push("6 - Milieu défensif");
    postes.push("7 - Attaquant gauche");
    postes.push("8 - Milieu central");
    postes.push("9 - Attaquant en pointe");
    postes.push("10 - Milieu offensif");
    postes.push("11 - Attaquant Droit");

    return postes;
  }



}
