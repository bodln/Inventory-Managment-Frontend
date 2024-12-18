import { Component, inject, Inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LocationHistoryRequest } from '../../interfaces/location-history-request';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-move-inventory',
  standalone: true,
  template: `
    <div mat-dialog-content>
      <mat-form-field>
        <mat-label>New Loaction</mat-label>
        <input matInput [(ngModel)]="locationName" />
      </mat-form-field>
      <mat-form-field>
        <mat-label>Quantity for transfer</mat-label>
        <input matInput [(ngModel)]="transferQuantity" />
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
        console.log(error)
      }
    });
  }
}
