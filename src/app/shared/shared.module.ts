import { CommonModule } from '@angular/common';
import { MapModalComponent } from './map-modal/map-modal.component';
import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [LocationPickerComponent, MapModalComponent],
  imports: [CommonModule],
  exports: [LocationPickerComponent, MapModalComponent],
  entryComponents: [MapModalComponent]
})
export class SharedModule {}
