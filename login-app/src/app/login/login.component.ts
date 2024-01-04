import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  error: string = '';
  users!: SocialUser;
  loggedIn: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: SocialAuthService
  ) {}

  ngOnInit() {  
    this.authService.authState.subscribe((users) => {
      this.users = users;
      this.loggedIn = users != null;
      console.log(this.users);
      localStorage.setItem('users', JSON.stringify(this.users)); // Save user information to localStorage
      this.router.navigate(['/signin']);
    }); 
  }

  authenticate(): void {
    const credentials = {
      email: this.email,
      password: this.password
    };
    this.http.post<any>('/api/login/authenticate', credentials).subscribe(
      (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/profile']);
      },
      (error) => {
        console.error = error.message;
        window.alert('Enter a valid username or password');
        window.location.reload();
      }
    );
  }

  newuser(): void{
    this.router.navigate(['/signup']);
  }

}
