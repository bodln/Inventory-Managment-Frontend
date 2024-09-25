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
import { BehaviorSubject, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BillOfSaleResponse } from '../../interfaces/bill-of-sale-response';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bills-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './bills-table.component.html',
  styleUrls: ['./bills-table.component.css'],
})
export class BillsTableComponent {
  http = inject(HttpClient);
  snackBar = inject(MatSnackBar);
  router = inject(Router);

  displayedColumns: string[] = ['itemName', 'buyerName', 'contactInfo', 'quantity', 'dateOfSale', 'price'];
  private originalBills: BillOfSaleResponse[] = [];
  filteredBills$: BehaviorSubject<BillOfSaleResponse[]> = new BehaviorSubject<BillOfSaleResponse[]>([]);

  searchQuery: string = '';
  sortField: string = ''; 

  constructor() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<BillOfSaleResponse[]>(`${environment.apiUrl}/BillOfSale`, { headers })
      .pipe(
        catchError((error) => {
          this.snackBar.open('Failed to load bills of sale. Please try again later.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
          });
          return of([]);
        }),
        map((bills) => bills ?? [])
      )
      .subscribe((bills) => {
        this.originalBills = bills;

        console.log("bills: ", this.originalBills)

        this.filteredBills$.next(bills);
      });
  }

  filterBills(): BillOfSaleResponse[] {
    const lowerSearchQuery = this.searchQuery.toLowerCase();
    let filtered = this.originalBills;

    if (this.searchQuery.trim() !== '') {
      filtered = filtered.filter((bill) =>
        bill.item.naziv.toLowerCase().includes(lowerSearchQuery)
      );
    }

    if (this.sortField === 'date') {
      filtered.sort((a, b) => new Date(b.dateOfSale).getTime() - new Date(a.dateOfSale).getTime());
    }

    return filtered;
  }

  navigateToAddBill() {
    this.router.navigate(['/add-bill']);
  }

  onSearchQueryChange() {
    this.filteredBills$.next(this.filterBills());
  }

  onSortBy(field: string) {
    this.sortField = field;
    this.filteredBills$.next(this.filterBills());
  }
}
