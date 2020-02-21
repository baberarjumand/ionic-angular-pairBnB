import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlacesPage } from './places.page';

const routes: Routes = [
  {
    path: '',
    // component: PlacesPage,
    redirectTo: 'tabs',
    pathMatch: 'full'
  },
  // {
  //   path: 'discover',
  //   loadChildren: () => import('./discover/discover.module').then( m => m.DiscoverPageModule)
  // },
  // {
  //   path: 'offers',
  //   loadChildren: () => import('./offers/offers.module').then( m => m.OffersPageModule)
  // },
  {
    path: 'tabs',
    component: PlacesPage,
    children: [
      {
        path: 'discover',
        loadChildren: () => import('./discover/discover.module').then( m => m.DiscoverPageModule)
      },
      {
        path: 'offers',
        loadChildren: () => import('./offers/offers.module').then( m => m.OffersPageModule)
      },
      {
        path: '',
        redirectTo: 'discover',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlacesPageRoutingModule {}
