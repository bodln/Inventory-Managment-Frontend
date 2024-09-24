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

@Component({
  selector: 'app-add-item',
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
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.css'
})
export class AddItemComponent {
  authService = inject(AuthService);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);
  route = inject(ActivatedRoute)
  http = inject(HttpClient);
  fb = inject(FormBuilder);
  hide = true;
  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      guid: ['523a27eb-7d0b-4339-807e-6e5f1bf2c5ef'],
      naziv: ['', Validators.required],
      weight: [0, Validators.required],
      type: ['', Validators.required],
      price: [0, Validators.required],
      maxAmount: [0, Validators.required],
      minAmount: [0, Validators.required]
    });
  }
  
  addItem() {
    if (this.form.valid) {
      console.log(this.form.value);

      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
  
      this.http.post(`${environment.apiUrl}/Item`, this.form.value, {headers})
        .subscribe({
          next: () => {
            this.matSnackBar.open('Item added successfully', 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
            });
            this.router.navigate(['/items']);
          },
          error: (error) => {
            console.error('Add item error:', error);
            this.matSnackBar.open('Failed to add item', 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
            });
          }
        });
    }
  }
  
}
