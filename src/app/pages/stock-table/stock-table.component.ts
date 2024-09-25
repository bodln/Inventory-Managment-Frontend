import { Component, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { StockResponse } from '../../interfaces/stock-response';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ItemRequestResponse } from '../../interfaces/item-request-response';
import { OrderItemDialogComponent } from '../../components/order-item-dialog/order-item-dialog.component';

@Component({
  selector: 'app-stock-table',
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
  templateUrl: './stock-table.component.html',
  styleUrls: ['./stock-table.component.css'],
})
export class StockTableComponent {
  http = inject(HttpClient);
  snackBar = inject(MatSnackBar);
  router = inject(Router);
  dialog = inject(MatDialog);

  displayedColumns: string[] = ['name', 'availableAmount', 'maxAmount', 'minAmount', 'overCapacity', 'underCapacity', 'moreInStorage', 'actions'];
  private originalStocks: StockResponse[] = [];
  filteredStocks$: BehaviorSubject<StockResponse[]> = new BehaviorSubject<StockResponse[]>([]);
  searchText: string = '';
  sortByCapacity: 'none' | 'over' | 'under' = 'none';

  constructor() {
    this.fetchStockData(); // Fetch stock data on initialization
  }

  // Method to fetch stock data from the server
  fetchStockData() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<StockResponse[]>(`${environment.apiUrl}/Inventory/Stock`, { headers })
      .pipe(
        catchError((error) => {
          this.snackBar.open('Failed to load stock data. Please try again later.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
          });
          return of([]); // Return an empty array on error
        }),
        map((stocks) => stocks ?? [])
      )
      .subscribe((stocks) => {
        this.originalStocks = stocks;
        this.filteredStocks$.next(stocks);
      });
  }

  analyzeItem(item: StockResponse) {
    console.log('Analyze:', item.item.naziv);
  }

  getRowClass(stock: StockResponse): string {
    if (stock.overCapacity) {
      return 'over-capacity';
    } else if (stock.underCapacity) {
      return 'under-capacity';
    }
    return '';
  }

  applyFilter() {
    let filteredStocks = this.originalStocks.filter((stock) =>
      stock.item.naziv.toLowerCase().includes(this.searchText.toLowerCase())
    );

    if (this.sortByCapacity === 'over') {
      filteredStocks = filteredStocks.filter(stock => stock.overCapacity);
    } else if (this.sortByCapacity === 'under') {
      filteredStocks = filteredStocks.filter(stock => stock.underCapacity);
    }

    this.filteredStocks$.next(filteredStocks);
  }

  setSortByCapacity(value: 'none' | 'over' | 'under') {
    this.sortByCapacity = value;
    this.applyFilter();
  }

  orderMore(item: ItemRequestResponse) {
    const dialogRef = this.dialog.open(OrderItemDialogComponent, {
      width: '400px',
      data: { itemName: item.naziv, itemGuid: item.guid },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Ordered more:', item.naziv);
        this.fetchStockData(); 
      }
    });
  }
}
