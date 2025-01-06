import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  authService = inject(AuthService);

  isAdmin(): boolean {
    const userDetail = this.authService.getUserDetail();
    return userDetail?.roles.includes('Admin');
  }

  isManager(): boolean {
    const userDetail = this.authService.getUserDetail();
    return userDetail?.roles.includes('Manager');
  }

  isWarehouseman(): boolean {
    const userDetail = this.authService.getUserDetail();
    return userDetail?.roles.includes('Warehouseman');
  }
}
