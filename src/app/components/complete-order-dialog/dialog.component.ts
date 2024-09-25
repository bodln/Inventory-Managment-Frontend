import { Component, inject, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-location-dialog',
  standalone: true,
  template: `
    <h1 mat-dialog-title>Enter Location</h1>
    <div mat-dialog-content>
      <mat-form-field>
        <mat-label>Location Name</mat-label>
        <input matInput [(ngModel)]="location" />
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
export class CompleteOrderDialogComponent {
  location: string = '';
  snackBar = inject(MatSnackBar);
  http = inject(HttpClient); // Inject HttpClient
  
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
