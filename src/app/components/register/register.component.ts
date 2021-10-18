import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import md5 from 'md5-ts';
// import { Coach, Joueur, President, User } from 'src/app/models/users.model';
import { Coach, Joueur, President, User } from 'src/app/models/iuser.model';
import { UserService } from 'src/app/services/user.service';
import { UsersService } from 'src/app/services/users.service';
import { mergeMap } from 'rxjs/operators'


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm = new FormGroup({});
  postes: string[] = [];

  constructor(private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router,
    private us: UserService
  ) {
    this.registerForm = this.fb.group({
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      password2: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      joueurPoste: new FormControl('', []),
      coachStatut: new FormControl('', []),
    })
  }

  ngOnInit(): void {
    this.initpostes()
  }

  submit() {


    if (this.registerForm.valid) {
      let role = this.registerForm.get('role')?.value
      let password = this.registerForm.get('password')?.value
      password = md5(password);
      // this.registerForm.get('password')?.setValue(password);

      switch (role) {
        case 'president':
          let p: President = {};
          p.nom = this.registerForm.get('nom')?.value;
          p.prenom = this.registerForm.get('prenom')?.value;
          p.naissance = this.registerForm.get('date')?.value;
          p.email = this.registerForm.get('email')?.value;
          p.password = password;

          this.us.addPresident(p);
          this.us.login(p);
          break;
        case 'coach':
          let c: Coach = {};
          c.nom = this.registerForm.get('nom')?.value;
          c.prenom = this.registerForm.get('prenom')?.value;
          c.naissance = this.registerForm.get('date')?.value;
          c.email = this.registerForm.get('email')?.value;
          c.password = password;
          c.statut = this.registerForm.get('coachStatut')?.value;

          this.us.addCoach(c);
          this.us.login(c);
          break;
        case 'joueur':
          let j: Joueur = {};

          j.nom = this.registerForm.get('nom')?.value;
          j.prenom = this.registerForm.get('prenom')?.value;
          j.naissance = this.registerForm.get('date')?.value;
          j.email = this.registerForm.get('email')?.value;
          j.password = password;
          j.poste = this.registerForm.get('joueurPoste')?.value;
          j.isBlesse = false;

          this.us.addJoueur(j);
          this.us.login(j);
          break;
        default: console.log("error user role");
          break
      }
      this.registerForm.reset();
      this.router.navigate(['home'])
      
    }


    //test pour git
    //ijeiijeieji,psx,,ep
    //,cinonceo

    // let user: User;
    // let nom = this.registerForm.get('nom')?.value
    // let prenom = this.registerForm.get('prenom')?.value
    // let password = this.registerForm.get('password')?.value
    // password = md5(password);
    // let date = this.registerForm.get('date')?.value
    // let email = this.registerForm.get('email')?.value
    // let role = this.registerForm.get('role')?.value
    // let isCreated = false;

    // switch (role) {
    //   case 'president':
    //     isCreated = this.usersService.createPresident(nom, prenom, date, email, password);
    //     console.log(isCreated);
    //     break;
    //   case 'coach':
    //     let statut = this.registerForm.get('coachStatut')?.value
    //     isCreated = this.usersService.createCoach(nom, prenom, date, email, password, statut);
    //     console.log(isCreated);
    //     break;
    //   case 'joueur':
    //     let poste = this.registerForm.get('joueurPoste')?.value
    //     console.log(poste);
    //     isCreated = this.usersService.createJoueur(nom, prenom, date, email, password, poste, false);
    //     console.log(isCreated);
    //     break;

    //   default:
    //     break;
    // }

    // if (!isCreated)
    //   this.router.navigate(['home']);

  }

  initpostes() {

    this.postes.push("1 - Gardien de but");
    this.postes.push("2 - Latéral droit");
    this.postes.push("3 - Laréral gauche");
    this.postes.push("4 - Défenseur central droit");
    this.postes.push("5 - Défenseur central gauche");
    this.postes.push("6 - Milieu défensif");
    this.postes.push("7 - Attaquant gauche");
    this.postes.push("8 - Milieu central");
    this.postes.push("9 - Attaquant en pointe");
    this.postes.push("10 - Milieu offensif");
    this.postes.push("11 - Attaquant Droit");


  }
}
