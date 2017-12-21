import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';


@Component({
  selector: 'page-service-description',
  templateUrl: 'service-description.html'
})
export class ServiceDescription {

  description: any = '';

  constructor(public navParams: NavParams) {
    this.description = this.navParams.get('description');
  }
}
