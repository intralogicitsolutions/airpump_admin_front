import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(private http: HttpClient) {
    this.userSubject = new BehaviorSubject<any>(
      localStorage.getItem('token') || undefined
    );
    this.user = this.userSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.userSubject.value;
  }

  login(email: string, password: string) {
    return this.http
      .post<User>(`${environment.apiRoot}/user/signin`, { email, password })
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('user', JSON.stringify(user));

          this.userSubject.next(user);
          return user;
        })
      );
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.userSubject.next(new User());
  }

  register(user: User) {
    return this.http.post(`${environment.apiRoot}/users/signup`, user);
  }

  forgotPassword(email: string) {
    return this.http
      .post<User>(`${environment.apiRoot}/password/forgot`, { email })
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          //   localStorage.setItem('user', JSON.stringify(user));

          //   this.userSubject.next(user);
          return user;
        })
      );
  }
  resetPassword(old_password: string, new_password: string, user_id: any) {
    return this.http
      .post<User>(`${environment.apiRoot}/password/reset`, {
        old_password,
        new_password,
        user_id,
      })
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          //   localStorage.setItem('user', JSON.stringify(user));

          //   this.userSubject.next(user);
          return user;
        })
      );
  }

  // getAll() {
  // return this.http.get<User[]>(`${environment.apiRoot}/users`);
  // }

  // getById(id: string) {
  // return this.http.get<User>(`${environment.apiRoot}/users/${id}`);
  // }

  update(id: string, params: any) {
    return this.http
      .put(`${environment.apiRoot}/users/update/${id}`, params)
      .pipe(
        map((x) => {
          // update stored user if the logged in user updated their own record
          if (id == this.currentUserValue.id) {
            // update local storage
            const user = { ...this.currentUserValue, ...params };
            localStorage.setItem('user', JSON.stringify(user));

            // publish updated user to subscribers
            this.userSubject.next(user);
          }
          return x;
        })
      );
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiRoot}/users/${id}`).pipe(
      map((x) => {
        // auto logout if the logged in user deleted their own record
        if (id == this.currentUserValue.id) {
          this.logout();
        }
        return x;
      })
    );
  }
}
