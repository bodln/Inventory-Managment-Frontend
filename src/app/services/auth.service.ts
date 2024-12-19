import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../interfaces/login-request';
import { Observable, map } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { RegisterRequest } from '../interfaces/register-request';
import { MessageResponse } from '../interfaces/message-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl: string = environment.apiUrl;
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/User/LogIns`, data)
      .pipe(
        map((response) => {
          localStorage.setItem(this.tokenKey, response.token);
          console.log("Login response: " + response.token);
          return response;
        })
      );
  }

  register(data: RegisterRequest): Observable<MessageResponse> {
    //console.log("Register data: " + data);
    return this.http
      .post<MessageResponse>(`${this.apiUrl}/User/Register`, data)
      .pipe(
        map((response) => {
          //console.log("Register response: " + response.message);
          return response;
        })
      );
  }

  getUserDetail() {
    const token = this.getToken();
    if (!token) return null;

    const decodedToken: any = jwtDecode(token);
    const userDetail = {
      email: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
      roles: decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [],
    };

    //console.log("User token: " + token);
    //console.log("User email: " + userDetail.email);
    //console.log("User roles: " + userDetail.roles);

    return userDetail;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired();
  }

  isUserInRole(role: string): boolean {
    const userDetail = this.getUserDetail();
    return userDetail ? userDetail.roles.includes(role) : false;
  }

  private isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    const decoded = jwtDecode(token);
    const isTokenExpired = Date.now() >= decoded['exp']! * 1000;
    if (isTokenExpired) this.logout();
    return isTokenExpired;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  private getToken(): string | null {
    return localStorage.getItem(this.tokenKey) || '';
  }
}
