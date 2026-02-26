import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { StockResponse } from '../../interfaces/stock-response';
import { LocationHistoryResponse } from '../../interfaces/location-history-response';
import { AnalysisResponse } from '../../interfaces/analysis-reponse';

@Component({
    selector: 'app-item-analysis-dialog',
    template: `
    <div style="width:100%; font-family:'DM Sans',sans-serif;">

      <!-- Header -->
      <div style="background:#0f172a; padding:20px 24px 16px; position:relative; overflow:hidden;">
        <div style="height:3px; background:linear-gradient(90deg,#f59e0b,#fbbf24); position:absolute; top:0; left:0; right:0;"></div>
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="width:32px; height:32px; background:#f59e0b; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            <mat-icon style="font-size:17px; width:17px; height:17px; color:#1c1917;">analytics</mat-icon>
          </div>
          <div>
            <div style="color:white; font-family:'Syne',sans-serif; font-weight:700; font-size:1rem; line-height:1.2;">
              {{ data.analysis.item.naziv }}
            </div>
            <div style="color:#64748b; font-size:0.72rem; margin-top:1px;">Item Analysis Report</div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div style="padding:24px; background:white; max-height:65vh; overflow-y:auto;">

        <!-- Stats grid -->
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin-bottom:24px;">
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:14px;">
            <div style="font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#94a3b8; margin-bottom:4px;">Available</div>
            <div style="font-family:'DM Mono',monospace; font-size:1.4rem; font-weight:500; color:#0f172a; line-height:1;">{{ data.stock.avilableAmount }}</div>
          </div>
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:14px;">
            <div style="font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#16a34a; margin-bottom:4px;">Total Profit</div>
            <div style="font-family:'DM Mono',monospace; font-size:1.4rem; font-weight:500; color:#15803d; line-height:1;">{{ data.analysis.totalProfit | currency }}</div>
          </div>
          <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:10px; padding:14px;">
            <div style="font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#2563eb; margin-bottom:4px;">Units Sold</div>
            <div style="font-family:'DM Mono',monospace; font-size:1.4rem; font-weight:500; color:#1d4ed8; line-height:1;">{{ data.analysis.unitsSold }}</div>
          </div>
        </div>

        <!-- Item details -->
        <div style="margin-bottom:20px;">
          <div style="font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:#94a3b8; margin-bottom:10px;">Item Details</div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
            <div style="display:flex; justify-content:space-between; padding:10px 14px; background:#f8fafc; border-radius:8px; border:1px solid #f1f5f9;">
              <span style="color:#64748b; font-size:0.85rem;">Max Amount</span>
              <span style="font-family:'DM Mono',monospace; font-weight:500; color:#0f172a;">{{ data.analysis.item.maxAmount }}</span>
            </div>
            <div style="display:flex; justify-content:space-between; padding:10px 14px; background:#f8fafc; border-radius:8px; border:1px solid #f1f5f9;">
              <span style="color:#64748b; font-size:0.85rem;">Min Amount</span>
              <span style="font-family:'DM Mono',monospace; font-weight:500; color:#0f172a;">{{ data.analysis.item.minAmount }}</span>
            </div>
          </div>
        </div>

        <!-- Storage status badges -->
        <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:24px;">
          <span *ngIf="data.stock.moreInStorage"
            style="display:inline-flex; align-items:center; gap:5px; padding:4px 10px; background:#dbeafe; color:#1d4ed8; border-radius:4px; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em;">
            <mat-icon style="font-size:13px; width:13px; height:13px;">warehouse</mat-icon>
            More in Storage
          </span>
          <span *ngIf="data.stock.overCapacity"
            style="display:inline-flex; align-items:center; gap:5px; padding:4px 10px; background:#fef3c7; color:#b45309; border-radius:4px; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em;">
            <mat-icon style="font-size:13px; width:13px; height:13px;">warning</mat-icon>
            Over Capacity
          </span>
          <span *ngIf="data.stock.underCapacity"
            style="display:inline-flex; align-items:center; gap:5px; padding:4px 10px; background:#fee2e2; color:#dc2626; border-radius:4px; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em;">
            <mat-icon style="font-size:13px; width:13px; height:13px;">arrow_downward</mat-icon>
            Under Capacity
          </span>
          <span *ngIf="!data.stock.overCapacity && !data.stock.underCapacity"
            style="display:inline-flex; align-items:center; gap:5px; padding:4px 10px; background:#dcfce7; color:#15803d; border-radius:4px; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em;">
            <mat-icon style="font-size:13px; width:13px; height:13px;">check_circle</mat-icon>
            Stock In Bounds
          </span>
        </div>

        <!-- Location history table -->
        <div style="font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:#94a3b8; margin-bottom:10px;">Location History</div>
        <div style="border:1px solid #e2e8f0; border-radius:10px; overflow:auto;">
          <table mat-table [dataSource]="filteredLocations" style="width:100%;">

            <ng-container matColumnDef="locationName">
              <th mat-header-cell *matHeaderCellDef
                style="background:#fafbfc; color:#64748b; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.09em; padding:10px 16px; border-bottom:1px solid #e2e8f0;">
                Location
              </th>
              <td mat-cell *matCellDef="let location; let last = last"
                style="padding:12px 16px; font-size:0.875rem; color:#1e293b; border-bottom:1px solid #f1f5f9;">
                <div style="display:flex; align-items:center; gap:6px;">
                  <mat-icon style="font-size:13px; width:13px; height:13px; color:#94a3b8;">place</mat-icon>
                  {{ location.locationName }}
                  <span *ngIf="last"
                    style="padding:1px 6px; background:#dcfce7; color:#15803d; border-radius:3px; font-size:0.65rem; font-weight:700; text-transform:uppercase; margin-left:4px;">
                    Latest
                  </span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="warehouseman">
              <th mat-header-cell *matHeaderCellDef
                style="background:#fafbfc; color:#64748b; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.09em; padding:10px 16px; border-bottom:1px solid #e2e8f0;">
                Warehouseman
              </th>
              <td mat-cell *matCellDef="let location"
                style="padding:12px 16px; font-size:0.875rem; color:#1e293b; border-bottom:1px solid #f1f5f9;">
                {{ location.warehouseman.firstName }} {{ location.warehouseman.lastName }}
              </td>
            </ng-container>

            <ng-container matColumnDef="dateOfStoring">
              <th mat-header-cell *matHeaderCellDef
                style="background:#fafbfc; color:#64748b; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.09em; padding:10px 16px; border-bottom:1px solid #e2e8f0;">
                Date Stored
              </th>
              <td mat-cell *matCellDef="let location"
                style="padding:12px 16px; font-family:'DM Mono',monospace; font-size:0.8rem; color:#64748b; border-bottom:1px solid #f1f5f9;">
                {{ location.dateOfStoring | date: 'short' }}
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>

      </div>

      <!-- Actions -->
      <div style="padding:16px 24px; background:white; border-top:1px solid #f1f5f9;">
        <button (click)="onClose()"
          style="width:100%; padding:11px; background:#0f172a; color:white; border:none; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:0.875rem; font-weight:700; cursor:pointer;">
          Close
        </button>
      </div>

    </div>
  `,
    imports: [
        CommonModule,
        MatSnackBarModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatIconModule,
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

    console.log("Analysis received: ", data.analysis);
    console.log("Stock received: ", data.stock);

    if (data.stock && data.stock.avilableAmount != null) {
      console.log("Available amount: ", data.stock.avilableAmount);
    } else {
      console.warn("Available amount is missing or invalid");
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

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

  isMostRecentLocation(location: LocationHistoryResponse): boolean {
    return this.filteredLocations.includes(location);
  }
}