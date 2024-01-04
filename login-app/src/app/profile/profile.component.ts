import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;
  error: string = '';
  constructor(private http: HttpClient,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.get<any>(`/api/login/${this.getEmail()}`, { headers }).subscribe(
      response => {
        this.user = response;
      },
      error => {
        this.error=error.message;
      }
    );
  }

  getEmail(): string {
    const token = localStorage.getItem('token');
    const payload = JSON.parse(atob(token!.split('.')[1]));
    return payload.email;
  }

  logout(): void{
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
}
}