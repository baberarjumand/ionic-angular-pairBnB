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
  ElementRef,
  Input
} from '@angular/core';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss']
})
export class ImagePickerComponent implements OnInit {
  selectedImage: string;
  @Output() imagePick = new EventEmitter<string | File>();
  useFilePicker = false;
  @ViewChild('filePicker', { static: false }) filePickerRef: ElementRef<
    HTMLInputElement
  >;
  @Input() showPreview = false;

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
    if (!Capacitor.isPluginAvailable('Camera')) {
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
        if (this.useFilePicker) {
          this.filePickerRef.nativeElement.click();
        }
        return false;
      });
  }

  onFileChosen(event: Event) {
    // console.log(event);
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      // TODO show alert
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.imagePick.emit(pickedFile);
    };
    fr.readAsDataURL(pickedFile);
  }
}
