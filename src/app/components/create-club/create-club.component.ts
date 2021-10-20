import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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

  user_id : number = -1;
  matricule = "";
  formClub = new FormGroup({});
  club !: Club;
  president!: President;

  constructor(private fb: FormBuilder,
    private cs: ClubService,
    private activatedRoute: ActivatedRoute,
    private us: UserService) {
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


    // this.activatedRoute
    //   .queryParams
    //   .subscribe(params => {
    //     console.log(params.user_id);
        
    //     // this.user_id=+params['user_id'] || 0
    //     // this.matricule = +params['matricule'] || ''

        
    //     // console.log(params.get('user_id') as string);
    //     // console.log(params.get('matricule') as string);
        

    //   })

    this.us.getPresidentById(this.user_id).subscribe(p => this.president = p);



    console.log(this.user_id);
    console.log(this.matricule);
    console.log(this.president);



    this.formClub.patchValue({
      matricule: this.matricule
    })
  }

  onSubmit() {

    if (this.formClub.valid) {
      this.club = this.formClub.value;
      this.president.club_id = this.club.id;

      this.us.updatePresident(this.user_id, this.president).subscribe();

      this.cs.addClub(this.club).subscribe((data) => {
        console.log(data);
        this.formClub.reset();
      });

    }

  }

}
