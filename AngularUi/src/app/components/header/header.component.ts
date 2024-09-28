import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  username:string='';
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
   const userName = localStorage.getItem('user');
   if(userName!=null){
    this.username=userName;
   }
   else{
    this.username="Guest";
   }
   
  }
  logout() {
    this.authService.logout();
  }
}
