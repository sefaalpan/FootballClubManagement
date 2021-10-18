import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/users.model';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  currentuser !: User;

  constructor(private us: UsersService) { }

  ngOnInit(): void {
    this.currentuser = this.us.getCurrentUser();
  }

}
