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
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { DeleteConfirmationDialog } from '../../components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ShipmentOrderResponse } from '../../interfaces/shipment-order-response';
import { CompleteOrderDialogComponent } from '../../components/complete-order-dialog/dialog.component';

@Component({
  selector: 'app-shipment-order',
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
  templateUrl: './shipment-order.component.html',
  styleUrls: ['./shipment-order.component.css'],
})
export class ShipmentOrderComponent {
  http = inject(HttpClient);
  snackBar = inject(MatSnackBar);
  router = inject(Router);
  dialog = inject(MatDialog);

  displayedColumns: string[] = ['itemName', 'quantity', 'manager', 'dateOfCreation', 'dateOfArrival', 'price', 'unloaded', 'actions'];
  originalOrders: ShipmentOrderResponse[] = [];
  filteredOrders$: BehaviorSubject<ShipmentOrderResponse[]> = new BehaviorSubject<ShipmentOrderResponse[]>([]);

  searchQuery: string = '';
  sortField: string = '';

  constructor() {
    this.fetchShipmentOrders();
  }

  fetchShipmentOrders() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true',
    });

    this.http
      .get<ShipmentOrderResponse[]>(`${environment.apiUrl}/ShipmentOrder`, { headers })
      .pipe(
        catchError((error) => {
          this.snackBar.open('Failed to load shipment orders. Please try again later.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
          });
          return of([]);
        }),
        map((orders) => orders ?? [])
      )
      .subscribe((orders) => {
        this.originalOrders = orders;
        this.filteredOrders$.next(orders);
      });
  }

  filterOrders(): ShipmentOrderResponse[] {
    const lowerSearchQuery = this.searchQuery.toLowerCase();
    let filtered = this.originalOrders;

    if (this.searchQuery.trim() !== '') {
      filtered = filtered.filter((order) =>
        order.item.naziv.toLowerCase().includes(lowerSearchQuery)
      );
    }

    if (this.sortField === 'itemName') {
      filtered.sort((a, b) => a.item.naziv.localeCompare(b.item.naziv));
    } else if (this.sortField === 'unloaded') {
      filtered.sort((a, b) => Number(a.unloaded) - Number(b.unloaded));
    } else if (this.sortField === 'dateOfArrival') {
      filtered.sort((a, b) => (a.dateOfArrival === null ? -1 : b.dateOfArrival === null ? 1 : 0));
    }

    return filtered;
  }

  onSearchQueryChange() {
    this.filteredOrders$.next(this.filterOrders());
  }

  onSortBy(field: string) {
    this.sortField = field;
    this.filteredOrders$.next(this.filterOrders());
  }

  deleteOrder(order: ShipmentOrderResponse) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialog, {
      width: '300px',
      data: { name: order.item.naziv },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        });

        this.http
          .delete(`${environment.apiUrl}/ShipmentOrder/${order.guid}`, { headers })
          .subscribe({
            next: () => {
              this.originalOrders = this.originalOrders.filter(
                (o) => o.guid !== order.guid
              );
              this.filteredOrders$.next(this.filterOrders());
              this.snackBar.open('Order deleted successfully.', 'Close', {
                duration: 5000,
                horizontalPosition: 'center',
              });
            },
            error: () => {
              this.snackBar.open('Failed to delete order.', 'Close', {
                duration: 5000,
                horizontalPosition: 'center',
              });
            },
          });
      }
    });
  }

  markAsUnloaded(order: ShipmentOrderResponse) {
    const dialogRef = this.dialog.open(CompleteOrderDialogComponent, {
      width: '400px',
      data: { orderName: order.item.naziv, itemGuid: order.item.guid, orderGuid: order.guid },
    });

    dialogRef.afterClosed().subscribe((location) => {
      if (location) {
        console.log('Mark as unloaded for:', order.item.naziv, 'Location:', location);
        this.fetchShipmentOrders();
      }
    });
  }

  markAsArrived(order: ShipmentOrderResponse) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true',
    });

    this.http
      .put(`${environment.apiUrl}/ShipmentOrder/Arrive/${order.guid}`, { headers })
      .subscribe({
        next: () => {
          this.snackBar.open('Order successfully marked as arrived.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
          });
          this.fetchShipmentOrders();
        },
        error: () => {
          this.snackBar.open('Failed to mark order as arrived.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
          });
        },
      });
  }

  getRowClass(order: ShipmentOrderResponse): string {
    if (order.unloaded) {
      return 'unloaded';
    } else if (order.dateOfArrival == null) {
      return 'notarrived';
    } else {
      return 'arrived';
    }
  }
}
