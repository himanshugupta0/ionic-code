import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PayNowPage } from 'paynow';

@NgModule({
  declarations: [
    PayNowPage,
  ],
  imports: [
    IonicPageModule.forChild(PayNowPage),
  ],
  exports: [
    PayNowPage
  ]
})
export class PayNowPageModule {}
