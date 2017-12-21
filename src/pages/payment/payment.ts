import { Component } from '@angular/core';
import { IonicPage, NavParams, Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  formDtails: any = '';
  service_desc: any = '';

  constructor(
    public navParams: NavParams,
    public events: Events
  ) {
    this.formDtails = this.navParams.get('formRes');
    this.service_desc = this.navParams.get('ser_desc');
    console.log(this.formDtails);
    console.log(this.service_desc);
  }

}
