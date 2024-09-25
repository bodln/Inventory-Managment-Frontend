import { Component, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, forkJoin, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ItemRequestResponse } from '../../interfaces/item-request-response';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { DeleteConfirmationDialog } from '../../components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OrderItemDialogComponent } from '../../components/order-item-dialog/order-item-dialog.component';
import { SellItemDialogComponent } from '../../components/sell-item-dialog/sell-item-dialog.component';
import { ItemAnalysisDialogComponent } from '../../components/item-analysis-dialog/item-analysis-dialog.component';
import { StockResponse } from '../../interfaces/stock-response';
import { AnalysisResponse } from '../../interfaces/analysis-reponse';

@Component({
  selector: 'app-items-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    MatTooltipModule
  ],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
})
export class ItemsComponent {
  http = inject(HttpClient);
  snackBar = inject(MatSnackBar);
  router = inject(Router);
  dialog = inject(MatDialog);

  displayedColumns: string[] = ['naziv', 'weight', 'type', 'price', 'maxAmount', 'minAmount', 'actions'];
  private originalItems: ItemRequestResponse[] = [];
  filteredItems$: BehaviorSubject<ItemRequestResponse[]> = new BehaviorSubject<ItemRequestResponse[]>([]);

  searchQuery: string = '';
  sortField: string = ''; 

  constructor() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<ItemRequestResponse[]>(`${environment.apiUrl}/Item`, { headers })
      .pipe(
        catchError((error) => {
          this.snackBar.open('Failed to load items. Please try again later.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
          });
          return of([]);
        }),
        map((items) => items ?? [])
      )
      .subscribe((items) => {
        this.originalItems = items;
        this.filteredItems$.next(items);
      });
  }

  filterItems(): ItemRequestResponse[] {
    const lowerSearchQuery = this.searchQuery.toLowerCase();
    let filtered = this.originalItems;

    if (this.searchQuery.trim() !== '') {
      filtered = filtered.filter((item) =>
        item.naziv.toLowerCase().includes(lowerSearchQuery)
      );
    }

    if (this.sortField === 'name') {
      filtered.sort((a, b) => a.naziv.localeCompare(b.naziv));
    } else if (this.sortField === 'weight') {
      filtered.sort((a, b) => a.weight - b.weight);
    } else if (this.sortField === 'price') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.sortField === 'type') {
      filtered.sort((a, b) => a.type.localeCompare(b.type));
    }

    return filtered;
  }

  navigateToAddItem() {
    this.router.navigate(['/add-item']);
  }

  onSearchQueryChange() {
    this.filteredItems$.next(this.filterItems());
  }

  onSortBy(field: string) {
    this.sortField = field;
    this.filteredItems$.next(this.filterItems());
  }

  editItem(item: ItemRequestResponse) {
    this.router.navigate(['/edit-item', item.guid]);
  }

  deleteItem(item: ItemRequestResponse) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialog, {
      width: '300px',
      data: { name: item.naziv },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });

        this.http
          .delete(`${environment.apiUrl}/Item/${item.guid}`, { headers })
          .subscribe({
            next: () => {
              this.originalItems = this.originalItems.filter(
                (i) => i.guid !== item.guid
              );
              this.filteredItems$.next(this.filterItems());
              this.snackBar.open('Item deleted successfully.', 'Close', {
                duration: 5000,
                horizontalPosition: 'center',
              });
            },
            error: () => {
              this.snackBar.open('Failed to delete item.', 'Close', {
                duration: 5000,
                horizontalPosition: 'center',
              });
            },
          });
      }
    });
  }

  analyzeItem(item: ItemRequestResponse) {
    console.log('Analyze:', item);
  }

  salesItem(item: ItemRequestResponse) {
    console.log('Sales:', item);
  }

  orderMore(item: ItemRequestResponse) {
    const dialogRef = this.dialog.open(OrderItemDialogComponent, {
      width: '400px',
      data: { itemName: item.naziv, itemGuid: item.guid },
    });

    dialogRef.afterClosed().subscribe((location) => {
      if (location) {
        console.log('Ordered more:', item.naziv);
      }
    });
  }

  sell(item: ItemRequestResponse) {
    const dialogRef = this.dialog.open(SellItemDialogComponent, {
      width: '400px',
      data: { itemGuid: item.guid },
    });

    dialogRef.afterClosed().subscribe((location) => {
      if (location) {
        console.log('Sold:', item.naziv);
      }
    });
  }

  analyze(item: ItemRequestResponse) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    const analysisRequest = this.http
      .get<AnalysisResponse>(`${environment.apiUrl}/Item/Analyze/${item.guid}`, { headers })
      .pipe(
        catchError((error) => {
          this.snackBar.open('Failed to load analysis data. Please try again later.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
          });
          console.log('Error loading analysis data:', error);
          return throwError(() => new Error('Failed to load analysis data.'));
        })
      );
  
    const stockRequest = this.http
      .get<StockResponse>(`${environment.apiUrl}/Inventory/Stock/${item.guid}`, { headers })
      .pipe(
        catchError((error) => {
          this.snackBar.open('Failed to load stock data. Please try again later.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
          });
          console.log('Error loading stock data:', error);
          return throwError(() => new Error('Failed to load stock data.'));
        })
      );
  
    forkJoin([analysisRequest, stockRequest]).subscribe({
      next: ([analysis, stock]) => {
        if (analysis && stock) {
          const dialogRef = this.dialog.open(ItemAnalysisDialogComponent, {
            width: '400px',
            data: { analysis, stock },
          });
  
          dialogRef.afterClosed().subscribe((location) => {
            if (location) {
              console.log('Analyzed:', item.naziv);
            }
          });
        }
      },
      error: (error) => {
        console.log('Error retrieving analysis or stock data:', error);
      },
    });
  }
}
