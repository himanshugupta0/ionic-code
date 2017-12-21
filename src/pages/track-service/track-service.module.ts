import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackServicePage } from './track-service';

@NgModule({
  declarations: [
    TrackServicePage,
  ],
  imports: [
    IonicPageModule.forChild(TrackServicePage),
  ],
 
  exports: [
    TrackServicePage
  ]
})
export class TrackServicePageModule {}
