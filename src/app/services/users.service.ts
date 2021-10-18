import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Coach, Joueur, President, User } from '../models/users.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  //president test
  president = new President('Yee', 'Xiao', new Date(), 'president@email', '9003d1df22eb4d3820015070385194c8');

  private users: User[] = [];
  private currentUser !: User;

  

  constructor(private httpclient : HttpClient) {
    this.users.push(this.president);
    console.log(this.president);
  }

  getCurrentUser(): User {
    return this.currentUser;
  }

  addUser(user: User) : boolean {

    let exist = false;
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].email === user.email) {
        exist = true;
        i = this.users.length;
      }
    }
    if (!exist) {
      this.users.push(user);
      this.currentUser = user;
    }

    return exist;
  }

  createPresident(nom:string,prenom:string,naissance:Date,email:string,password:string) : boolean{
    let p = new President(nom,prenom,naissance,email,password);
    return this.addUser(p);
  }
  createCoach(nom:string,prenom:string,naissance:Date,email:string,password:string, statut:string) : boolean{
    let c = new Coach(nom,prenom,naissance,email,password,statut);
    return this.addUser(c);
  }
  
  createJoueur(nom:string,prenom:string,naissance:Date,email:string,password:string, poste:number, isBlesse:boolean) : boolean{
    let j = new Joueur(nom,prenom,naissance,email,password,poste,isBlesse);
    return this.addUser(j);
  }
  
  

  login(email: string, password: string): User {
    console.log(this.users.length);
    let u = new President('', '', new Date(), '', '');
    u.id = -1;

    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].email === email && this.users[i].password === password) {
        u = this.users[i];
        this.currentUser = u;
        i = this.users.length;
      }
    }
    return u;
  }




}