import { Component, inject, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-location-dialog',
    template: `
    <div style="width:100%; font-family:'DM Sans',sans-serif;">

      <!-- Header -->
      <div style="background:#0f172a; padding:20px 24px 16px; position:relative; overflow:hidden;">
        <div style="height:3px; background:linear-gradient(90deg,#f59e0b,#fbbf24); position:absolute; top:0; left:0; right:0;"></div>
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="width:32px; height:32px; background:#f59e0b; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            <mat-icon style="font-size:17px; width:17px; height:17px; color:#1c1917;">place</mat-icon>
          </div>
          <div>
            <div style="color:white; font-family:'Syne',sans-serif; font-weight:700; font-size:1rem; line-height:1.2;">Enter Location</div>
            <div style="color:#64748b; font-size:0.72rem; margin-top:1px;">Specify where this shipment will be unloaded</div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div style="padding:24px;">
        <mat-form-field appearance="outline" style="width:100%;">
          <mat-label>Location Name</mat-label>
          <input matInput [(ngModel)]="location" placeholder="e.g. Warehouse A, Bay 3" />
          <mat-icon matPrefix style="color:#94a3b8; margin-right:6px;">storefront</mat-icon>
        </mat-form-field>
      </div>

      <!-- Actions -->
      <div style="padding:0 24px 24px; display:flex; gap:10px;">
        <button (click)="onCancel()"
          style="flex:1; padding:10px; background:white; color:#475569; border:1px solid #e2e8f0; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:0.875rem; font-weight:600; cursor:pointer; transition:background 0.12s;">
          Cancel
        </button>
        <button (click)="onDone()"
          style="flex:1; padding:10px; background:#0f172a; color:white; border:none; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:0.875rem; font-weight:700; cursor:pointer; transition:background 0.12s;">
          Confirm &amp; Unload
        </button>
      </div>

    </div>
  `,
    imports: [
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSnackBarModule,
        MatIconModule,
    ]
})
export class CompleteOrderDialogComponent {
  location: string = '';
  snackBar = inject(MatSnackBar);
  http = inject(HttpClient);

  constructor(
    public dialogRef: MatDialogRef<CompleteOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { itemGuid: string, orderGuid: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onDone(): void {
    this.snackBar.open('Unloading order...', 'Close', {
      duration: 1000,
      horizontalPosition: 'center',
    });

    const endpoint = `${environment.apiUrl}/ShipmentOrder/Conclude/${this.data.orderGuid}`;
    const payload = {
      location: this.location,
      itemGuid: this.data.itemGuid
    };
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true',
    });

    this.http.put(endpoint, payload, { headers }).subscribe({
      next: (response) => {
        this.snackBar.open('Order successfully unloaded!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
        });
        this.dialogRef.close(this.location);
      },
      error: (error) => {
        this.snackBar.open('Failed to unload the order.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
        });
      }
    });
  }
}