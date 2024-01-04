import { Component, OnInit } from '@angular/core';
import { SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  users!: SocialUser;

  ngOnInit(): void {
    this.load();
  }

    
  load(): void {
    const storedUser = localStorage.getItem('users');
    if (storedUser) {
      this.users = JSON.parse(storedUser);
    }
  }

}
