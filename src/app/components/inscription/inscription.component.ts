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

  ngOnInit(): void {
    this.us.getPresidentByEmail('t@t')
      .pipe(
        finalize(() => console.log(this.president))
      )
      .subscribe(p => this.president = p[0]);


  }

  submit() {

    if (this.registerForm.valid) {
      //check si le matricule existe
      let nom = this.registerForm.value.nom as string;
      let prenom = this.registerForm.value.prenom as string;
      let naissance = this.registerForm.value.date as Date;
      let email = this.registerForm.value.email as string;
      let password = this.registerForm.value.password as string;
      password = md5(password);
      // console.log(password);

      let role = this.registerForm.value.role as string;

      let matricule = this.registerForm.value.club as string;
      let club !: Club;
      console.log("kikou");
      
      this.cs.getClubByMatricule(matricule).subscribe((c) => {
        console.log(c);
        
        club = c[0] as Club;
        console.log(c);
        console.log(club);
        // console.log(club.id as number);
        console.log(club);
        
        if (club) {
          console.log('le club existe deja');
          this.errors="Ce matricule existe déjà";

          let president: President = {};
          //le club a-t'il déjà un president
          this.us.getClubPresident(club.id).subscribe(p => {

            president = p[0] as President;
            console.log(p);
            console.log(president);
            
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
                console.log(p);
                
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
                    console.log(president);

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
            console.log(president);

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

              console.log(president);

              this.us.addPresident(president)
                .pipe(
                  // mergeMap(p => this.us.getPresidentByEmail(president.email as string)),
                  finalize(() => {
                    console.log(president)
                    this.router.navigate(['create-club/', president.id + '/', matricule]);
                  })
                )
                .subscribe((p) => president = p);



              // this.us.getPresidentByEmail(president.email as string)
              //   .subscribe(p => this.president = p);

              // console.log(this.president);
              // console.log(president.id);



            }



          });
          //check si le president a deja un club
          //creation president 
          //redirect 
        }

      });


    }





    // if (!this.registerForm.valid) {

    //   let isPresident = false;

    //   let role = this.registerForm.get('role')?.value as string
    //   let password = this.registerForm.get('password')?.value
    //   password = md5(password);

    //   let user: President = {};
    //   let presidentExist !: President;
    //   console.log(this.registerForm.value.nom as string);

    //   user.nom = this.registerForm.value.nom as string;
    //   console.log(user.nom)

    //   // user.nom = this.registerForm.get('nom')?.value as string;
    //   user.prenom = this.registerForm.get('prenom')?.value as string;
    //   user.naissance = this.registerForm.get('date')?.value;
    //   user.email = this.registerForm.get('email')?.value as string;
    //   user.password = password as string;
    //   user.discriminator = role



    //   let matricule = this.registerForm.get('club')?.value as string;
    //   let club !: Club;
    //   this.cs.getClubByMatricule(matricule).subscribe(data => club = data);
    //   this.us.getPresidentByEmail(user.email).subscribe(p=>presidentExist=p);
    //   if

    //   //le club existe
    //   if (club) {
    //     console.log(club);
    //     console.log("le matricule existe deja");

    //     // user.club_id = club.id
    //     let presidentClub !: President;

    //     this.us.getClubPresident(club.id).subscribe(president => presidentClub = president);

    //     //le club a déjà un président
    //     if (presidentClub) {
    //       console.log("le club a déjà un président" + presidentClub);
    //       isPresident = true;
    //     }
    //     else {
    //       console.log("le club existe mais n'a pas de president");

    //       // user.club_id = club;

    //       this.us.addPresident(user).subscribe();
    //       // this.us.login(user.email, user.password);

    //       this.registerForm.reset();
    //       this.router.navigate(['login'])
    //     }


    //   }
    //   //le club existe pas
    //   else {

    //     if (!isPresident) {
    //       console.log("le club existe pas, le presi non plus ");

    //       this.us.addPresident(user).subscribe();
    //       this.us.getPresidentByEmail(user.email).subscribe(data => user = data);
    //       // this.us.getPresidentById(2).subscribe(p=>user=p);
    //       // this.us.login(user.email, user.password);
    //       console.log(user);

    //       this.registerForm.reset();
    //       this.router.navigate(['create-club/', 2 + '/', matricule])
    //       console.log(user.id);
    //       console.log(matricule);

    //       // this.router.navigate(['create-club', {
    //       //   queryParams: {
    //       //     'user_id': user.id,
    //       //     'matricule': matricule
    //       //   }
    //       // }])
    //     }
    //     else
    //       console.log("le club existe pas mais le president si");
    //   }


    // }


    /*
      Inscription du président
      Celui-ci tape le matricule du club
      puis ses informations
      ----
      -->SI le matricule existe déjà mais n'a pas de président
          l'user devient le président de ce club 
      -->SI le président existe déjà ERROR!
      -->SI le club a déjà un président ERROR!
      -->Si le club existe pas et le président non plus on enregistre le club 
          puis on le dirige vers une vue pour créer le club avec le matricule et 
          on associe le club au président
    */


  }
}

