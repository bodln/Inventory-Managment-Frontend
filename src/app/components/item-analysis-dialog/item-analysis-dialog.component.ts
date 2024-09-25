import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table'; 
import { CommonModule } from '@angular/common';
import { StockResponse } from '../../interfaces/stock-response';
import { LocationHistoryResponse } from '../../interfaces/location-history-response';
import { AnalysisResponse } from '../../interfaces/analysis-reponse';

@Component({
  selector: 'app-item-analysis-dialog',
  standalone: true,
  template: `
    <h1 mat-dialog-title>Item Analysis: {{ data.analysis.item.naziv }}</h1>
    <div mat-dialog-content>
      <h2>Item Details</h2>
      <p><strong>Item Name:</strong> {{ data.analysis.item.naziv }}</p>
      <p><strong>Max Amount:</strong> {{ data.analysis.item.maxAmount }}</p>
      <p><strong>Min Amount:</strong> {{ data.analysis.item.minAmount }}</p>
      <p><strong>Available Amount:</strong> {{ data.stock.avilableAmount }}</p>
      <p><strong>Total Profit:</strong> {{ data.analysis.totalProfit | currency }}</p>
      <p><strong>Units Sold:</strong> {{ data.analysis.unitsSold }}</p>

      <h2>Inventory Locations</h2>
      <table mat-table [dataSource]="filteredLocations">
        <ng-container matColumnDef="locationName">
          <th mat-header-cell *matHeaderCellDef>Location</th>
          <td mat-cell *matCellDef="let location">
            {{ location.locationName }}
            <span *ngIf="isMostRecentLocation(location)">
              (Most Recent)
            </span>
          </td>
        </ng-container>

        <ng-container matColumnDef="warehouseman">
          <th mat-header-cell *matHeaderCellDef>Warehouseman</th>
          <td mat-cell *matCellDef="let location">
            {{ location.warehouseman.firstName }} {{ location.warehouseman.lastName }}
          </td>
        </ng-container>

        <ng-container matColumnDef="dateOfStoring">
          <th mat-header-cell *matHeaderCellDef>Date Stored</th>
          <td mat-cell *matCellDef="let location">{{ location.dateOfStoring | date: 'short' }}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <h2>Storage Status</h2>
      <p *ngIf="data.stock.moreInStorage">More items are available in storage.</p>
      <p *ngIf="data.stock.overCapacity">This item is over capacity.</p>
      <p *ngIf="data.stock.underCapacity">This item is under capacity.</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onClose()">Close</button>
    </div>
  `,
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule 
  ],
  styleUrls: ['./item-analysis-dialog.component.css']
})
export class ItemAnalysisDialogComponent {
  displayedColumns: string[] = ['locationName', 'warehouseman', 'dateOfStoring'];
  filteredLocations: LocationHistoryResponse[] = [];

  constructor(
    public dialogRef: MatDialogRef<ItemAnalysisDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { analysis: AnalysisResponse; stock: StockResponse }
  ) {
    this.filteredLocations = this.getLatestLocations(data.analysis.locations);
    
    // Logging for debugging
    console.log("Analysis received: ", data.analysis);
    console.log("Stock received: ", data.stock);

    // Safely log the availableAmount and handle possible undefined/null
    if (data.stock && data.stock.avilableAmount != null) {
      console.log("Available amount: ", data.stock.avilableAmount);
    } else {
      console.warn("Available amount is missing or invalid");
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  // Get only the most recent location for each location name
  getLatestLocations(locations: LocationHistoryResponse[]): LocationHistoryResponse[] {
    const latestLocationsMap = new Map<string, LocationHistoryResponse>();

    locations.forEach(location => {
      const existingLocation = latestLocationsMap.get(location.locationName);
      const locationDate = new Date(location.dateOfStoring).getTime();

      if (!existingLocation || new Date(existingLocation.dateOfStoring).getTime() < locationDate) {
        latestLocationsMap.set(location.locationName, location);
      }
    });

    return Array.from(latestLocationsMap.values());
  }

  // Check if the location is the most recent (though filtered should already have the most recent only)
  isMostRecentLocation(location: LocationHistoryResponse): boolean {
    return this.filteredLocations.includes(location);
  }
}
