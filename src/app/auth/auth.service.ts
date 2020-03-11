import { map } from 'rxjs/operators';
import { User } from './user.model';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean; // optional field
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private _userIsAuthenticated = false;
  // private _userId = 'user01';
  // private _userId = 'user02';
  private _user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) {}

  get userIsAuthenticated() {
    // return this._userIsAuthenticated;
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );
  }

  get userId() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
  }

  login(email: string, password: string) {
    // this._userIsAuthenticated = true;
    const firebaseApiKey = environment.firebaseWebApiKey;
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`,
      {
        email,
        password,
        returnSecureToken: true
      }
    );
  }

  logout() {
    // this._userIsAuthenticated = false;
    this._user.next(null);
  }

  signUp(email: string, password: string) {
    const firebaseApiKey = environment.firebaseWebApiKey;
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseApiKey}`,
      {
        email,
        password,
        returnSecureToken: true
      }
    );
  }
}
