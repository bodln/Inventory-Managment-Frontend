import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatInputModule,
    RouterLink,
    MatSnackBarModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  authService = inject(AuthService);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);
  fb = inject(FormBuilder);
  hide = true;
  form!: FormGroup;

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [''],
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      dateOfHire: [new Date().toISOString().split('T')[0], Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]]
    }, {
      validators: this.passwordMatchValidator
    });

    this.form.get('firstName')?.valueChanges.subscribe(firstName => {
      this.form.patchValue({ name: firstName }, { emitEvent: false });
    });
  }

  register() {
    this.authService.register(this.form.value).subscribe({
      next: (response) => {
        if (response.message === 'Account Created') {
          this.router.navigate(['/']);
        } else {
          this.matSnackBar.open(response.message, 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
          });
        }
      },
      error: () => {
        this.matSnackBar.open("Something went wrong!", 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
        });
      },
    });
  }
}
