import { take, tap, delay, switchMap } from 'rxjs/operators';
import { AuthService } from './../auth/auth.service';
import { Booking } from './booking.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private _bookings = new BehaviorSubject<Booking[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) {}

  getBookings() {
    return this._bookings.asObservable();
  }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImageUrl: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generatedId: string;
    const id = Math.random().toString();
    const newBooking = new Booking(
      id,
      placeId,
      this.authService.userId,
      placeTitle,
      placeImageUrl,
      firstName,
      lastName,
      guestNumber,
      dateFrom,
      dateTo
    );
    return this.http
      .post<{ name: string }>(
        'https://ionic-angular-udemy-by-max.firebaseio.com/bookings.json',
        { ...newBooking, id: null }
      )
      .pipe(
        switchMap(resData => {
          generatedId = resData.name;
          return this.getBookings();
        }),
        take(1),
        tap(bookings => {
          newBooking.id = generatedId;
          this._bookings.next(bookings.concat(newBooking));
        })
      );
  }

  cancelBooking(bookingId: string) {
    return this.getBookings().pipe(
      take(1),
      delay(1000),
      tap(bookings => {
        this._bookings.next(bookings.filter(b => b.id !== bookingId));
      })
    );
  }
}
