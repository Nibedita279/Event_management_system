import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  otp: string = '';
  isOtpSent: boolean = false;
 

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.authService.register(this.username, this.email, this.password).subscribe(response => {
      this.router.navigate(['/login']);
    });
  }

  sendOtp() {
    this.authService.sendOtp(this.email).subscribe(response => {
      console.log('OTP sent:', response);
      this.isOtpSent = true;  // Show the OTP input field
    }, error => {
      console.error('Error sending OTP:', error);
    });
  }

  // Verify the OTP
  verifyOtp() {
    this.authService.verifyOtp(this.otp).subscribe(response => {
      console.log('OTP verified:', response);
      this.sendOtp();
    }, error => {
      console.error('Error verifying OTP:', error);
    });
  }
}
