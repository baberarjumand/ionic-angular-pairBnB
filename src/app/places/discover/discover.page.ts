import { Place } from './../place.model';
import { PlacesService } from './../places.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss']
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  private placesSub: Subscription;

  constructor(
    private placesService: PlacesService,
    private menuCtrl: MenuController
  ) {}

  ngOnInit() {
    // this.loadedPlaces = this.placesService.getPlaces();
    this.placesSub = this.placesService.getPlaces().subscribe(places => {
      this.loadedPlaces = places;
    });
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  onOpenMenu() {
    this.menuCtrl.toggle();
  }

  onFilterUpdate(event: any) {
    console.log(event.detail);
  }
}
