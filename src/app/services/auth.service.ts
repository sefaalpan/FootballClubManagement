import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/iuser.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService{

  private connectedUser !: User;

  constructor(private us : UserService) { }

  loginUser(user:User){
    this.connectedUser=user;
  }
  
  loggedIn(){
      return !!localStorage.getItem('token');
  }

  
  
}
