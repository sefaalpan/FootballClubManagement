import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { Club } from 'src/app/models/club.model';
import { Equipe } from 'src/app/models/equipe.model';
import { President } from 'src/app/models/iuser.model';
import { ClubService } from 'src/app/services/club.service';
import { EquipeService } from 'src/app/services/equipe.service';

@Component({
  selector: 'app-gestion-equipes',
  templateUrl: './gestion-equipes.component.html',
  styleUrls: ['./gestion-equipes.component.scss']
})
export class GestionEquipesComponent implements OnInit {

  equipes: Equipe[] = [];
  club !: Club;
  president !: President;
  activForm = false;
  editForm = false;
  form = new FormGroup({});
  equipe !: Equipe;

  constructor(private es: EquipeService,
    private fb: FormBuilder,
    private router: Router,
    private cs: ClubService
  ) {
    this.form = this.fb.group({
      categorie: new FormControl("", Validators.required)
    })
  }

  ngOnInit(): void {
    this.president = JSON.parse(sessionStorage.getItem('token') as string)
    console.log(this.president);

    this.es.getEquipesClub(this.president.club_id as number)
      .subscribe(e => this.equipes = e);

    this.cs.getClubById(this.president.club_id as number)
      .subscribe(e => this.club = e);
  }

  editer(id: number) {
    this.es.getEquipeById(id)
      .subscribe(e => {
        // console.log(e);
        this.equipe = e
        console.log(this.equipe);

        this.activForm = true;
        this.editForm = true;
        this.form.patchValue(this.equipe);
      });
  }

  supprimer(id: number) {
    this.es.deleteEquipe(id as number)
      .pipe(
        mergeMap(datas => this.es.getEquipesClub(this.president.club_id as number))
      )
      .subscribe(datas => this.equipes = datas);
  }


  submit() {
    if (this.form.valid) {

      let equipe = this.form.value as Equipe;
      equipe.club_id = this.president.club_id as number;

      if (this.editForm) {
        this.es.updateEquipe(this.equipe.id, equipe)
          .pipe(
            mergeMap(() => this.es.getEquipesClub(this.president.club_id as number))
          )
          .subscribe(datas => {
            this.equipes = datas;
            console.log(datas);
            this.activForm = false;
            this.editForm=false;
            this.form.reset();

          })
      }
      else {


        this.es.addEquipe(equipe)
          .pipe(
            mergeMap(() => this.es.getEquipesClub(this.president.club_id as number))
          )
          .subscribe(datas => {
            console.log(datas);
            this.equipes = datas;
            this.activForm = false;
            this.form.reset();
          });
      }
    }
  }
}
