import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import md5 from 'md5-ts';
import { User } from 'src/app/models/iuser.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user !: User;
  loginForm: FormGroup = new FormGroup({});
  email : string= ''
  error = '';
  constructor(private fb: FormBuilder, 
    private us: UserService,
    private router: Router,
    private activatedRoute : ActivatedRoute
    ) 
    {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
    
    this.email=this.activatedRoute.snapshot.params['email'];
    this.loginForm.patchValue({
      email:this.email
    })
  }
  submit() {

    let email = this.loginForm.get("email")?.value;
    let password = this.loginForm.value.password;
    password = md5(password);
    
    this.user = this.us.login(email, password);

    if (this.user) {
      this.loginForm.reset();
      this.router.navigate(['home']);
    }
    else {
      this.error="Email ou password incorrect"
    }
  }
}
