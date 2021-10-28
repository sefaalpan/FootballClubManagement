import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, mergeMap } from 'rxjs/operators';
import { Equipe } from 'src/app/models/equipe.model';
import { Coach, Joueur } from 'src/app/models/iuser.model';
import { EquipeService } from 'src/app/services/equipe.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-manage-players',
  templateUrl: './manage-players.component.html',
  styleUrls: ['./manage-players.component.scss']
})
export class ManagePlayersComponent implements OnInit {
  activForm = false;
  activEditForm = false;
  postes: string[] = [];
  joueurs: Joueur[] = [];
  registerForm = new FormGroup({});
  editForm = new FormGroup({});
  equipe !: Equipe;
  id: number = -1
  joueur !: Joueur;
  coach !: Coach;
  affichPlayer = true;

  constructor(private fb: FormBuilder, private editfb: FormBuilder, private router: Router,
    private us: UserService,
    private es: EquipeService) {
    this.registerForm = this.fb.group({
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      poste: new FormControl('', [Validators.required]),
      isBlesse: new FormControl(false, [Validators.required]),
    })
    this.editForm = this.editfb.group({
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      poste: new FormControl('', [Validators.required]),
      isBlesse: new FormControl(false, [Validators.required]),
    })
  }

  ngOnInit(): void {
    this.postes = this.us.initpostes();
    this.coach = JSON.parse(sessionStorage.getItem('token') as string)

    this.es.getEquipeById(this.coach.equipe_id as number).subscribe(e => this.equipe = e);
    this.us.getJoueursFromEquipe(this.coach.equipe_id as number)
      .subscribe(j => {
        this.joueurs = j
      })

  }

  supprimer(id: number) {
    this.us.deleteJoueur(id as number)
      .pipe(
        mergeMap(() => this.us.getJoueursFromEquipe(this.coach.equipe_id as number))
      )
      .subscribe(datas => this.joueurs = datas);
  }
  editer(id: number) {
    this.id = id as number;

    this.us.getJoueurById(id as number).subscribe(joueur => {
      this.editForm.patchValue({
        "nom": joueur.nom,
        "prenom": joueur.prenom,
        "date": joueur.naissance as Date,
        "poste": joueur.poste,
        "isBlesse": joueur.isBlesse,
      });
      this.joueur = joueur;
    });

  }
  submit() {

    if (this.registerForm.valid) {

      let joueur: Joueur = {}

      joueur.nom = this.registerForm.value.nom as string;
      joueur.prenom = this.registerForm.value.prenom as string;
      joueur.naissance = this.registerForm.value.date;

      joueur.equipe_id = +(this.coach.equipe_id as number);
      joueur.role = 'joueur'
      joueur.club_id = this.coach.club_id;
      joueur.poste = this.registerForm.get('poste')?.value as string;
      joueur.isBlesse = this.registerForm.value.isBlesse;

      this.us.addJoueur(joueur)
        .pipe(
          mergeMap(() => this.us.getJoueursFromEquipe(this.coach.equipe_id as number)),
        )
        .subscribe((datas) => {
          this.joueurs = datas;
          this.registerForm.reset();
          this.activForm = false;
        })
    }
  }

  submitEdit() {
    if (this.editForm.valid) {

      let joueur: Joueur = this.editForm.value;
      joueur.naissance = this.editForm.get("date")?.value as Date;
      joueur.password = this.joueur.password;
      joueur.club_id = this.joueur.club_id;
      joueur.role = this.joueur.role;
      joueur.equipe_id = +(this.coach.equipe_id as number)

      this.us.updateJoueur(this.id, joueur)
        .pipe(
          mergeMap(() => this.us.getJoueursFromEquipe(this.coach.equipe_id as number)),

        )
        .subscribe(datas => {
          this.joueurs = datas;
          this.editForm.reset();
          this.activEditForm = false;
        })
    }
  }
  selection() {

  }

  afficherPlayer(id: number) {
    if (this.affichPlayer) {
      this.router.navigate(["player", id]);
    }
  }

}
