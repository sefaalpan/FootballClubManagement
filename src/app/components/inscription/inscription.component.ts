import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import md5 from 'md5-ts';
import { finalize } from 'rxjs/operators';
import { Club } from 'src/app/models/club.model';
import { President } from 'src/app/models/iuser.model';
import { ClubService } from 'src/app/services/club.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent implements OnInit {


  registerForm = new FormGroup({});
  president !: President;
  errors = '';

  constructor(private fb: FormBuilder,
    private router: Router,
    private us: UserService,
    private cs: ClubService
  ) {
    this.registerForm = this.fb.group({
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      password2: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      club: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {}

  submit() {

    if (this.registerForm.valid) {
      //check si le matricule existe
      let nom = this.registerForm.value.nom as string;
      let prenom = this.registerForm.value.prenom as string;
      let naissance = this.registerForm.value.date as Date;
      let email = this.registerForm.value.email as string;
      let password = this.registerForm.value.password as string;
      password = md5(password);

      let role = this.registerForm.value.role as string;

      let matricule = this.registerForm.value.club as string;
      let club !: Club;
      
      this.cs.getClubByMatricule(matricule).subscribe((c) => {
        
        club = c[0] as Club;
        
        if (club) {
          console.log('le club existe deja');
          this.errors="Ce matricule existe déjà";

          let president: President = {};
          //le club a-t'il déjà un president
          this.us.getClubPresident(club.id).subscribe(p => {

            president = p[0] as President;
            
            if (president) {
              console.log(club + " a deja un prsident " + president);
              if(president.email === email){
                this.errors = "Veuillez vous connecter";
                this.router.navigate(['login', president.email])
              }
            }
            else {
              //check si le president existe dèjà
              president = {} as President;
              this.us.getPresidentByEmail(email).subscribe(p => {
                
                president = p[0];
                if (president) {
                  if (president.club_id && president.email) {
                    console.log(president + " a deja un club " + president.club_id);
                  }
                  else {
                    president.club_id = club.id;
                    this.us.updatePresident(president.id as number, president)
                      .subscribe(() => {
                        console.log(president + " a été mis a jour");
                        this.router.navigate(['login'])
                      });
                  }
                }
                else {
                  //si le club existe mais n'a pas de president
                  president = {} as President;
                  president.nom = nom;
                  president.prenom = prenom;
                  president.naissance = naissance;
                  president.email = email;
                  president.password = password;
                  president.role = role;
                  president.club_id = club.id;
  
                  this.us.addPresident(president).subscribe(() => {
                    //On pourrait rediriger vers login en completant l'input
                    // this.router.navigate(['login', email]);
                    console.log(club + " a maintenant un président " + president);

                    this.router.navigate(['login', president.email]);
                  })
                }
              });
            }


          });



        }
        else {
          console.log("le club n'existe pas");

          //check si le president existe dèjà
          let president!: President;
          this.us.getPresidentByEmail(email).subscribe(p => {
            president = p[0]

            if (president) {
              console.log("no club president existe");

              if (president.club_id) {
                console.log(president + " a deja un club " + president.club_id);
                this.router.navigate(['login', president.email]);
              }
              else {
                //le president existe mais n'a pas de club on redirige vers createclub
                console.log("le president existe mais n'a pas de club on redirige vers createclub");
                this.router.navigate(['create-club/', president.id + '/', matricule]);
              }
            }
            else {

              president = {} as President;
              president.nom = nom;
              president.prenom = prenom;
              president.naissance = naissance;
              president.email = email;
              president.password = password;
              president.role = role;


              this.us.addPresident(president)
                .pipe(
                  // mergeMap(p => this.us.getPresidentByEmail(president.email as string)),
                  finalize(() => {
                    this.router.navigate(['create-club/', president.id + '/', matricule]);
                  })
                )
                .subscribe((p) => president = p);


            }



          });
      
        }

      });


    }

  }
}

