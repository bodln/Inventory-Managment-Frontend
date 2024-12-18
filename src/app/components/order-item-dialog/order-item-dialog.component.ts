import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { ShipmentOrderRequest } from '../../interfaces/shipment-order-request';

@Component({
  selector: 'app-order-item-dialog',
  standalone: true,
  template: `
    <h1 mat-dialog-title>Enter Quantity for {{ data.itemName }}</h1>
    <div mat-dialog-content>
      <mat-form-field>
        <mat-label>Quantity</mat-label>
        <input matInput [(ngModel)]="quantity" />
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button (click)="onDone()">Done</button>
    </div>
  `,
  imports:[
    FormsModule,       
    MatDialogModule,      
    MatFormFieldModule,   
    MatInputModule,       
    MatButtonModule,
    MatSnackBarModule
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
        console.log(error)
      }
    });
  }
}
