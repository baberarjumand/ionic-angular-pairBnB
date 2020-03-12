import { map, tap } from 'rxjs/operators';
import { User } from './user.model';
import { BehaviorSubject, from } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Plugins } from '@capacitor/core';

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
  // tslint:disable-next-line: variable-name
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
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`,
        {
          email,
          password,
          returnSecureToken: true
        }
      )
      .pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    // this._userIsAuthenticated = false;
    this._user.next(null);
  }

  signUp(email: string, password: string) {
    const firebaseApiKey = environment.firebaseWebApiKey;
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseApiKey}`,
        {
          email,
          password,
          returnSecureToken: true
        }
      )
      .pipe(tap(this.setUserData.bind(this)));
  }

  private setUserData(userData: AuthResponseData) {
    // generate timestamp that is an hour after this request
    // this const is in milliseconds
    const expirationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000
    );
    this._user.next(
      new User(
        userData.localId,
        userData.email,
        userData.idToken,
        expirationTime
      )
    );
    this.storeAuthData(
      userData.localId,
      userData.idToken,
      expirationTime.toISOString(),
      userData.email
    );
  }

  private storeAuthData(
    userId: string,
    token: string,
    tokenExpirationDate: string,
    email: string
  ) {
    const data = JSON.stringify({
      userId,
      token,
      tokenExpirationDate,
      email
    });
    Plugins.Storage.set({
      key: 'authData',
      value: data
    });
  }

  autoLogin() {
    return from(Plugins.Storage.get({ key: 'authData' })).pipe(
      map(storedData => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {
          userId: string;
          token: string;
          tokenExpirationDate: string;
          email: string;
        };
        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          return null;
        }
        const user = new User(
          parsedData.userId,
          parsedData.email,
          parsedData.token,
          expirationTime
        );
        return user;
      }),
      tap(user => {
        if (user) {
          this._user.next(user);
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }
}
