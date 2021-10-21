import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { Equipe } from 'src/app/models/equipe.model';
import { President } from 'src/app/models/iuser.model';
import { EquipeService } from 'src/app/services/equipe.service';

@Component({
  selector: 'app-gestion-equipes',
  templateUrl: './gestion-equipes.component.html',
  styleUrls: ['./gestion-equipes.component.scss']
})
export class GestionEquipesComponent implements OnInit {

  equipes: Equipe[] = [];
  president !: President;
  activForm = false;
  activEditForm = false;
  form = new FormGroup({});

  constructor(private es: EquipeService, private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      categorie: new FormControl("", Validators.required)
    })
  }

  ngOnInit(): void {
    this.president = JSON.parse(localStorage.getItem('token') as string)
    console.log(this.president);

    this.es.getEquipesClub(this.president.club_id as number)
      .subscribe(e => this.equipes = e);
  }

  editer(id: number) {

  }
  supprimer(id: number) {
    this.es.deleteEquipe(id as number)
      .pipe(
        mergeMap(datas => this.es.getEquipesClub(this.president.club_id as number))
      )
      .subscribe(datas => this.equipes = datas);
  }


  submit() {
    if(this.form.valid){
      let equipe = this.form.value as Equipe;
      equipe.club_id = this.president.club_id as number;
      this.es.addEquipe(equipe)
      .pipe(
        mergeMap(()=>this.es.getEquipesClub(this.president.club_id as number))
      )  
      .subscribe(datas=>{
          console.log(datas);
          this.equipes=datas;
          this.activForm=false;
        });
    }
  }
}
