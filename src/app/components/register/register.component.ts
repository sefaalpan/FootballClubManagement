import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import md5 from 'md5-ts';
import { Club } from 'src/app/models/club.model';
import { Coach, Joueur, President, User } from 'src/app/models/iuser.model';
import { ClubService } from 'src/app/services/club.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm = new FormGroup({});
  postes: string[] = [];
  clubs : Club[] = [];

  constructor(private fb: FormBuilder,
    private router: Router,
    private us: UserService,
    private cs : ClubService
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
      club: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
    this.postes=this.us.initpostes();
    this.cs.getClubs().subscribe(clubs =>{
      this.clubs = clubs;
    })
  }

  submit() {


    if (this.registerForm.valid) {
      console.log("kikou");
      
      let role = this.registerForm.get('role')?.value as string
      let password = this.registerForm.get('password')?.value
      password = md5(password);
      let club = this.registerForm.get('club')?.value as number; 
      
      let user !: User;
      user.nom = this.registerForm.get('nom')?.value as string;
      user.prenom = this.registerForm.get('prenom')?.value as string;
      user.naissance = this.registerForm.get('date')?.value;
      user.email = this.registerForm.get('email')?.value as string;
      user.password = password as string;
      user.role = role
      user.club_id = club;
      
      switch (role) {
        case 'president':
          // let p: President = {};
          // p.nom = this.registerForm.get('nom')?.value;
          // p.prenom = this.registerForm.get('prenom')?.value;
          // p.naissance = this.registerForm.get('date')?.value;
          // p.email = this.registerForm.get('email')?.value as string;
          // p.password = password as string;
          // p.discriminator = role;
          // p.club_id = club;
          // console.log(p);
          
          this.us.addPresident(user).subscribe();
          this.us.login(user.email, user.password);
          break;
        case 'coach':
          let c : Coach = user as Coach;

          // c.nom = this.registerForm.get('nom')?.value;
          // c.prenom = this.registerForm.get('prenom')?.value;
          // c.naissance = this.registerForm.get('date')?.value;
          // c.email = this.registerForm.get('email')?.value as string;
          // c.password = password as string;
          c.statut = this.registerForm.get('coachStatut')?.value;
          // c.discriminator = role;
          this.us.addCoach(c).subscribe();
          this.us.login(c.email as string, c.password as string);
          break;
        case 'joueur':
          let j: Joueur = user as Joueur;

          // j.nom = this.registerForm.get('nom')?.value;
          // j.prenom = this.registerForm.get('prenom')?.value;
          // j.naissance = this.registerForm.get('date')?.value;
          // j.email = this.registerForm.get('email')?.value as string;
          // j.password = password as string;
          j.poste = this.registerForm.get('joueurPoste')?.value;
          j.isBlesse = false;
          // j.discriminator = role;

          this.us.addJoueur(j).subscribe();
          this.us.login(j.email as string, j.password as string);
          break;
        default: console.log("error user role");
          break
      }
      this.registerForm.reset();
      this.router.navigate(['home'])
    }

  }

  // initpostes() {

  //   this.postes.push("1 - Gardien de but");
  //   this.postes.push("2 - Latéral droit");
  //   this.postes.push("3 - Laréral gauche");
  //   this.postes.push("4 - Défenseur central droit");
  //   this.postes.push("5 - Défenseur central gauche");
  //   this.postes.push("6 - Milieu défensif");
  //   this.postes.push("7 - Attaquant gauche");
  //   this.postes.push("8 - Milieu central");
  //   this.postes.push("9 - Attaquant en pointe");
  //   this.postes.push("10 - Milieu offensif");
  //   this.postes.push("11 - Attaquant Droit");


  // }
}
