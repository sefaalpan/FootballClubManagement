import { Component, OnInit } from '@angular/core';
import { Coach, User } from 'src/app/models/iuser.model';
import { UserService } from 'src/app/services/user.service';
import { mergeMap } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import md5 from 'md5-ts';

@Component({
  selector: 'app-gestion-coachs',
  templateUrl: './gestion-coachs.component.html',
  styleUrls: ['./gestion-coachs.component.scss']
})
export class GestionCoachsComponent implements OnInit {

  activForm = false;
  registerForm = new FormGroup({});
  coachs: Coach[] = [];
  club_id: number = -1;
  id: number = -1;
  activEditForm = false;
  editForm = new FormGroup({});
  coach!: Coach
  date = new Date();
  constructor(private us: UserService, private fb: FormBuilder, private editfb: FormBuilder) {
    this.registerForm = this.fb.group({
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl('', [Validators.required]),
      date: new FormControl(this.date, [Validators.required]),
      // date: new FormControl((new Date()).toISOString().substring(0,10)),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      password2: new FormControl('', [Validators.required]),
      statut: new FormControl('', [Validators.required]),
    })
    this.editForm = this.editfb.group({
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      statut: new FormControl('', [Validators.required]),
    })
  }

  ngOnInit(): void {      
    this.us.getCoachs().subscribe(datas => this.coachs = datas);
    this.club_id = (JSON.parse(localStorage.getItem('token') as string)).club_id;
  }

  supprimer(id: number | undefined) {
    this.us.deleteCoach(id as number)
      .pipe(
        mergeMap(datas => this.us.getCoachs())
      )
      .subscribe(datas => this.coachs = datas);
  }
  editer(id: number) {

    // this.activEditForm = true;
    this.id = id as number;

    this.us.getCoachById(id as number).subscribe(coach => {
      this.editForm.patchValue({
        "nom": coach.nom,
        "prenom": coach.prenom,
        "date": coach.naissance as Date,
        "email": coach.email,
        "statut": coach.statut,
      });
      this.coach = coach;
    });
  }

  submit() {

    if (this.registerForm.valid) {

      let coach : Coach = {};
      coach.nom = this.registerForm.get('nom')?.value as string;
      coach.prenom = this.registerForm.get('prenom')?.value as string;
      coach.naissance = this.registerForm.get('date')?.value;
      coach.email = this.registerForm.get('email')?.value as string;
      coach.password = md5(this.registerForm.get('password')?.value as string);
      coach.role = 'coach'
      coach.club_id = this.club_id;
      coach.statut = this.registerForm.get('statut')?.value as string;


      this.us.addCoach(coach)
        .pipe(
          mergeMap(datas => this.us.getCoachs())
        )
        .subscribe((datas) => {
          this.coachs = datas;
          this.registerForm.reset();
          this.activForm = false;
        }
        )


    }
  }

  submitEdit() {
    if (this.editForm.valid) {

      let coach: Coach = this.editForm.value;
      coach.naissance = this.editForm.get("date")?.value as Date;
      coach.password = this.coach.password;
      coach.club_id = this.coach.club_id;
      coach.role = this.coach.role;

      this.us.updateCoach(this.id, coach)
        .pipe(
          mergeMap(datas => this.us.getCoachs())
        )
        .subscribe(datas => {
          this.coachs = datas;
          this.editForm.reset();
          this.activEditForm = false;
        })
    }
  }
}
