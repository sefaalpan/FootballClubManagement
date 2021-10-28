import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Club } from 'src/app/models/club.model';
import { Equipe } from 'src/app/models/equipe.model';
import { User } from 'src/app/models/iuser.model';
import { ClubService } from 'src/app/services/club.service';
import { EquipeService } from 'src/app/services/equipe.service';

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.scss']
})
export class ClubComponent implements OnInit {

  club !: Club;
  user !: User;
  equipes: Equipe[] = [];

  constructor(private cs: ClubService, private es: EquipeService) {}

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('token') as string);
    this.cs.getClubById(this.user.club_id as number)
      .subscribe(c => {
        this.club = c;
        this.es.getEquipesClub(c.id)
          .subscribe(e => {
            this.equipes = e;
          });
      });
  }

}
