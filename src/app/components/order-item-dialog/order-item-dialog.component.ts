import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environments/environment';
import { ShipmentOrderRequest } from '../../interfaces/shipment-order-request';

@Component({
    selector: 'app-order-item-dialog',
    template: `
    <div style="width:100%; font-family:'DM Sans',sans-serif;">

      <!-- Header -->
      <div style="background:#0f172a; padding:20px 24px 16px; position:relative; overflow:hidden;">
        <div style="height:3px; background:linear-gradient(90deg,#f59e0b,#fbbf24); position:absolute; top:0; left:0; right:0;"></div>
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="width:32px; height:32px; background:#f59e0b; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            <mat-icon style="font-size:17px; width:17px; height:17px; color:#1c1917;">shopping_cart</mat-icon>
          </div>
          <div>
            <div style="color:white; font-family:'Syne',sans-serif; font-weight:700; font-size:1rem; line-height:1.2;">Order Stock</div>
            <div style="color:#64748b; font-size:0.72rem; margin-top:1px;">{{ data.itemName }}</div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div style="padding:24px; background:white;">
        <mat-form-field appearance="outline" style="width:100%;">
          <mat-label>Quantity to Order</mat-label>
          <input matInput [(ngModel)]="quantity" placeholder="Enter quantity" />
          <mat-icon matPrefix style="color:#94a3b8; margin-right:6px;">numbers</mat-icon>
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
          Place Order
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
export class OrderItemDialogComponent {
  quantity: string = '';
  snackBar = inject(MatSnackBar);
  http = inject(HttpClient);

  constructor(
    public dialogRef: MatDialogRef<OrderItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { itemGuid: string, itemName: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onDone(): void {
    this.snackBar.open('Unloading order...', 'Close', {
      duration: 1000,
      horizontalPosition: 'center',
    });

    const endpoint = `${environment.apiUrl}/ShipmentOrder`;
    const shipmentOrderRequest: ShipmentOrderRequest = {
      itemGUID: this.data.itemGuid,
      quantity: +this.quantity,
      dateOfCreation: new Date().toISOString(),
      price: 69.69,
      unloaded: false,
    };

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true',
    });

    this.http.post(endpoint, shipmentOrderRequest, { headers }).subscribe({
      next: (response) => {
        this.snackBar.open('Order successfully made!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
        });
        this.dialogRef.close(this.quantity);
      },
      error: (error) => {
        this.snackBar.open('Failed to make the order.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
        });
        console.log(error);
      }
    });
  }
}