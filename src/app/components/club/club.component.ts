import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Club } from 'src/app/models/club.model';
import { ClubService } from 'src/app/services/club.service';

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.scss']
})
export class ClubComponent implements OnInit {

  club !: Club;
  formClub: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, private cs: ClubService) {
    this.formClub = this.fb.group({
      matricule: new FormControl('', Validators.required),
      nom: new FormControl('', Validators.required),
      rue: new FormControl('', Validators.required),
      numero: new FormControl('', Validators.required),
      ville: new FormControl('', Validators.required),
      codepostal: new FormControl('', Validators.required),
    })
  }

  ngOnInit(): void { }

  onSubmit() {

    if (this.formClub.valid) {
      this.club = this.formClub.value;
      this.cs.addClub(this.club).subscribe((data) => {
        console.log(data);
        this.formClub.reset();
      });

    }

  }
}
