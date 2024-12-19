import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatInputModule,
    RouterLink,
    MatSnackBarModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);
  hide = true;
  form!: FormGroup;
  fb = inject(FormBuilder);

  login() {
    this.authService.login(this.form.value).subscribe({
      next: (response) => {
        if(response.code == 200){
          this.matSnackBar.open("Log in finished, some token received.", 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
          });
          this.router.navigate(['/']);
        }else if(response.code == 401){
          this.matSnackBar.open("Wrong information prvoided.", 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
          });
        }

        console.log("Log in status code: " + response.code);
      },
      error: (error) => {
        this.matSnackBar.open("Something went wrong!", 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
        });
        console.log("Log in error: " + error.message)
      },
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
}