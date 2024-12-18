import { Component, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AnalysisResponse } from '../../interfaces/analysis-reponse';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-item-analysis',
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
  templateUrl: './item-analysis.component.html',
  styleUrls: ['./item-analysis.component.css'],
})
export class ItemAnalysisComponent {
  http = inject(HttpClient);
  snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['naziv', 'location', 'unitsSold', 'profit', 'actions'];
  private originalItems: AnalysisResponse[] = [];
  filteredItems$: BehaviorSubject<AnalysisResponse[]> = new BehaviorSubject<AnalysisResponse[]>([]);

  searchQuery: string = '';
  sortField: string = '';

  constructor() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true', 
    });

    this.http
      .get<AnalysisResponse[]>(`${environment.apiUrl}/Item/Analyze`, { headers })
      .pipe(
        catchError((error) => {
          this.snackBar.open('Failed to load analysis data. Please try again later.', 'Close', {
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

  filterItems(): AnalysisResponse[] {
    const lowerSearchQuery = this.searchQuery.toLowerCase();
    let filtered = this.originalItems;

    if (this.searchQuery.trim() !== '') {
      filtered = filtered.filter((analysis) =>
        analysis.item.naziv.toLowerCase().includes(lowerSearchQuery)
      );
    }

    if (this.sortField === 'name') {
      filtered.sort((a, b) => a.item.naziv.localeCompare(b.item.naziv));
    } else if (this.sortField === 'unitsSold') {
      filtered.sort((a, b) => a.unitsSold - b.unitsSold);
    } else if (this.sortField === 'profit') {
      filtered.sort((a, b) => a.totalProfit - b.totalProfit);
    }

    return filtered;
  }

  onSearchQueryChange() {
    this.filteredItems$.next(this.filterItems());
  }

  onSortBy(field: string) {
    this.sortField = field;
    this.filteredItems$.next(this.filterItems());
  }

  viewAnalysis(analysis: AnalysisResponse) {
    console.log('View Analysis:', analysis);
  }
}
