import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'username': new FormControl(''),
      'password': new FormControl('')
    });
  }

  onSubmit() {
    console.log(this.loginForm);
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password);
  }
}
