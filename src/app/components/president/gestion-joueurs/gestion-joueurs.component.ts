import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import md5 from 'md5-ts';
import { merge } from 'rxjs';
import { finalize, map, mergeMap } from 'rxjs/operators';
import { Equipe } from 'src/app/models/equipe.model';
import { Coach, Joueur, User } from 'src/app/models/iuser.model';
import { EquipeService } from 'src/app/services/equipe.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-gestion-joueurs',
  templateUrl: './gestion-joueurs.component.html',
  styleUrls: ['./gestion-joueurs.component.scss']
})
export class GestionJoueursComponent implements OnInit {

  activForm = false;
  registerForm = new FormGroup({});
  joueurs: Joueur[] = [];
  club_id: number = -1;
  id: number = -1;
  activEditForm = false;
  editForm = new FormGroup({});
  joueur!: Joueur;
  postes: string[] = [];
  equipes: Equipe[] = [];
  equipesClub: Equipe[] = [];
  equipesMap = new Map<Number, Equipe>();
  user !: User;
  affichPlayer = true;

  constructor(private us: UserService, private es: EquipeService,
    private fb: FormBuilder,
    private editfb: FormBuilder,
    private router: Router) {
    this.registerForm = this.fb.group({
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      equipe: new FormControl('', [Validators.required]),
      poste: new FormControl('', [Validators.required]),
      isBlesse: new FormControl(false, [Validators.required]),
    })
    this.editForm = this.editfb.group({
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      equipe: new FormControl('', [Validators.required]),
      poste: new FormControl('', [Validators.required]),
      isBlesse: new FormControl(false, [Validators.required]),
    })
  }

  ngOnInit(): void {
    this.postes = this.us.initpostes();
    this.user = JSON.parse(sessionStorage.getItem('token') as string);

    this.us.getJoueursFromClub(this.user.club_id as number).subscribe(datas => {
      this.joueurs = datas
    });
    this.club_id = (JSON.parse(sessionStorage.getItem('token') as string)).club_id;

    this.es.getEquipesClub(this.club_id)
      .subscribe(e => {
        this.equipesClub = e
        this.initMapEquipes(this.equipesClub);
      });

  }

  initMapEquipes(equipes: Equipe[]) {
    equipes.forEach(e => {
      this.equipesMap.set(e.id, e);
    })
  }

  supprimer(id: number) {
    // this.affichPlayer=false;
    this.us.deleteJoueur(id as number)
      .pipe(
        mergeMap(() => this.us.getJoueursFromClub(this.user.club_id as number))
      )
      .subscribe(datas => this.joueurs = datas);
  }


  editer(id: number) {

    // this.affichPlayer=false;

    // this.activEditForm = true;
    this.id = id as number;

    this.us.getJoueurById(id as number).subscribe(joueur => {
      this.editForm.patchValue({
        "nom": joueur.nom,
        "prenom": joueur.prenom,
        "date": joueur.naissance as Date,
        "equipe": joueur.equipe_id,
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

      joueur.equipe_id = +(this.registerForm.value.equipe as number);
      joueur.role = 'joueur'
      joueur.club_id = this.club_id;
      joueur.poste = this.registerForm.get('poste')?.value as string;
      joueur.isBlesse = this.registerForm.value.isBlesse;


      this.us.addJoueur(joueur)
        .pipe(
          mergeMap(() => this.es.getEquipesClub(this.user.club_id as number)),
          map(equip => this.initMapEquipes(equip)),
          mergeMap(() => this.us.getJoueursFromClub(this.user.club_id as number)),
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
      joueur.equipe_id = +(this.editForm.value.equipe);

      this.us.updateJoueur(this.id, joueur)
        .pipe(
          mergeMap(() => this.es.getEquipesClub(this.user.club_id as number)),
          map(equip => this.equipes = equip),
          mergeMap(() => this.us.getJoueursFromClub(this.user.club_id as number)),
        )
        .subscribe(datas => {
          this.joueurs = datas;
          this.editForm.reset();
          this.activEditForm = false;
        })
    }
  }

  afficherPlayer(id: number) {
    if(this.affichPlayer){
      
      // this.affichPlayer=true;
      this.router.navigate(["player", id]);
    }
  }

}
