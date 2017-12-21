import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController, ModalController, Events } from 'ionic-angular';
import { PaymentPage } from "../payment/payment";
import { TermsAndConditions } from "../termsandconditions/termsandconditions";

@IonicPage()
@Component({
  selector: 'page-paynow',
  templateUrl: 'paynow.html',
})
export class PayNowPage {

  formDtails: any = '';
  service_desc: any = '';

  constructor(
    public navParams: NavParams,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public events: Events
  ) {
    this.formDtails = this.navParams.get('formRes');
    this.service_desc = this.navParams.get('ser_desc');
    console.log(this.formDtails);
    console.log(this.service_desc);
  }

  onClickPayLater() {
    this.navCtrl.pop();
  }
  onClickPayNow() {
    let tncModal = this.modalCtrl.create(TermsAndConditions);
    tncModal.onDidDismiss(data => {
      console.log(data);
      if(data.accept == 'yes') {
        this.navCtrl.push(PaymentPage, {formRes: this.formDtails, ser_desc: this.service_desc});
      }
    });
    tncModal.present();
  }

}
