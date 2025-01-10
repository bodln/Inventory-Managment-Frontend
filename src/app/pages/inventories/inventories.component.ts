import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
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
import { InventoryResponse } from '../../interfaces/inventory-response';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { DeleteConfirmationDialog } from '../../components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MoveInventoryComponent } from '../../components/move-inventory/move-inventory.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-inventory-table',
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
  templateUrl: './inventories.component.html',
  styleUrls: ['./inventories.component.css'],
})
export class InventoriesComponent {
  http = inject(HttpClient);
  snackBar = inject(MatSnackBar);
  router = inject(Router);
  dialog = inject(MatDialog);

  displayedColumns: string[] = ['naziv', 'availableAmount', 'currentLocationName', 'lastShipment', 'actions'];
  private originalInventories: InventoryResponse[] = [];
  filteredInventories$: BehaviorSubject<InventoryResponse[]> = new BehaviorSubject<InventoryResponse[]>([]);

  count: WritableSignal<number> = signal(0);

  searchQuery: string = '';
  sortField: string = ''; 

  constructor() {
    this.fetchInventories();
    effect(() => {
      console.log(`The count is: ${this.count()}`);
    }); 
  }

  fetchInventories() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true', 
    });
  
    this.http
      .get<InventoryResponse[]>(`${environment.apiUrl}/Inventory`, { headers })
      .pipe(
        catchError((error) => {
          this.snackBar.open('Failed to load inventories. Please try again later.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
          });
          console.log("Inventory error: ");
          console.log(error);
          return of([]); 
        }),
        map((inventories) => inventories ?? [])
      )
      .subscribe((inventories) => {
        this.originalInventories = inventories;
        this.filteredInventories$.next(inventories);
      });
  }
  
  filterInventories(): InventoryResponse[] {
    const lowerSearchQuery = this.searchQuery.toLowerCase();
    let filtered = this.originalInventories;

    if (this.searchQuery.trim() !== '') {
      filtered = filtered.filter((inventory) =>
        inventory.item.naziv.toLowerCase().includes(lowerSearchQuery)
      );
    }

    if (this.sortField === 'name') {
      filtered.sort((a, b) => a.item.naziv.localeCompare(b.item.naziv));
    } else if (this.sortField === 'availableAmount') {
      filtered.sort((a, b) => a.availableAmount - b.availableAmount);
    } else if (this.sortField === 'lastShipment') {
      filtered.sort((a, b) => new Date(a.lastShipment).getTime() - new Date(b.lastShipment).getTime());
    }

    return filtered;
  }

  onSearchQueryChange() {
    this.filteredInventories$.next(this.filterInventories());
  }

  onSortBy(field: string) {
    this.sortField = field;
    this.filteredInventories$.next(this.filterInventories());
    this.count.set(this.count() + 1);
  }

  editInventory(inventory: InventoryResponse) {
    this.router.navigate(['/edit-inventory', inventory.guid]);
  }

  moveInventory(inventory: InventoryResponse) {
    const dialogRef = this.dialog.open(MoveInventoryComponent, {
      width: '400px',
      data: { inventoryGUID: inventory.guid },
    });

    dialogRef.afterClosed().subscribe((location) => {
      if (location) {
        console.log('Moved inventory with item:', inventory.item.naziv);
        this.fetchInventories();
      }
    });
  }

  deleteInventory(inventory: InventoryResponse) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialog, {
      width: '300px',
      data: { name: inventory.item.naziv },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });

        this.http
          .delete(`${environment.apiUrl}/Inventory/${inventory.guid}`, { headers })
          .subscribe({
            next: () => {
              this.originalInventories = this.originalInventories.filter(
                (i) => i.guid !== inventory.guid
              );
              this.filteredInventories$.next(this.filterInventories());
              this.snackBar.open('Inventory deleted successfully.', 'Close', {
                duration: 5000,
                horizontalPosition: 'center',
              });
            },
            error: () => {
              this.snackBar.open('Failed to delete inventory.', 'Close', {
                duration: 5000,
                horizontalPosition: 'center',
              });
            },
          });
      }
    });
  }
}
