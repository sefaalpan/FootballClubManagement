import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/iuser.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  isConnected = false;
  user !: User;

  constructor(private router : Router, private us : UserService) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('token') as string)
    
    this.us.myUserSubject.subscribe((cu: User) => {
      this.user = cu;
      this.isConnected=true;
    });
  }

  deconnexion(){
    this.isConnected = false;
    this.us.deconnecter();
    this.user={};
    // localStorage.removeItem('token');
    this.router.navigate(['login']);

  }

}
