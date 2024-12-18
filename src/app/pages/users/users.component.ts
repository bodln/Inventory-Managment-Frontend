import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { UserData } from '../../interfaces/user-data';
import { BehaviorSubject, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DeleteConfirmationDialog } from '../../components/delete-confirmation-dialog/delete-confirmation-dialog.component';

@Component({
  selector: 'app-users',
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
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  http = inject(HttpClient);
  snackBar = inject(MatSnackBar);
  router = inject(Router);
  dialog = inject(MatDialog);

  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'roles', 'address', 'dateOfBirth', 'dateOfHire', 'salary', 'actions'];
  private originalUsers: UserData[] = [];
  filteredUsers$: BehaviorSubject<UserData[]> = new BehaviorSubject<UserData[]>([]);

  searchQuery: string = '';
  sortField: string = '';

  constructor() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<UserData[]>(`${environment.apiUrl}/User/GetAll`, { headers })
      .pipe(
        catchError((error) => {
          this.snackBar.open('Failed to load users. Please try again later.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
          });
          return of([]);
        }),
        map((users) => users ?? [])
      )
      .subscribe((users) => {
        this.originalUsers = users;
        this.filteredUsers$.next(users);
      });

    console.log(this.filteredUsers$)
  }

  filterItems(): UserData[] {
    const lowerSearchQuery = this.searchQuery.toLowerCase();
    let filtered = this.originalUsers;

    if (this.searchQuery.trim() !== '') {
      filtered = filtered.filter((item) =>
        item.firstName.toLowerCase().includes(lowerSearchQuery)
      );
    }

    if (this.sortField === 'firstName') {
      filtered.sort((a, b) => a.firstName.localeCompare(b.firstName));
    } else if (this.sortField === 'salary') {
      filtered.sort((a, b) => a.salary - b.salary);
    } else if (this.sortField === 'lastName') {
      filtered.sort((a, b) => a.lastName.localeCompare(b.lastName));
    }

    return filtered;
  }

  onSearchQueryChange() {
    this.filteredUsers$.next(this.filterItems());
  }

  onSortBy(field: string) {
    this.sortField = field;
    this.filteredUsers$.next(this.filterItems());
  }

  editUser(user: UserData) {
    this.router.navigate(['/edit-item', user.email]);
  }

  deleteUser(user: UserData) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialog, {
      width: '300px',
      data: { name: user.email },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        const body = { email: user.email };

        this.http
          .post(`${environment.apiUrl}/User/RemoveUser`, { headers, body })
          .subscribe({
            next: () => {
              this.originalUsers = this.originalUsers.filter(
                (u) => u.email !== user.email
              );
              this.filteredUsers$.next(this.filterItems());
              this.snackBar.open('User deleted successfully.', 'Close', {
                duration: 5000,
                horizontalPosition: 'center',
              });
            },
            error: () => {
              this.snackBar.open('Failed to delete user.', 'Close', {
                duration: 5000,
                horizontalPosition: 'center',
              });
            },
          });
      }
    });
  }
}
