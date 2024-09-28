import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/auth/';
  private refreshTokenTimeout: any;

  constructor(private http: HttpClient, private router: Router) { }
  // Login method
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}login/`, { username, password })
      .pipe(tap((response: any) => {
        this.setSession(response);  // Save tokens
        localStorage.setItem('user',username);
      }));
  }

  // Set tokens in localStorage and schedule token refresh
  private setSession(authResult: any) {
    localStorage.setItem('access_token', authResult.access);
    localStorage.setItem('refresh_token', authResult.refresh);

    // Decode token to get expiration time and schedule refresh
    const tokenExpiry = this.getExpiry(authResult.access);
    this.scheduleTokenRefresh(tokenExpiry);
  }

  // Logout user and clear tokens
  logout() {
    this.clearSession();
    this.router.navigate(['login']);
  }

  // Clear stored tokens
  private clearSession() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    clearTimeout(this.refreshTokenTimeout);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('refresh_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  // Refresh the access token using the refresh token
  refreshToken(): Observable<any> {
    const headers = this.getAuthHeaders();
    //const Refresh = localStorage.getItem('refresh_token');
    if (!headers) return throwError('No refresh token available');

    return this.http.post(`${this.apiUrl}token/refresh/`, { headers })
      .pipe(tap((response: any) => {
        localStorage.setItem('access_token', response.access);
        const tokenExpiry = this.getExpiry(response.access);
        this.scheduleTokenRefresh(tokenExpiry);
      }));
  }

  // Get the access token from localStorage
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Decode the token expiry time
  private getExpiry(token: string): number {
    const payload = JSON.parse(atob(token.split('.')[1]));  // Decode JWT
    return payload.exp * 1000;  // Convert to milliseconds
  }

  // Schedule a token refresh before it expires
  private scheduleTokenRefresh(tokenExpiry: number) {
    const refreshTime = tokenExpiry - Date.now() - 60000;  // Refresh 1 min before expiry
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), refreshTime);
  }
  register(username: string, email: string, password: string): Observable<any> {
    const registerPayload = {
      username,
      email,
      password
    };
    return this.http.post(`${this.apiUrl}register/`, registerPayload)
      .pipe(tap((response: any) => {
        alert('User registered successfully');
      }));
  }

  sendOtp(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}send-otp/`, { email });
  }

  // Method to verify OTP
  verifyOtp( otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}verify-otp/`, { otp });
  }
  
}
