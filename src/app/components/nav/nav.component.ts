import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  isConnected = this.us.loggedIn();

  constructor(private router : Router, private us : UserService) { }

  ngOnInit(): void {
    console.log(this.isConnected);   
  }

  deconnexion(){
    this.isConnected = !this.isConnected;
    localStorage.removeItem('token');
    this.router.navigate(['login']);

  }

}
