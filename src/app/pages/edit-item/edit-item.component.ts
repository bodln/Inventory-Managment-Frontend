import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { ItemRequestResponse } from '../../interfaces/item-request-response';

@Component({
  selector: 'app-edit-item',
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
  templateUrl: './edit-item.component.html',
  styleUrl: './edit-item.component.css'
})
export class EditItemComponent {
  authService = inject(AuthService);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);
  route = inject(ActivatedRoute)
  http = inject(HttpClient);
  fb = inject(FormBuilder);
  hide = true;
  form!: FormGroup;
  itemGuid : string = this.route.snapshot.paramMap.get('guid') || '';

  ngOnInit(): void {

    this.form = this.fb.group({
      guid: [''],
      naziv: ['', Validators.required],
      weight: [0, [Validators.required, Validators.min(0)]],
      type: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      maxAmount: [0, Validators.required],
      minAmount: [0, Validators.required]
    });

    if (this.itemGuid) {
      this.loadItemDetails();
    }
  }

  loadItemDetails() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.get<ItemRequestResponse>(`${environment.apiUrl}/Item/${this.itemGuid}`, {headers})
      .subscribe({
        next: (item) => this.form.patchValue(item),
        error: () => this.matSnackBar.open('Failed to load item details', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
        })
      });
  }

  updateItem() {
    if (this.form.valid) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.http.put(`${environment.apiUrl}/Item/${this.itemGuid}`, this.form.value, {headers})
        .subscribe({
          next: () => {
            this.matSnackBar.open('Item updated successfully', 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
            });
            this.router.navigate(['/items']);
          },
          error: () => this.matSnackBar.open('Failed to update item', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
          })
        });
    }
  }
}
