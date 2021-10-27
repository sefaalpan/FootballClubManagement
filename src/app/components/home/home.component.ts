import { Component, OnInit } from '@angular/core';
import { Club } from 'src/app/models/club.model';
import { Equipe } from 'src/app/models/equipe.model';
import { Coach, User } from 'src/app/models/iuser.model';
import { ClubService } from 'src/app/services/club.service';
import { EquipeService } from 'src/app/services/equipe.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  currentuser = this.us.getCurrentUser();
  coach !: Coach;
  club !: Club
  equipe !: Equipe;

  constructor(private us: UserService, private cs : ClubService, private es:EquipeService) { }

  ngOnInit(): void {

    this.currentuser = JSON.parse(sessionStorage.getItem('token') as string);
    if(this.currentuser.role==="coach")
      this.coach=this.currentuser as Coach;


    this.cs.getClubById(this.currentuser.club_id as number)
      .subscribe(c=>{
        this.club=c
        if(this.currentuser.role==='coach') {
          this.es.getEquipeById(this.coach.equipe_id as number)
            .subscribe(e=>this.equipe=e);
        }
      });
    
    
    
  }

}
