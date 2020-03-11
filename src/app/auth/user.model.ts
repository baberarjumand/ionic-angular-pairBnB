export class User {
  constructor(
    public id: string,
    public email: string,
    // tslint:disable-next-line: variable-name
    private _token: string,
    // tslint:disable-next-line: variable-name
    private _tokenExpirationDate: Date
  ) {}

  get token() {
      if (!this._tokenExpirationDate || this._tokenExpirationDate <= new Date()) {
          return null;
      }
      return this._token;
  }
}
