import { Component, inject, Inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LocationHistoryRequest } from '../../interfaces/location-history-request';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-move-inventory',
    template: `
    <div style="width:100%; font-family:'DM Sans',sans-serif;">

      <!-- Header -->
      <div style="background:#0f172a; padding:20px 24px 16px; position:relative; overflow:hidden;">
        <div style="height:3px; background:linear-gradient(90deg,#f59e0b,#fbbf24); position:absolute; top:0; left:0; right:0;"></div>
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="width:32px; height:32px; background:#f59e0b; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            <mat-icon style="font-size:17px; width:17px; height:17px; color:#1c1917;">swap_horiz</mat-icon>
          </div>
          <div>
            <div style="color:white; font-family:'Syne',sans-serif; font-weight:700; font-size:1rem; line-height:1.2;">Move Inventory</div>
            <div style="color:#64748b; font-size:0.72rem; margin-top:1px;">Transfer stock to a new location</div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div style="padding:24px; background:white; display:flex; flex-direction:column; gap:4px;">
        <mat-form-field appearance="outline" style="width:100%;">
          <mat-label>New Location</mat-label>
          <input matInput [(ngModel)]="locationName" placeholder="e.g. Warehouse B, Shelf 2" />
          <mat-icon matPrefix style="color:#94a3b8; margin-right:6px;">place</mat-icon>
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%;">
          <mat-label>Quantity to Transfer</mat-label>
          <input matInput type="number" [(ngModel)]="transferQuantity" placeholder="0" />
          <mat-icon matPrefix style="color:#94a3b8; margin-right:6px;">move_down</mat-icon>
        </mat-form-field>
      </div>

      <!-- Actions -->
      <div style="padding:0 24px 24px; background:white; display:flex; gap:10px;">
        <button (click)="onCancel()"
          style="flex:1; padding:11px; background:white; color:#475569; border:1px solid #e2e8f0; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:0.875rem; font-weight:600; cursor:pointer;">
          Cancel
        </button>
        <button (click)="onDone()"
          style="flex:1; padding:11px; background:#0f172a; color:white; border:none; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:0.875rem; font-weight:700; cursor:pointer;">
          Move Stock
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
    ],
    styleUrl: './move-inventory.component.css'
})
export class MoveInventoryComponent {
  locationName: string = '';
  transferQuantity: number = 0;
  snackBar = inject(MatSnackBar);
  http = inject(HttpClient);

  constructor(
    public dialogRef: MatDialogRef<MoveInventoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { inventoryGUID: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onDone(): void {
    this.snackBar.open('Moving to location...', 'Close', {
      duration: 1000,
      horizontalPosition: 'center',
    });

    const endpoint = `${environment.apiUrl}/LocationHistory`;
    const locationHistoryRequest: LocationHistoryRequest = {
      inventoryGUID: this.data.inventoryGUID,
      locationName: this.locationName,
      quantity: this.transferQuantity
    };

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true',
    });

    this.http.post(endpoint, locationHistoryRequest, { headers }).subscribe({
      next: (response) => {
        this.snackBar.open('Location successfully altered!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
        });
        this.dialogRef.close(this.locationName);
      },
      error: (error) => {
        this.snackBar.open('Failed to alter inventory location.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
        });
        console.log(error);
      }
    });
  }
}