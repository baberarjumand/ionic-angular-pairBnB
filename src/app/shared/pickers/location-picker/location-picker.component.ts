import { map } from 'rxjs/operators';
import { MapModalComponent } from './../../map-modal/map-modal.component';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss']
})
export class LocationPickerComponent implements OnInit {
  constructor(private modalCtrl: ModalController, private http: HttpClient) {}

  ngOnInit() {}

  onPickLocation() {
    this.modalCtrl.create({ component: MapModalComponent }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        // console.log(modalData.data);
        if (!modalData.data) {
          return;
        }
        this.getAddress(modalData.data.lat, modalData.data.lng).subscribe(
          address => {
            console.log(address);
          }
        );
      });
      modalEl.present();
    });
  }

  private getAddress(lat: number, lng: number) {
    // const myApiKey = 'AIzaSyADuyhM00QWeLQy5HP2ruqO3uyVe42x-Ww';
    // my noob way
    // const httpRequestUrlString =
    //   'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
    //   lat +
    //   ',' +
    //   lng +
    //   '&key=' +
    //   environment.googleMapsApiKey;
    // new max way using back ticks
    // tslint:disable-next-line: max-line-length
    const httpRequestUrlString = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsApiKey}`;
    return this.http.get(httpRequestUrlString).pipe(
      map((geoData: any) => {
        // console.log(geoData);
        if (!geoData || !geoData.results || geoData.results.length === 0) {
          return null;
        }
        return geoData.results[0].formatted_address;
      })
    );
  }
}
