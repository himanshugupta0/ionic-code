import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CapturePicturePage } from './capture-picture';

@NgModule({
  declarations: [
    CapturePicturePage,
  ],
  imports: [
    IonicPageModule.forChild(CapturePicturePage),
  ],
  exports: [
    CapturePicturePage
  ]
})
export class CapturePicturePageModule {}
