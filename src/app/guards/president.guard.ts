import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { User } from '../models/iuser.model';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class PresidentGuard implements CanActivate {

  user!: User;
  constructor(private us: UserService, private router: Router) { }

  canActivate(): boolean {

    this.user = JSON.parse(localStorage.getItem('token') as string)

    if (this.user) {
      if (this.user.role === "president")
        return true;
    }
    else if (!this.user) {
      this.router.navigate(['login']);
    }
    else {
      this.router.navigate(['home']);
    }
    return false;
  }

}
