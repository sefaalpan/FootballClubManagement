import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/iuser.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  currentuser = this.us.getCurrentUser();

  constructor(private us: UserService) { }

  ngOnInit(): void {}

}
