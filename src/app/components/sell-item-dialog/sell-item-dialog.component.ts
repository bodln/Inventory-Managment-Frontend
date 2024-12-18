import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { BillOfSaleRequest } from '../../interfaces/bill-of-sale-request';
import { OrderItemDialogComponent } from '../order-item-dialog/order-item-dialog.component';

@Component({
  selector: 'app-sell-item-dialog',
  standalone: true,
  template: `
    <div mat-dialog-content>
      <mat-form-field>
        <mat-label>Quantity</mat-label>
        <input matInput [(ngModel)]="quantity" />
      </mat-form-field>
      <mat-form-field>
        <mat-label>Name of Buyer</mat-label>
        <input matInput [(ngModel)]="nameOfBuyer" />
      </mat-form-field>
      <mat-form-field>
        <mat-label>Contact Info</mat-label>
        <input matInput [(ngModel)]="contactInfo" />
      </mat-form-field>
      <mat-form-field>
        <mat-label>Delivery Address</mat-label>
        <input matInput [(ngModel)]="deliveryAddress" />
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button (click)="onDone()">Done</button>
    </div>
  `,
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ]
})
export class SellItemDialogComponent {
  quantity: string = '';
  nameOfBuyer: string = '';
  contactInfo: string = '';
  deliveryAddress: string = '';
  snackBar = inject(MatSnackBar);
  http = inject(HttpClient);

  constructor(
    public dialogRef: MatDialogRef<OrderItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { itemGuid: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onDone(): void {
    this.snackBar.open('Unloading order...', 'Close', {
      duration: 1000,
      horizontalPosition: 'center',
    });

    const endpoint = `${environment.apiUrl}/BillOfSale`;
    const billOfSaleRequest: BillOfSaleRequest = {
      itemGUID: this.data.itemGuid,
      quantity: Number(this.quantity),
      dateOfSale: new Date(), 
      nameOfBuyer: this.nameOfBuyer,
      contactInfo: this.contactInfo,
      deliveryAddress: this.deliveryAddress,
    };

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true', 
    });

    this.http.post(endpoint, billOfSaleRequest, { headers }).subscribe({
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
