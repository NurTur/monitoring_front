import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private REST_API_SERVER = environment.authUrl;
  user: any;

  constructor(private httpClient: HttpClient, private router: Router) {}

  public login(user: any) {
    return this.httpClient.post(`${this.REST_API_SERVER}/login/`, user);
  }

  public saveUser(user: any) {
    this.user = user;
    localStorage.setItem('token', this.user.token);
    localStorage.setItem('user', JSON.stringify(this.user.user));
  }

  public reset(email: any) {
    return this.httpClient.post(
      `${this.REST_API_SERVER}/password_reset/send/`,
      email
    );
  }

  public confirm(confirm: any) {
    return this.httpClient.post(
      `${this.REST_API_SERVER}/password_reset/confirm/`,
      confirm
    );
  }

  public sendPassword(password: any) {
    return this.httpClient.post(
      `${this.REST_API_SERVER}/password/change/`,
      password
    );
  }

  get isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return token !== null;
  }

  get getUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
