import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import md5 from 'md5-ts';
import { Club } from 'src/app/models/club.model';
import { Equipe } from 'src/app/models/equipe.model';
import { President, User, Coach } from 'src/app/models/iuser.model';
import { ClubService } from 'src/app/services/club.service';
import { EquipeService } from 'src/app/services/equipe.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-compte',
  templateUrl: './compte.component.html',
  styleUrls: ['./compte.component.scss']
})
export class CompteComponent implements OnInit {
  user !: User;
  club !: Club;
  coach !: Coach;
  equipe !: Equipe;
  form = new FormGroup({});
  activModif = false;
  message = '';

  constructor(private us: UserService,
    private cs: ClubService,
    private es: EquipeService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      oldpassword: new FormControl("", Validators.required),
      nouveaupassword: new FormControl("", Validators.required),
      confirmationpassword: new FormControl("", Validators.required),
    })
  }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('token') as string);
    
    if (this.user.role === 'coach') {
      this.coach = this.user as Coach;
      this.cs.getClubById(this.coach.club_id as number).
     
      subscribe(c => {
        this.club = c       
      });

      this.es.getEquipeById(this.coach.equipe_id as number)
        .subscribe(e => this.equipe = e);
    }
    else {

      this.cs.getClubById(this.user.club_id as number).
      subscribe(c => {        
        this.club = c       
      });
      
    }
  }
  submit() {
    // this.activModif = true;
    if (this.form.valid) {
      let old = this.form.value.oldpassword as string;
      old = md5(old);
      if (old === this.user.password) {
        let nvpwd = this.form.value.nouveaupassword as string;
        nvpwd = md5(nvpwd);
        
        this.coach.password=nvpwd;
        if (this.user.role === 'coach') {
          this.us.updateCoach(this.coach.id as number, this.coach)
            .subscribe(c => {
              this.coach = c
              this.message = "Le mot de passe a été modifié avec succès";
              this.form.reset()
            });
        }
        else {
          this.user.password=nvpwd;
          this.us.updatePresident(this.user.id as number, this.user)
            .subscribe(p => {
              this.user = p;
              this.message = "Le mot de passe a été modifié avec succès";
              this.form.reset()
            })
        }
      }
      else{
        this.message="Les mots de passe sont incorrects";
      }
    }

  }
}
