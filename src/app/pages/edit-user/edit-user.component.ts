import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserData } from '../../interfaces/user-data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    RouterLink,
    MatSnackBarModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent {
  authService = inject(AuthService);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);
  route = inject(ActivatedRoute);
  http = inject(HttpClient);
  fb = inject(FormBuilder);
  hide = true;
  form!: FormGroup;
  user: UserData | null = null;
  availableRoles = ['Admin', 'Warehouseman', 'Manager'];
  initialRoles: string[] = [];

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    this.user = navigation?.extras?.state?.['user'];

    if (!this.user) {
      console.error('No user data passed to edit component.');
    }
  }

  ngOnInit(): void {
    const userRoles = this.user?.roles || [];
    this.initialRoles = [...userRoles];

    this.form = this.fb.group({
      email: [this.user?.email || '', Validators.required],
      firstName: [this.user?.firstName || '', Validators.required],
      lastName: [this.user?.lastName || '', Validators.required],
      address: [this.user?.address || '', Validators.required],
      salary: [this.user?.salary || 0, Validators.required],
      admin: [this.user?.roles?.includes('Admin') || false],
      warehouseman: [this.user?.roles?.includes('Warehouseman') || false],
      manager: [this.user?.roles?.includes('Manager') || false],
    });

    this.form.patchValue(this.user!);
  }

  updateItem() {
    if (this.form.valid) {
      const updatedUser: UserData = {
        email: this.form.value.email,
        firstName: this.form.value.firstName,
        lastName: this.form.value.lastName,
        address: this.form.value.address,
        salary: this.form.value.salary,
        roles: this.getUpdatedRoles(),
        dateOfBirth: this.user?.dateOfBirth || new Date(),
        dateOfHire: this.user?.dateOfHire || new Date(),
      };

      console.log("Initial user:", JSON.stringify(this.user, null, 2));
      console.log("Updated user:", JSON.stringify(updatedUser, null, 2));

      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      });

      this.http.put(`${environment.apiUrl}/User`, updatedUser, { headers })
        .subscribe({
          next: () => {
            this.matSnackBar.open('User updated successfully', 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
            });
            this.router.navigate(['/users']);
          },
          error: () => this.matSnackBar.open('Failed to update user', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
          })
        });
    }
  }

  getUpdatedRoles(): string[] {
    const roles = [];
    if (this.form.value.admin) roles.push('Admin');
    if (this.form.value.warehouseman) roles.push('Warehouseman');
    if (this.form.value.manager) roles.push('Manager');
    
    return roles;
  }
}
