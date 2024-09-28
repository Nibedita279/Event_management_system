import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage:string = '' ;
  google:Boolean=false;
  fb:Boolean=false

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe(
      response => {
        console.log('Login successful');
        this.router.navigate(['/dashboard']);
      },
      error => {
        console.error('Login error', error);
        this.errorMessage = 'Invalid username or password';
      }
    );
  }


  loginWithGoogle() {
   alert("Google Authentication coming soon");
  }

  loginWithFacebook() {
    alert("Facebook Authentication coming soon");
  }
}