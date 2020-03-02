import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

// [
//   new Place(
//     'p1',
//     'Manhattan Mansion',
//     'In the heart of New York City.',
//     'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg',
//     149.99,
//     new Date('2020-03-01'),
//     new Date('2020-12-31'),
//     'user01'
//   ),
//   new Place(
//     'p2',
//     "L'Amour Toujours",
//     'A romantic place in Paris!',
//     'https://tophotel.news/wp-content/uploads/2018/06/25hours-francess-1024x512.jpg',
//     189.99,
//     new Date('2020-03-01'),
//     new Date('2020-12-31'),
//     'user02'
//   ),
//   new Place(
//     'p3',
//     'The Foggy Palace',
//     'Not your average city trip!',
//     'https://i.pinimg.com/originals/65/8f/77/658f77b9b527f89922ba996560a3e2b0.jpg',
//     99.99,
//     new Date('2020-03-01'),
//     new Date('2020-12-31'),
//     'user03'
//   )
// ]

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

  getPlaces() {
    // return [...this._places];
    return this._places.asObservable();
  }

  fetchPlaces() {
    return this.httpClient
      .get<{ [key: string]: PlaceData }>(
        'https://ionic-angular-udemy-by-max.firebaseio.com/offered-places.json'
      )
      .pipe(
        map(resData => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  new Date(resData[key].availableFrom),
                  new Date(resData[key].availableTo),
                  resData[key].userId
                )
              );
            }
          }
          return places;
          // testing spinner when no offers in array
          // return [];
        }),
        tap(places => {
          this._places.next(places);
        })
      );
  }

  getPlace(id: string) {
    // fetch locally
    // return this.getPlaces().pipe(
    //   take(1),
    //   map(places => {
    //     return { ...places.find(p => p.id === id) };
    //   })
    // );
    // fetch from server
    return this.httpClient
      .get<PlaceData>(
        `https://ionic-angular-udemy-by-max.firebaseio.com/offered-places/${id}.json`
      )
      .pipe(
        // tap(resData => {
        //   console.log(resData);
        // }),
        map(placeData => {
          return new Place(
            id,
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId
          );
        })
      );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const randomImageLink =
      'https://randomhall.co.uk/wp-content/uploads/2018/06/coutry-house-hotels-in-west-sussex-slifold-l.jpg';
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      randomImageLink,
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    return this.httpClient
      .post<{ name: string }>(
        'https://ionic-angular-udemy-by-max.firebaseio.com/offered-places.json',
        {
          ...newPlace,
          id: null
        }
      )
      .pipe(
        // tap(resData => {
        //   console.log(resData);
        // })
        switchMap(resData => {
          generatedId = resData.name;
          return this.getPlaces();
        }),
        take(1),
        tap(places => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );
    // this._places.push(newPlace);
    // return this.getPlaces().pipe(
    //   take(1),
    //   delay(1000),
    //   tap(places => {
    //     this._places.next(places.concat(newPlace));
    //   })
    // );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.getPlaces().pipe(
      take(1),
      switchMap(places => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        return this.httpClient.put(
          `https://ionic-angular-udemy-by-max.firebaseio.com/offered-places/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }
}
