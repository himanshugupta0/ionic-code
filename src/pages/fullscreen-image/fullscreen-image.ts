import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { SERVER_HOST } from "../../providers/constants";


@Component({
  selector: 'page-fullscreen-image',
  templateUrl: 'fullscreen-image.html'
})
export class FullscreenImage {

  data: any = '';
  serverhost: any = SERVER_HOST;

  constructor(public navParams: NavParams) {
    this.data = this.navParams.get('data');
  }
}
