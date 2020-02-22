import { Place } from './../place.model';
import { PlacesService } from './../places.service';
import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

  loadedPlaces: Place[];

  constructor(private placesService: PlacesService,
              private menuCtrl: MenuController) { }

  ngOnInit() {
    this.loadedPlaces = this.placesService.getPlaces();
  }

  onOpenMenu() {
    this.menuCtrl.toggle();
  }

}
