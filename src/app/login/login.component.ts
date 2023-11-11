import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  hidePassword: boolean = true;
  loginForm: FormGroup;
  loginError: string = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      rememberMe: new FormControl(false),
    });
  }

  onSubmit() {
    console.log(this.loginForm);
    this.authService
      .login(this.loginForm.value.username, this.loginForm.value.password)
      .subscribe({ error: this.onLoginError.bind(this) });
  }

  private onLoginError(error) {
    this.loginError = error?.error?.message;
  }
}
