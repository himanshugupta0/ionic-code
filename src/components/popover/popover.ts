import { Component } from '@angular/core';
import { App, ViewController } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { AboutUsPage } from "../../pages/about-us/about-us";
import { ContactUsPage } from "../../pages/contact-us/contact-us";

import {ProfilePage} from '../../pages/profile/profile';

@Component({
  templateUrl: 'popover.html'
})

export class PopoverContentPage {
  constructor(private app: App,
              public viewCtrl: ViewController,
              public events: Events
              ) {}

  viewProfile() {
    this.viewCtrl.dismiss().then(() => {
      this.app.getRootNav().push(ProfilePage);
    });
  }

  aboutus() {
    this.viewCtrl.dismiss().then(() => {
      this.app.getRootNav().push(AboutUsPage);
    });
  }

  contactus() {
    this.viewCtrl.dismiss().then(() => {
      this.app.getRootNav().push(ContactUsPage);
    });
  }

  logout() {
    this.events.publish('hello','munshiji');
    this.viewCtrl.dismiss();
    
    
  }

}