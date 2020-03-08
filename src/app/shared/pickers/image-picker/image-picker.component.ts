import { Platform } from '@ionic/angular';
import {
  Plugins,
  Capacitor,
  CameraSource,
  CameraResultType
} from '@capacitor/core';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from '@angular/core';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss']
})
export class ImagePickerComponent implements OnInit {
  selectedImage: string;
  @Output() imagePick = new EventEmitter<string>();
  useFilePicker = false;
  @ViewChild('filePicker', { static: false }) filePickerRef: ElementRef<
    HTMLInputElement
  >;

  constructor(private platform: Platform) {}

  ngOnInit() {
    console.log('Mobile: ', this.platform.is('mobile'));
    console.log('Hybrid: ', this.platform.is('hybrid'));
    console.log('iOS: ', this.platform.is('ios'));
    console.log('Android: ', this.platform.is('android'));
    console.log('Desktop: ', this.platform.is('desktop'));
    if (
      (this.platform.is('mobile') && !this.platform.is('hybrid')) ||
      this.platform.is('desktop')
    ) {
      this.useFilePicker = true;
    }
  }

  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera') || this.useFilePicker) {
      this.filePickerRef.nativeElement.click();
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 320,
      width: 200,
      // resultType: CameraResultType.Base64
      resultType: CameraResultType.DataUrl
    })
      .then(image => {
        // this.selectedImage = image.base64String;
        // this.imagePick.emit(image.base64String);
        this.selectedImage = image.dataUrl;
        this.imagePick.emit(image.dataUrl);
      })
      .catch(error => {
        console.log(error);
        return false;
      });
  }

  onFileChosen(event: Event) {
    console.log(event);
  }
}
