import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  fname: string = '';
  lname: string = '';
  dob: string = '';
  gender: string = '';
  error: string = '';

  constructor(private http: HttpClient,
    private router: Router) {}

  onSubmit() {
    const user = {
      email: this.email,
      password: this.password,
      fname: this.fname,
      lname: this.lname,
      dob: this.dob,
      gender: this.gender
    };

    this.http.post('/api/login/signup', user).subscribe(
      response => {
        console.log('User registered successfully', response);
        window.confirm("User registered Successfully\nLogin to view the user details");
        this.router.navigate(['/login']);
        // Handle successful registration, e.g., navigate to another page
      },
      error => {
        if(error.status === 400){
          window.alert("Enter all the details for successful registration");
        }
        else if (error.status === 409) {
          window.alert("User already exists");
          console.log('User already exists');
          // Handle conflict (user already exists) here
        } 
        else if(error.status === 500){
          window.alert("Error registering user");
          console.error('Error registering user', error);
          // Handle other errors here
        }  
        else{
          this.error= error.messsage;    
        }
      }
    );
  }
  back():void{
    this.router.navigate(['/login']);
  }
}
