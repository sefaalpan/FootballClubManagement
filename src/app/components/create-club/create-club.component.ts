import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { Club } from 'src/app/models/club.model';
import { President } from 'src/app/models/iuser.model';
import { ClubService } from 'src/app/services/club.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-club',
  templateUrl: './create-club.component.html',
  styleUrls: ['./create-club.component.scss']
})
export class CreateClubComponent implements OnInit {

  user_id: number = -1;
  matricule = "";
  formClub = new FormGroup({});
  club !: Club;
  president!: President;

  constructor(private fb: FormBuilder,
    private cs: ClubService,
    private activatedRoute: ActivatedRoute,
    private us: UserService,
    private router: Router
  ) {
    this.formClub = this.fb.group({
      matricule: new FormControl('', Validators.required),
      nom: new FormControl('', Validators.required),
      rue: new FormControl('', Validators.required),
      numero: new FormControl('', Validators.required),
      ville: new FormControl('', Validators.required),
      codepostal: new FormControl('', Validators.required),
    })

  }

  ngOnInit(): void {

    let idd = this.activatedRoute.snapshot.params['user_id'] as string;
    this.user_id = parseInt(idd.split('/')[0])

    this.matricule = this.activatedRoute.snapshot.params['matricule'];

    this.us.getPresidentById(this.user_id)
      .subscribe(p => {
        this.president = p
      });

    this.formClub.patchValue({
      matricule: this.matricule
    })

  }

  onSubmit() {

    if (this.formClub.valid) {
      this.club = this.formClub.value;

      this.cs.addClub(this.club)
        .subscribe((data) => {
          this.club = data;
          this.president.club_id = this.club.id;
          this.us.updatePresident(this.user_id, this.president)
            .subscribe();
          this.formClub.reset();
          this.router.navigate(['login', this.president.email]);
        });

    }

  }

}
