import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router : Router,private us:UserService){}

  //Il faut créer un guard président et coach 
  canActivate(): boolean {
    if(this.us.loggedIn()){
      return true;
    }
    else {
      this.router.navigate(['login']);
      return false;
    }
  }
  
}
