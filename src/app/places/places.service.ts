import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York City.',
      'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg',
      149.99,
      new Date('2020-03-01'),
      new Date('2020-12-31'),
      'user01'
    ),
    new Place(
      'p2',
      "L'Amour Toujours",
      'A romantic place in Paris!',
      'https://tophotel.news/wp-content/uploads/2018/06/25hours-francess-1024x512.jpg',
      189.99,
      new Date('2020-03-01'),
      new Date('2020-12-31'),
      'user02'
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip!',
      'https://i.pinimg.com/originals/65/8f/77/658f77b9b527f89922ba996560a3e2b0.jpg',
      99.99,
      new Date('2020-03-01'),
      new Date('2020-12-31'),
      'user03'
    )
  ];

  constructor(private authService: AuthService) {}

  getPlaces() {
    return [...this._places];
  }

  getPlace(id: string) {
    return { ...this._places.find(p => p.id === id) };
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const random_image_link =
      'https://randomhall.co.uk/wp-content/uploads/2018/06/coutry-house-hotels-in-west-sussex-slifold-l.jpg';
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      random_image_link,
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    this._places.push(newPlace);
  }
}
