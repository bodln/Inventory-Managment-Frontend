import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const roles = next.data['roles'] as Array<string>;
    
    if (!roles) {
      return true;
    }

    const userRoles = this.authService.getUserDetail()?.roles || [];

    const hasRole = roles.some(role => userRoles.includes(role));

    if (!hasRole) {
      this.router.navigate(['/unauthorized']); 
      return false;
    }

    return true;
  }
}
