import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import md5 from 'md5-ts';
import { mergeMap } from 'rxjs/operators';
import { Coach, Joueur, User } from 'src/app/models/iuser.model';
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
  postes : string[] = [];

  constructor(private us: UserService, private fb: FormBuilder, private editfb: FormBuilder) {
    this.registerForm = this.fb.group({
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      // email: new FormControl('', [Validators.required, Validators.email]),
      // password: new FormControl('', [Validators.required]),
      // password2: new FormControl('', [Validators.required]),
      poste: new FormControl('', [Validators.required]),
      isBlesse: new FormControl(false, [Validators.required]),
    })
    this.editForm = this.editfb.group({
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      // email: new FormControl('', [Validators.required, Validators.email]),
      poste: new FormControl('', [Validators.required]),
      isBlesse: new FormControl(false, [Validators.required]),
    })
  }

  ngOnInit(): void {
    this.postes=this.us.initpostes();   
    this.us.getJoueurs().subscribe(datas => this.joueurs = datas);
    this.club_id = (JSON.parse(localStorage.getItem('token') as string)).club_id;
  }

  supprimer(id: number | undefined) {
    this.us.deleteJoueur(id as number)
      .pipe(
        mergeMap(datas => this.us.getJoueurs())
      )
      .subscribe(datas => this.joueurs = datas);
  }
  editer(id: number) {

    // this.activEditForm = true;
    this.id = id as number;

    this.us.getJoueurById(id as number).subscribe(joueur => {
      this.editForm.patchValue({
        "nom": joueur.nom,
        "prenom": joueur.prenom,
        "date": joueur.naissance as Date,
        // "email": joueur.email,
        "poste": joueur.poste,
        "isBlesse": joueur.isBlesse,
      });
      this.joueur = joueur;
    });

    console.log(this.editForm);
    
  }

  submit() {

    if (this.registerForm.valid) {

      let joueur!: Joueur
      joueur.nom = this.registerForm.get('nom')?.value as string;
      joueur.prenom = this.registerForm.get('prenom')?.value as string;
      joueur.naissance = this.registerForm.get('date')?.value;
      // joueur.email = this.registerForm.get('email')?.value as string;
      // joueur.password = md5(this.registerForm.get('password')?.value as string);
      joueur.role = 'joueur'
      joueur.club_id = this.club_id;
      joueur.poste = this.registerForm.get('poste')?.value as string;
      joueur.isBlesse = this.registerForm.value.isBlesse;
      console.log(joueur.isBlesse);
      

      this.us.addJoueur(joueur)
        .pipe(
          mergeMap(datas => this.us.getJoueurs())
        )
        .subscribe((datas) => {
          this.joueurs = datas;
          this.registerForm.reset();
          this.activForm = false;
        }
        )


    }
  }

  submitEdit() {
    if (this.editForm.valid) {

      let joueur: Joueur = this.editForm.value;
      joueur.naissance = this.editForm.get("date")?.value as Date;
      joueur.password = this.joueur.password;
      joueur.club_id = this.joueur.club_id;
      joueur.role = this.joueur.role;

      this.us.updateJoueur(this.id, joueur)
        .pipe(
          mergeMap(datas => this.us.getJoueurs())
        )
        .subscribe(datas => {
          this.joueurs = datas;
          this.editForm.reset();
          this.activEditForm = false;
        })
    }
  }
}
