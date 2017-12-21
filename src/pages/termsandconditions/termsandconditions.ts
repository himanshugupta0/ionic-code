import { Component, ViewChild } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'page-termsandconditions',
  templateUrl: 'termsandconditions.html',
})
export class TermsAndConditions {
  @ViewChild('inputName') inputName: any;

  details: any = '';
  myDate: String = new Date().toISOString();

  constructor(
    public viewCtrl: ViewController
  ) {}

  dismiss() {
    let data = { 'accept': 'no' };
    this.viewCtrl.dismiss(data);
  }

  accept() {
    let data = { 'accept': 'yes' };
    this.viewCtrl.dismiss(data);
  }

}
