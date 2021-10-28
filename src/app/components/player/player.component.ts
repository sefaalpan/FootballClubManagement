import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Club } from 'src/app/models/club.model';
import { Equipe } from 'src/app/models/equipe.model';
import { Joueur, User } from 'src/app/models/iuser.model';
import { ClubService } from 'src/app/services/club.service';
import { EquipeService } from 'src/app/services/equipe.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  joueur !: Joueur;
  club !: Club;
  equipe !: Equipe;
  form = new FormGroup({});
  imageSrc: string = '';
  autorisation = true;

  constructor(private activRoute: ActivatedRoute,
    private us: UserService,
    private cs: ClubService,
    private es: EquipeService,
    private fb: FormBuilder,
    private router : Router) {
    this.form = this.fb.group({
      file: new FormControl('')
    })
  }


  ngOnInit(): void {

    let user = JSON.parse(sessionStorage.getItem('token') as string) as User;
    let id = this.activRoute.snapshot.params.id;


    this.us.getJoueurById(id).subscribe(j => {
      this.joueur = j
      this.cs.getClubById(j.club_id as number)
        .subscribe(c => {
          this.club = c
          if (c.id as number != user.club_id as number) {
            this.autorisation = false;
            this.router.navigate(['/home'])
          }
          this.es.getEquipeById(j.equipe_id as number)
            .subscribe(e => this.equipe = e);
        });
    });

  }
  submit(){}

  get f() {
    return this.form.controls;
  }

  onFileChange(event: any) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {

        this.imageSrc = reader.result as string;

        this.form.patchValue({
          fileSource: reader.result
        });

      };

    }
  }

}
